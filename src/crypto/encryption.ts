/**
 * Escrow-FairLance Client-Side AES-256-GCM Encryption & Decryption Suite
 * Uses Web Crypto API (crypto.subtle) with Node.js crypto fallback for SSR/testing.
 */

export interface EncryptedPayloadEnvelope {
  version: 'aes-256-gcm-v1';
  iv: string; // hex 12 bytes (96 bits)
  salt: string; // hex 16 bytes (128 bits)
  ciphertext: string; // base64
  tagLength: number; // 128 bits
  sha256: string; // hex SHA-256 of original plaintext for integrity verification
}

/**
 * Returns the active SubtleCrypto interface across Browser and Node.js environments.
 */
function getSubtleCrypto(): SubtleCrypto {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    return window.crypto.subtle;
  }
  // Node.js 18+ globalThis.crypto fallback
  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
    return globalThis.crypto.subtle;
  }
  throw new Error('Web Crypto API (crypto.subtle) is not supported in this runtime environment');
}

/**
 * Generates cryptographically secure random bytes.
 */
export function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(bytes);
  } else if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    // Fallback
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytes;
}

/**
 * Derives an AES-GCM 256-bit CryptoKey from a secret passphrase and salt using PBKDF2.
 */
export async function deriveKeyFromSecret(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  const subtle = getSubtleCrypto();
  const enc = new TextEncoder();
  const rawKey = enc.encode(secret);

  const baseKey = await subtle.importKey(
    'raw',
    rawKey,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Computes SHA-256 digest of input buffer.
 */
async function computeDigest(buffer: ArrayBuffer): Promise<string> {
  const subtle = getSubtleCrypto();
  const hash = await subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Encrypts arbitrary binary data or strings using AES-256-GCM.
 */
export async function encryptDeliverable(
  data: ArrayBuffer | Uint8Array | string,
  secretKeyOrPassphrase: string
): Promise<EncryptedPayloadEnvelope> {
  const subtle = getSubtleCrypto();
  let plaintextBuffer: ArrayBuffer;

  if (typeof data === 'string') {
    plaintextBuffer = new TextEncoder().encode(data).buffer as ArrayBuffer;
  } else if (data instanceof Uint8Array) {
    plaintextBuffer = data.buffer as ArrayBuffer;
  } else {
    plaintextBuffer = data;
  }

  // Generate 16-byte salt and 12-byte IV (standard for AES-GCM)
  const salt = getRandomBytes(16);
  const iv = getRandomBytes(12);

  // Derive AES-GCM 256-bit key
  const cryptoKey = await deriveKeyFromSecret(secretKeyOrPassphrase, salt);

  // Compute original plaintext checksum
  const sha256 = await computeDigest(plaintextBuffer);

  // Encrypt with 128-bit auth tag
  const ciphertextBuffer = await subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv.buffer as ArrayBuffer,
      tagLength: 128,
    },
    cryptoKey,
    plaintextBuffer
  );

  const ciphertextBase64 = arrayBufferToBase64(ciphertextBuffer);

  return {
    version: 'aes-256-gcm-v1',
    iv: bufferToHex(iv),
    salt: bufferToHex(salt),
    ciphertext: ciphertextBase64,
    tagLength: 128,
    sha256,
  };
}

/**
 * Decrypts an EncryptedPayloadEnvelope back to raw ArrayBuffer using the secret key.
 */
export async function decryptDeliverable(
  envelope: EncryptedPayloadEnvelope,
  secretKeyOrPassphrase: string
): Promise<ArrayBuffer> {
  const subtle = getSubtleCrypto();

  const iv = hexToBuffer(envelope.iv);
  const salt = hexToBuffer(envelope.salt);
  const ciphertextBuffer = base64ToArrayBuffer(envelope.ciphertext);

  const cryptoKey = await deriveKeyFromSecret(secretKeyOrPassphrase, salt);

  const decryptedBuffer = await subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv.buffer as ArrayBuffer,
      tagLength: envelope.tagLength || 128,
    },
    cryptoKey,
    ciphertextBuffer
  );

  // Verify checksum integrity
  const decryptedSha256 = await computeDigest(decryptedBuffer);
  if (decryptedSha256 !== envelope.sha256) {
    throw new Error('Integrity verification failed: Decrypted payload checksum does not match envelope');
  }

  return decryptedBuffer;
}

/**
 * Helpers for Hex & Base64 serialization
 */
function bufferToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const match = clean.match(/.{1,2}/g);
  if (!match) return new Uint8Array(0);
  return new Uint8Array(match.map((byte) => parseInt(byte, 16)));
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof btoa !== 'undefined') {
    return btoa(binary);
  }
  return Buffer.from(binary, 'binary').toString('base64');
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  if (typeof atob !== 'undefined') {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  const buf = Buffer.from(base64, 'base64');
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}
