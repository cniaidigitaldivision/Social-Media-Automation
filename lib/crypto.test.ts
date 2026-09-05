import { encrypt, decrypt } from './crypto';
import assert from 'assert';

function runTests() {
  console.log('Running crypto tests...');
  
  const originalText = 'my-super-secret-token-123!@#';
  
  // Test 1: Round-trip encrypt/decrypt
  const encrypted = encrypt(originalText);
  const decrypted = decrypt(encrypted);
  assert.strictEqual(decrypted, originalText, 'Decrypted text should match original');
  console.log('✓ Round-trip encrypt/decrypt passed');
  
  // Test 2: Tampered ciphertext fails to decrypt
  const parts = encrypted.split(':');
  // tamper the ciphertext part
  const tampered = `${parts[0]}:${parts[1]}:A${parts[2].substring(1)}`;
  let threw = false;
  try {
    decrypt(tampered);
  } catch (e) {
    threw = true;
  }
  assert.strictEqual(threw, true, 'Tampered ciphertext should throw');
  console.log('✓ Tampering detection passed');
  
  // Test 3: Two encryptions of same input are different
  const encrypted2 = encrypt(originalText);
  assert.notStrictEqual(encrypted, encrypted2, 'Ciphertexts should be different for same input');
  console.log('✓ IV randomness passed');
  
  // Test 4: HMAC signing and verification
  const payload = JSON.stringify({ workspaceId: 'w-123', nonce: 'abc', exp: Date.now() + 600000 });
  const signed = encrypt.signState ? encrypt.signState(payload) : require('./crypto').signState(payload);
  const verifyState = require('./crypto').verifyState;
  
  const verified = verifyState(signed);
  assert.strictEqual(verified, payload, 'Verified payload should match original');
  console.log('✓ HMAC verification passed');
  
  // Test 5: Tampered HMAC signature
  const [payload64, sig] = signed.split('.');
  const tamperedSig = sig.substring(0, sig.length - 1) + (sig.endsWith('A') ? 'B' : 'A');
  let sigThrew = false;
  try {
    verifyState(`${payload64}.${tamperedSig}`);
  } catch (e) {
    sigThrew = true;
  }
  assert.strictEqual(sigThrew, true, 'Tampered signature should throw');
  console.log('✓ HMAC tampering detection passed');
  
  console.log('All tests passed!');
}

runTests();
