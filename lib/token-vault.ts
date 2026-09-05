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
 * Never log or expose the plaintext token in error messages.
 */
export async function getDecryptedToken(accountId: string): Promise<string> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('token_vault')
    .select('access_token_encrypted')
    .eq('account_id', accountId)
    .single();
    
  if (error || !data) {
    throw new Error('Failed to retrieve token from the vault.');
  }
  
  try {
    return decrypt(data.access_token_encrypted);
  } catch (e) {
    throw new Error('Failed to decrypt token.');
  }
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
