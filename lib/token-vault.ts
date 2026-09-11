import 'server-only';
import { createClient } from './supabase/server';
import { encrypt, decrypt } from './crypto';

interface TokensToSave {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string; // ISO string
  scopes?: string[];
}

/**
 * Encrypts and saves the given tokens to the token_vault.
 */
export async function saveTokens(accountId: string, tokens: TokensToSave) {
  const supabase = createClient();
  
  const accessTokenEncrypted = encrypt(tokens.accessToken);
  const refreshTokenEncrypted = tokens.refreshToken ? encrypt(tokens.refreshToken) : null;
  
  const { error } = await supabase
    .from('token_vault')
    .upsert(
      {
        account_id: accountId,
        access_token_encrypted: accessTokenEncrypted,
        refresh_token_encrypted: refreshTokenEncrypted,
        expires_at: tokens.expiresAt,
        scopes: tokens.scopes,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'account_id' }
    );
    
  if (error) {
    throw new Error('Failed to save tokens securely to the vault.');
  }
}

/**
 * Retrieves and decrypts the access token from the vault.
 * Automatically refreshes the token if it's expired and a refresh token exists (e.g., for YouTube).
 * Never log or expose the plaintext token in error messages.
 */
export async function getDecryptedToken(accountId: string): Promise<string> {
  const supabase = createClient();
  
  // Join connected_accounts to get the platform for provider-specific refresh logic
  const { data, error } = await supabase
    .from('token_vault')
    .select(`
      access_token_encrypted,
      refresh_token_encrypted,
      expires_at,
      connected_accounts!inner(platform)
    `)
    .eq('account_id', accountId)
    .single();
    
  if (error || !data) {
    throw new Error('Failed to retrieve token from the vault.');
  }
  
  let accessToken = '';
  try {
    accessToken = decrypt(data.access_token_encrypted);
  } catch (e) {
    throw new Error('Failed to decrypt token.');
  }

  // Check if token is expired or expiring within 5 minutes
  const isExpired = data.expires_at && new Date(data.expires_at).getTime() < Date.now() + 5 * 60 * 1000;

  if (isExpired && data.refresh_token_encrypted) {
    const platform = (data.connected_accounts as any).platform;

    if (platform === 'youtube') {
      try {
        const refreshToken = decrypt(data.refresh_token_encrypted);
        
        const clientId = process.env.YOUTUBE_CLIENT_ID;
        const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          throw new Error('YouTube OAuth credentials missing');
        }

        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('refresh_token', refreshToken);
        params.append('grant_type', 'refresh_token');

        const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString()
        });

        const refreshData = await refreshRes.json();

        if (!refreshRes.ok || refreshData.error) {
          // If refresh fails permanently, mark account for reconnect
          await markNeedsReconnect(accountId);
          throw new Error(refreshData.error_description || refreshData.error || 'Failed to refresh YouTube token');
        }

        accessToken = refreshData.access_token;
        const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000).toISOString();

        // Save new token to vault
        await supabase
          .from('token_vault')
          .update({
            access_token_encrypted: encrypt(accessToken),
            expires_at: newExpiresAt,
            updated_at: new Date().toISOString()
          })
          .eq('account_id', accountId);

      } catch (e) {
        console.error('Token refresh failed:', e);
        throw new Error('Failed to refresh token');
      }
    }
  } else if (isExpired) {
    // Expired but no refresh token
    await markNeedsReconnect(accountId);
    throw new Error('Token is expired and cannot be refreshed');
  }

  return accessToken;
}

/**
 * Updates the connected_accounts status to 'needs_reconnect'.
 */
export async function markNeedsReconnect(accountId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('connected_accounts')
    .update({ status: 'needs_reconnect' })
    .eq('id', accountId);
    
  if (error) {
    throw new Error('Failed to update account status.');
  }
}
