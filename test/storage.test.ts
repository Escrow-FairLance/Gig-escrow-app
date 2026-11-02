import { describe, expect, it } from 'bun:test';
import { DeliverableStorageClient } from '../src/storage/ipfs';

describe('Decentralized Deliverable Storage Client', () => {
  const storage = new DeliverableStorageClient();

  it('should encrypt, archive, and decrypt deliverable payload', async () => {
    const fakeFileContent = new TextEncoder().encode('Test deliverable code bundle export v2');
    const fakeFile = {
      name: 'bundle.zip',
      size: fakeFileContent.byteLength,
      type: 'application/zip',
      arrayBuffer: async () => fakeFileContent.buffer as ArrayBuffer,
    };

    const pkg = await storage.uploadEncryptedDeliverable({
      file: fakeFile,
      jobId: 'job-101',
      milestoneIndex: 0,
      encryptionSecret: 'client-arbitrator-shared-passphrase',
    });

    expect(pkg.cid).toContain('ipfs://bafybeig');
    expect(pkg.sha256).toHaveLength(64);
    expect(pkg.originalFileName).toBe('bundle.zip');

    // Retrieve and decrypt
    const retrieved = await storage.retrieveAndDecryptDeliverable({
      sha256OrCid: pkg.sha256,
      encryptionSecret: 'client-arbitrator-shared-passphrase',
    });

    const decryptedText = new TextDecoder().decode(retrieved.data);
    expect(decryptedText).toBe('Test deliverable code bundle export v2');
    expect(retrieved.packageInfo.originalFileName).toBe('bundle.zip');
  });
});
