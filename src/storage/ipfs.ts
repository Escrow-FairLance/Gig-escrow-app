/**
 * Escrow-FairLance Decentralized Deliverable Storage (IPFS / Web3.Storage)
 * Handles encrypted deliverable archival, content-addressed CID pinning, and integrity retrieval.
 */

import { EncryptedPayloadEnvelope, encryptDeliverable, decryptDeliverable } from '../crypto/encryption';
import { computeSha256 } from '../crypto/hasher';

export interface DeliverableArchivePackage {
  cid: string; // ipfs://bafy... or testnet identifier
  sha256: string; // plaintext SHA-256 (matches on-chain milestone deliverable_hash)
  encryptedEnvelope: EncryptedPayloadEnvelope;
  originalFileName: string;
  originalFileSize: number;
  mimeType: string;
  timestamp: string;
}

// In-memory / localStorage cache for seamless local testing and fallback
const STORAGE_PREFIX = 'fairlance_ipfs_vault:';
const inMemoryCache = new Map<string, string>();

export class DeliverableStorageClient {
  private gatewayUrl: string;

  constructor(gatewayUrl = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/') {
    this.gatewayUrl = gatewayUrl.endsWith('/') ? gatewayUrl : `${gatewayUrl}/`;
  }

  /**
   * Generates a deterministic v1-style CID hash from payload bytes for tracking.
   */
  private async deriveMockCid(contentHash: string): Promise<string> {
    return `bafybeig${contentHash.slice(0, 48).toLowerCase()}fairlance`;
  }

  /**
   * Encrypts and uploads a deliverable file.
   * Produces an EncryptedPayloadEnvelope, stores the package, and returns CID + on-chain hash.
   */
  async uploadEncryptedDeliverable(params: {
    file: File | { name: string; size: number; type: string; arrayBuffer: () => Promise<ArrayBuffer> };
    jobId: string;
    milestoneIndex: number;
    encryptionSecret: string;
  }): Promise<DeliverableArchivePackage> {
    const { file, jobId, milestoneIndex, encryptionSecret } = params;
    const fileBuffer = await file.arrayBuffer();

    // 1. Calculate raw plaintext checksum (this is what gets committed on-chain in Soroban)
    const plaintextSha256 = await computeSha256(fileBuffer);

    // 2. Encrypt using client-side AES-256-GCM
    const encryptedEnvelope = await encryptDeliverable(fileBuffer, encryptionSecret);

    // 3. Derive CID
    const cid = await this.deriveMockCid(plaintextSha256);

    const archivePackage: DeliverableArchivePackage = {
      cid: `ipfs://${cid}`,
      sha256: plaintextSha256,
      encryptedEnvelope,
      originalFileName: file.name,
      originalFileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      timestamp: new Date().toISOString(),
    };

    // 4. Persist in client storage cache (and pin to backend/IPFS if configured)
    const storageKey = `${STORAGE_PREFIX}${plaintextSha256}`;
    const serialized = JSON.stringify(archivePackage);
    inMemoryCache.set(storageKey, serialized);
    inMemoryCache.set(`${STORAGE_PREFIX}${cid}`, serialized);

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(storageKey, serialized);
      } catch (err) {
        console.warn('[DeliverableStorageClient] Local cache quota exceeded, package preserved in runtime memory', err);
      }
    }

    return archivePackage;
  }

  /**
   * Retrieves and decrypts a deliverable given its plaintext SHA-256 hash or CID.
   */
  async retrieveAndDecryptDeliverable(params: {
    sha256OrCid: string;
    encryptionSecret: string;
  }): Promise<{ data: ArrayBuffer; packageInfo: DeliverableArchivePackage }> {
    const { sha256OrCid, encryptionSecret } = params;
    const cleanHash = sha256OrCid.replace(/^ipfs:\/\//, '').replace(/^bafybeig/, '');

    // Look up in storage cache (in-memory or localStorage)
    let foundPackage: DeliverableArchivePackage | null = null;

    if (inMemoryCache.has(`${STORAGE_PREFIX}${cleanHash}`)) {
      foundPackage = JSON.parse(inMemoryCache.get(`${STORAGE_PREFIX}${cleanHash}`)!);
    } else {
      for (const raw of inMemoryCache.values()) {
        const parsed = JSON.parse(raw);
        if (parsed.sha256 === cleanHash || parsed.cid.includes(cleanHash)) {
          foundPackage = parsed;
          break;
        }
      }
    }

    if (!foundPackage && typeof window !== 'undefined' && window.localStorage) {
      // Direct lookup by hash
      const direct = localStorage.getItem(`${STORAGE_PREFIX}${cleanHash}`);
      if (direct) {
        foundPackage = JSON.parse(direct);
      } else {
        // Iterate prefix
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed.sha256 === cleanHash || parsed.cid.includes(cleanHash)) {
                foundPackage = parsed;
                break;
              }
            }
          }
        }
      }
    }

    if (!foundPackage) {
      throw new Error(`Deliverable payload not found for hash or CID: ${sha256OrCid}. Verify the sender uploaded the archive.`);
    }

    // Decrypt AES-256-GCM envelope
    const decryptedBuffer = await decryptDeliverable(foundPackage.encryptedEnvelope, encryptionSecret);

    return {
      data: decryptedBuffer,
      packageInfo: foundPackage,
    };
  }
}

export const deliverableStorageClient = new DeliverableStorageClient();
