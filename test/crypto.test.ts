import { describe, expect, it } from 'bun:test';
import {
  canonicalJsonStringify,
  computeSha256,
  computeTermsHash,
  isValidHash32Hex,
  hexToBytes,
  bufferToHex,
} from '../src/crypto/hasher';
import {
  encryptDeliverable,
  decryptDeliverable,
} from '../src/crypto/encryption';

describe('Cryptographic Hasher & Serializer', () => {
  it('should deterministically stringify JSON keys regardless of insertion order', () => {
    const objA = { z: 1, a: 2, m: { y: 'hello', b: 'world' } };
    const objB = { a: 2, m: { b: 'world', y: 'hello' }, z: 1 };

    expect(canonicalJsonStringify(objA)).toBe(canonicalJsonStringify(objB));
    expect(canonicalJsonStringify(objA)).toBe('{"a":2,"m":{"b":"world","y":"hello"},"z":1}');
  });

  it('should compute valid 64-char hex SHA-256 digest', async () => {
    const input = 'Escrow-FairLance-Soroban-2026';
    const hash = await computeSha256(input);

    expect(hash).toHaveLength(64);
    expect(isValidHash32Hex(hash)).toBe(true);
  });

  it('should compute identical terms hash for identical term objects', async () => {
    const terms1 = { title: 'Audit Soroban Contract', budget: 1500, client: 'GAAX...' };
    const terms2 = { client: 'GAAX...', budget: 1500, title: 'Audit Soroban Contract' };

    const hash1 = await computeTermsHash(terms1);
    const hash2 = await computeTermsHash(terms2);

    expect(hash1).toBe(hash2);
  });

  it('should convert hex strings to bytes and back to hex cleanly', () => {
    const hex = '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';
    const bytes = hexToBytes(hex);
    expect(bytes).toHaveLength(32);
    expect(bufferToHex(bytes)).toBe(hex);
  });
});

describe('AES-256-GCM Encryption Suite', () => {
  it('should encrypt and successfully decrypt deliverable text using passphrase', async () => {
    const plaintext = 'Secret Deliverable: Soroban Rust source code archive v1.0';
    const passphrase = 'SuperSecretEncryptionKey123!';

    const envelope = await encryptDeliverable(plaintext, passphrase);

    expect(envelope.version).toBe('aes-256-gcm-v1');
    expect(envelope.iv).toHaveLength(24); // 12 bytes = 24 hex chars
    expect(envelope.salt).toHaveLength(32); // 16 bytes = 32 hex chars
    expect(envelope.ciphertext.length).toBeGreaterThan(0);
    expect(envelope.sha256).toHaveLength(64);

    const decryptedBuffer = await decryptDeliverable(envelope, passphrase);
    const decryptedText = new TextDecoder().decode(decryptedBuffer);

    expect(decryptedText).toBe(plaintext);
  });

  it('should fail decryption when given wrong passphrase', async () => {
    const plaintext = 'Confidential milestone architecture';
    const envelope = await encryptDeliverable(plaintext, 'correct-password');

    let threw = false;
    try {
      await decryptDeliverable(envelope, 'wrong-password');
    } catch {
      threw = true;
    }

    expect(threw).toBe(true);
  });
});
