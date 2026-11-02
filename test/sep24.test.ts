import { describe, expect, it } from 'bun:test';
import { sep24Client, KNOWN_ANCHORS } from '../src/contracts/sep24';

describe('Stellar SEP-24 Anchor Client', () => {
  it('should export registered known anchors with proper configurations', () => {
    expect(KNOWN_ANCHORS.length).toBeGreaterThanOrEqual(4);
    const cowrie = KNOWN_ANCHORS.find((a) => a.id === 'cowrie');
    expect(cowrie).toBeDefined();
    expect(cowrie?.fiatCurrency).toBe('NGN');
    expect(cowrie?.withdrawEnabled).toBe(true);

    const clickpesa = KNOWN_ANCHORS.find((a) => a.id === 'clickpesa');
    expect(clickpesa).toBeDefined();
    expect(clickpesa?.fiatCurrency).toBe('KES');

    const moneygram = KNOWN_ANCHORS.find((a) => a.id === 'moneygram');
    expect(moneygram).toBeDefined();
    expect(moneygram?.supportedAssets).toContain('USDC');
  });

  it('should initiate interactive withdrawal with correct parameters', async () => {
    const res = await sep24Client.initiateWithdrawal({
      anchorDomain: 'test-anchor.org',
      assetCode: 'USDC',
      account: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFTGXDECK82MRWLMK427O',
      amount: '500',
      destinationAccount: 'NGN_BANK_1234567890',
    });

    expect(res.type).toBe('interactive_customer_info_needed');
    expect(res.id).toMatch(/^tx_/);
    expect(res.url).toContain('https://test-anchor.org/sep24/transactions/withdraw/interactive');
    expect(res.url).toContain('asset_code=USDC');
    expect(res.url).toContain('amount=500');
    expect(res.url).toContain('dest=NGN_BANK_1234567890');
    expect(res.url).toContain('callback=postMessage');
  });

  it('should initiate interactive deposit with correct parameters', async () => {
    const res = await sep24Client.initiateDeposit({
      anchorDomain: 'clickpesa.com',
      assetCode: 'USDC',
      account: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFTGXDECK82MRWLMK427O',
      amount: '1200',
    });

    expect(res.type).toBe('interactive_customer_info_needed');
    expect(res.id).toMatch(/^tx_/);
    expect(res.url).toContain('transactions/deposit/interactive');
    expect(res.url).toContain('asset_code=USDC');
    expect(res.url).toContain('amount=1200');
  });
});
