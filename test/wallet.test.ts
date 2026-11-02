import { describe, expect, it } from 'bun:test';
import {
  getWalletAdapter,
  FreighterAdapter,
  AlbedoAdapter,
  XBullAdapter,
  LobstrAdapter,
  DemoSandboxAdapter,
} from '../src/wallet/adapters';

describe('Multi-Wallet Adapters Suite', () => {
  it('should instantiate appropriate adapter for each supported wallet', () => {
    expect(getWalletAdapter('freighter')).toBeInstanceOf(FreighterAdapter);
    expect(getWalletAdapter('albedo')).toBeInstanceOf(AlbedoAdapter);
    expect(getWalletAdapter('xbull')).toBeInstanceOf(XBullAdapter);
    expect(getWalletAdapter('lobstr')).toBeInstanceOf(LobstrAdapter);
  });

  it('should connect demo sandbox adapter and return valid address on testnet', async () => {
    const adapter = new DemoSandboxAdapter('GB6CML3GZYGJ4BLR2PK5QTKQIF6KTT56ZXXTIHXTWG4JAPB3RKDVQTU4');
    const result = await adapter.connect();

    expect(result.address).toBe('GB6CML3GZYGJ4BLR2PK5QTKQIF6KTT56ZXXTIHXTWG4JAPB3RKDVQTU4');
    expect(result.network).toBe('TESTNET');
  });

  it('should sign transactions cleanly in sandbox mode', async () => {
    const adapter = new DemoSandboxAdapter();
    const fakeXdr = 'AAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const signed = await adapter.sign(fakeXdr);
    expect(signed).toBe(fakeXdr);
  });
});
