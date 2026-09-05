import 'server-only';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error('Missing or invalid ENCRYPTION_KEY — run `openssl rand -base64 32` and add it to .env.local');
}

const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'base64');
if (keyBuffer.length !== 32) {
  throw new Error('Missing or invalid ENCRYPTION_KEY — run `openssl rand -base64 32` and add it to .env.local');
}

const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:ciphertext
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format');
  }
  
  const [ivBase64, authTagBase64, ciphertext] = parts;
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export function signState(payload: string): string {
  const hmac = crypto.createHmac('sha256', keyBuffer);
  hmac.update(payload);
  const signature = hmac.digest('base64url');
  // Return the base64url encoded payload and signature separated by a dot
  const payloadBase64 = Buffer.from(payload, 'utf8').toString('base64url');
  return `${payloadBase64}.${signature}`;
}

export function verifyState(signedState: string): string {
  const parts = signedState.split('.');
  if (parts.length !== 2) {
    throw new Error('Invalid signed state format');
  }
  
  const [payloadBase64, signature] = parts;
  const payload = Buffer.from(payloadBase64, 'base64url').toString('utf8');
  
  const hmac = crypto.createHmac('sha256', keyBuffer);
  hmac.update(payload);
  const expectedSignature = hmac.digest('base64url');
  
  // Use constant time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(signature, 'base64url'), Buffer.from(expectedSignature, 'base64url'))) {
    throw new Error('Invalid state signature');
  }
  
  return payload;
}
