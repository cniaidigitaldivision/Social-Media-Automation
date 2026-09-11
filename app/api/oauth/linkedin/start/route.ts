import { NextRequest, NextResponse } from 'next/server';
import { signState } from '@/lib/crypto';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const workspaceId = searchParams.get('workspace_id');

  if (!workspaceId) {
    return new Response('Missing workspace_id', { status: 400 });
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new Response('LinkedIn OAuth is not configured on the server', { status: 500 });
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
    'w_organization_social',
    'r_organization_social',
    'rw_organization_admin',
    'openid',
    'profile'
  ].join(' ');

  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', scopes);

  return NextResponse.redirect(authUrl.toString());
}
