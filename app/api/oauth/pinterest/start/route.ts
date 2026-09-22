import { NextRequest, NextResponse } from 'next/server';
import { signState } from '@/lib/crypto';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const workspaceId = searchParams.get('workspace_id');

  if (!workspaceId) {
    return new Response('Missing workspace_id', { status: 400 });
  }

  const clientId = process.env.PINTEREST_CLIENT_ID;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new Response('Pinterest OAuth is not configured on the server', { status: 500 });
  }

  const nonce = crypto.randomBytes(16).toString('base64url');
  
  // 10 minute expiry
  const expiry = Date.now() + 10 * 60 * 1000;
  
  const payload = JSON.stringify({
    workspaceId,
    nonce,
    exp: expiry
  });

  const state = signState(payload);

  const scopes = [
    'boards:read',
    'boards:write',
    'pins:read',
    'pins:write',
    'user_accounts:read'
  ].join(','); // Pinterest uses comma separated scopes

  const authUrl = new URL('https://www.pinterest.com/oauth/');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('response_type', 'code');

  return NextResponse.redirect(authUrl.toString());
}
