/**
 * Deterministically serializes object keys for canonical JSON terms hashing.
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
 * Computes SHA-256 hex string using browser Web Crypto API (crypto.subtle)
 * with fallback to Node.js crypto in test/SSR environments.
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

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    return bufferToHex(new Uint8Array(hashBuffer));
  } else {
    // SSR / Node fallback
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(Buffer.from(buffer)).digest('hex');
  }
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

function bufferToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
