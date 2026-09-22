import { NextRequest, NextResponse } from 'next/server';
import { verifyState, encrypt } from '@/lib/crypto';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { saveTokens } from '@/lib/token-vault';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const stateParam = searchParams.get('state');
  const code = searchParams.get('code');

  if (error) {
    let workspaceId = '';
    try {
      if (stateParam) {
        const payloadStr = verifyState(stateParam);
        const payload = JSON.parse(payloadStr);
        workspaceId = payload.workspaceId;
      }
    } catch (e) {
      // Ignore
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

  const clientId = process.env.PINTEREST_CLIENT_ID;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return new Response('Pinterest OAuth is not configured on the server', { status: 500 });
  }

  try {
    // 1. Exchange code for access and refresh tokens
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'authorization_code');
    tokenParams.append('code', code);
    tokenParams.append('redirect_uri', redirectUri);

    const tokenRes = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      },
      body: tokenParams.toString()
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      throw new Error(tokenData.message || tokenData.error || 'Failed to exchange code');
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token; 
    const expiresIn = tokenData.expires_in;
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Fetch user details for username
    const userRes = await fetch('https://api.pinterest.com/v5/user_account', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    if (!userRes.ok) {
        throw new Error('Failed to fetch user account details from Pinterest');
    }
    const userData = await userRes.json();
    const username = userData.username;
    const userAvatar = userData.profile_image;

    // 2. Fetch user boards
    const boardsRes = await fetch('https://api.pinterest.com/v5/boards', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    const boardsData = await boardsRes.json();

    if (!boardsRes.ok) {
      throw new Error(boardsData.message || 'Failed to fetch Pinterest boards');
    }

    const boards = boardsData.items || [];

    if (boards.length === 0) {
      throw new Error('No Pinterest boards found for this account. Please create a board first.');
    }

    // Attach username and avatar to boards for selection UI
    const enrichedBoards = boards.map((b: any) => ({
      ...b,
      username,
      avatar: userAvatar
    }));

    const supabase = await createClient();

    // Auto-select if exactly 1 board
    if (enrichedBoards.length === 1) {
      const board = enrichedBoards[0];
      const { data: account, error: accountError } = await supabase
        .from('connected_accounts')
        .upsert({
          workspace_id: workspaceId,
          platform: 'pinterest',
          platform_account_id: board.id,
          account_name: `${board.name} (${board.username})`,
          account_avatar_url: board.avatar || null,
          status: 'active'
        }, { onConflict: 'workspace_id, platform, platform_account_id' })
        .select('id')
        .single();
        
      if (accountError || !account) {
        throw new Error('Failed to insert Pinterest account');
      }

      await saveTokens(account.id, {
        accessToken,
        refreshToken,
        expiresAt,
      });

      const redirectUrl = new URL(`/workspaces/${workspaceId}/accounts`, request.nextUrl.origin);
      return NextResponse.redirect(redirectUrl.toString());
    }

    // 3. Store in oauth_sessions and redirect to selection screen
    const pagesEncrypted = encrypt(JSON.stringify(enrichedBoards));
    const tokensEncrypted = encrypt(JSON.stringify({ accessToken, refreshToken, expiresAt }));
    const sessionExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const { data: sessionData, error: sessionError } = await supabase
      .from('oauth_sessions')
      .insert({
        workspace_id: workspaceId,
        pages_json: pagesEncrypted,
        user_token_encrypted: tokensEncrypted,
        expires_at: sessionExpiresAt
      })
      .select('id')
      .single();

    if (sessionError || !sessionData) {
      throw new Error('Failed to create session for board selection');
    }

    const cookieStore = await cookies();
    cookieStore.set('pinterest_oauth_session', sessionData.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60, // 10 minutes
      path: '/'
    });

    const redirectUrl = new URL(`/workspaces/${workspaceId}/accounts/pinterest/select`, request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl.toString());

  } catch (err: any) {
    const redirectUrl = new URL(`/workspaces/${workspaceId}/accounts`, request.nextUrl.origin);
    redirectUrl.searchParams.set('oauth_error', err.message || 'Authentication failed');
    return NextResponse.redirect(redirectUrl.toString());
  }
}
