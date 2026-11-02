/**
 * Escrow-FairLance Cryptographic Hashing & Canonical Terms Serializer
 * Provides deterministic canonical JSON stringification and SHA-256 digests.
 */

/**
 * Deterministically serializes object keys for canonical JSON terms hashing.
 * Guarantees identical hash across disparate platforms and runtimes.
 */
export function canonicalJsonStringify(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => canonicalJsonStringify(item)).join(',') + ']';
  }

  const record = obj as Record<string, unknown>;
  const sortedKeys = Object.keys(record).sort();
  const entries = sortedKeys.map(
    (key) => `${JSON.stringify(key)}:${canonicalJsonStringify(record[key])}`
  );
  return '{' + entries.join(',') + '}';
}

/**
 * Returns SubtleCrypto across Browser, Bun, and Node.js environments.
 */
function getSubtle(): SubtleCrypto {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    return window.crypto.subtle;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
    return globalThis.crypto.subtle;
  }
  throw new Error('Web Crypto API (crypto.subtle) unavailable in current environment');
}

/**
 * Computes SHA-256 hex string using standard Web Crypto API.
 */
export async function computeSha256(data: ArrayBuffer | Uint8Array | string): Promise<string> {
  let buffer: ArrayBuffer;

  if (typeof data === 'string') {
    buffer = new TextEncoder().encode(data).buffer as ArrayBuffer;
  } else if (data instanceof Uint8Array) {
    buffer = data.buffer as ArrayBuffer;
  } else {
    buffer = data;
  }

  const subtle = getSubtle();
  const hashBuffer = await subtle.digest('SHA-256', buffer);
  return bufferToHex(new Uint8Array(hashBuffer));
}

/**
 * Computes SHA-256 of a browser File object for deliverable uploads.
 */
export async function computeFileSha256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return computeSha256(arrayBuffer);
}

/**
 * Computes canonical terms hash for job creation.
 */
export async function computeTermsHash(terms: Record<string, unknown>): Promise<string> {
  const canonicalJson = canonicalJsonStringify(terms);
  return computeSha256(canonicalJson);
}

/**
 * Validates whether a given string is a valid 32-byte (64 hex characters) hash.
 */
export function isValidHash32Hex(hash: string): boolean {
  if (!hash) return false;
  const clean = hash.startsWith('0x') ? hash.slice(2) : hash;
  return /^[0-9a-fA-F]{64}$/.test(clean);
}

/**
 * Converts a hex string into a Buffer / Uint8Array.
 */
export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const match = clean.match(/.{1,2}/g);
  if (!match) return new Uint8Array(0);
  return new Uint8Array(match.map((byte) => parseInt(byte, 16)));
}

/**
 * Converts a Uint8Array into a lowercase hex string.
 */
export function bufferToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
