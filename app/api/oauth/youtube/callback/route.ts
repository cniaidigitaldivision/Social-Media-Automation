import { NextRequest, NextResponse } from 'next/server';
import { verifyState, encrypt } from '@/lib/crypto';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const stateParam = searchParams.get('state');
  const code = searchParams.get('code');

  // Handle Google OAuth errors (e.g. user denied)
  if (error) {
    let workspaceId = '';
    try {
      if (stateParam) {
        const payloadStr = verifyState(stateParam);
        const payload = JSON.parse(payloadStr);
        workspaceId = payload.workspaceId;
      }
    } catch (e) {
      // Ignore if state is invalid
    }

    if (workspaceId) {
      const redirectUrl = new URL(`/workspaces/${workspaceId}/accounts`, request.nextUrl.origin);
      redirectUrl.searchParams.set('oauth_error', errorDescription || error || 'User denied access');
      return NextResponse.redirect(redirectUrl.toString());
    }

    return new Response(`OAuth Error: ${errorDescription || error}`, { status: 400 });
  }

  if (!stateParam || !code) {
    return new Response('Missing state or code', { status: 400 });
  }

  let workspaceId = '';

  // Verify state
  try {
    const payloadStr = verifyState(stateParam);
    const payload = JSON.parse(payloadStr);

    if (Date.now() > payload.exp) {
      throw new Error('State expired');
    }

    workspaceId = payload.workspaceId;
  } catch (e) {
    return new Response('Invalid or expired state', { status: 400 });
  }

  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return new Response('YouTube OAuth is not configured on the server', { status: 500 });
  }

  try {
    // 1. Exchange code for access and refresh tokens
    const tokenParams = new URLSearchParams();
    tokenParams.append('client_id', clientId);
    tokenParams.append('client_secret', clientSecret);
    tokenParams.append('code', code);
    tokenParams.append('redirect_uri', redirectUri);
    tokenParams.append('grant_type', 'authorization_code');

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString()
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange code');
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token; // may be undefined if not first auth with prompt=consent
    const expiresIn = tokenData.expires_in;
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // 2. Fetch channels the account OWNS (mine=true) AND channels it MANAGES (managedByMe=true)
    //    in parallel, then deduplicate by channel ID.
    //
    //    Note on managedByMe: this covers legacy Brand Account manager roles only.
    //    Channels added via the newer YouTube Studio "Channel Permissions" system are
    //    NOT accessible through the YouTube Data API regardless of the parameter used.
    //    If managedByMe returns a 403 (common for non-CMS/non-partner accounts), we
    //    silently ignore it and fall back to owned channels only.
    //
    //    Server logs will report exactly how many channels each call returned so you
    //    can diagnose whether managedByMe is working for this account.

    const buildChannelsUrl = (filter: 'mine' | 'managedByMe') => {
      const url = new URL('https://www.googleapis.com/youtube/v3/channels');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set(filter, 'true');
      url.searchParams.set('maxResults', '50');
      return url.toString();
    };

    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    const [ownedRes, managedRes] = await Promise.all([
      fetch(buildChannelsUrl('mine'), { headers: authHeaders }),
      fetch(buildChannelsUrl('managedByMe'), { headers: authHeaders }),
    ]);

    const ownedData = await ownedRes.json();

    if (!ownedRes.ok || ownedData.error) {
      throw new Error(ownedData.error?.message || 'Failed to fetch YouTube channels');
    }

    const ownedItems: any[] = ownedData.items || [];

    // managedByMe may legitimately 403 for standard (non-CMS) accounts — swallow the error
    let managedItems: any[] = [];
    if (managedRes.ok) {
      const managedData = await managedRes.json();
      if (!managedData.error) {
        managedItems = managedData.items || [];
      } else {
        console.warn('[YouTube OAuth] managedByMe returned an API error:', managedData.error?.message);
      }
    } else {
      const errBody = await managedRes.text().catch(() => '');
      console.warn(`[YouTube OAuth] managedByMe fetch failed (${managedRes.status}):`, errBody);
    }

    // Deduplicate: owned channels take precedence; managed channels are appended if not already present
    const seenIds = new Set<string>(ownedItems.map((c: any) => c.id));
    for (const c of managedItems) {
      if (!seenIds.has(c.id)) {
        seenIds.add(c.id);
        ownedItems.push(c);
      }
    }

    const allChannels = ownedItems;

    console.log(
      `[YouTube OAuth] Channels found — owned: ${ownedData.items?.length ?? 0}, ` +
      `managed (via managedByMe): ${managedItems.length}, total unique: ${allChannels.length}`
    );

    if (allChannels.length === 0) {
      throw new Error('No YouTube channels found for this account.');
    }

    const supabase = await createClient();

    // 3. ALWAYS route to the selection screen so the user can explicitly choose.
    //    Never auto-connect silently, even if only 1 channel is returned.
    const channelsEncrypted = encrypt(JSON.stringify(allChannels));
    const tokensEncrypted = encrypt(JSON.stringify({ accessToken, refreshToken, expiresAt }));
    const sessionExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const { data: sessionData, error: sessionError } = await supabase
      .from('oauth_sessions')
      .insert({
        workspace_id: workspaceId,
        pages_json: channelsEncrypted,
        user_token_encrypted: tokensEncrypted,
        expires_at: sessionExpiresAt
      })
      .select('id')
      .single();

    if (sessionError || !sessionData) {
      throw new Error('Failed to create session for channel selection');
    }

    const cookieStore = await cookies();
    cookieStore.set('youtube_oauth_session', sessionData.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60, // 10 minutes
      path: '/'
    });

    const redirectUrl = new URL(`/workspaces/${workspaceId}/accounts/youtube/select`, request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl.toString());

  } catch (err: any) {
    const redirectUrl = new URL(`/workspaces/${workspaceId}/accounts`, request.nextUrl.origin);
    redirectUrl.searchParams.set('oauth_error', err.message || 'Authentication failed');
    return NextResponse.redirect(redirectUrl.toString());
  }
}
