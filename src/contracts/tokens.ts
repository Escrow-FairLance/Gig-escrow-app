import { STELLAR_CONFIG } from '../config/constants.js';

export interface TokenMetadata {
  symbol: string;
  name: string;
  contractId: string;
  decimals: number;
  icon: string;
  isNative: boolean;
}

export const SUPPORTED_TOKENS: TokenMetadata[] = [
  {
    symbol: 'XLM',
    name: 'Stellar Lumens',
    contractId: STELLAR_CONFIG.nativeTokenId,
    decimals: 7,
    icon: '✦',
    isNative: true,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin (Testnet)',
    contractId: 'CBIELTK6YBZJU5UP2WWQEUCYJLPU6QXNGBBHEO7F62JISVSHUTQW5JGG',
    decimals: 7,
    icon: '💵',
    isNative: false,
  },
  {
    symbol: 'NGNT',
    name: 'Cowrie Naira Token',
    contractId: 'CD3R7352H25GCSDFKLD7Z725A6U7DFWVEB6GCLX3D5Q3QJ3Y337Z5QGG',
    decimals: 7,
    icon: '₦',
    isNative: false,
  },
];

export function toStroops(amount: string | number, decimals = 7): bigint {
  const parts = amount.toString().split('.');
  const whole = BigInt(parts[0] || '0');
  const fraction = (parts[1] || '').padEnd(decimals, '0').slice(0, decimals);
  return whole * BigInt(10 ** decimals) + BigInt(fraction);
}

export function fromStroops(stroops: bigint | string, decimals = 7): string {
  const b = typeof stroops === 'bigint' ? stroops : BigInt(stroops || '0');
  const divisor = BigInt(10 ** decimals);
  const whole = b / divisor;
  const fraction = (b % divisor).toString().padStart(decimals, '0').replace(/0+$/, '');
  return fraction.length > 0 ? `${whole}.${fraction}` : `${whole}`;
}

export function getExplorerContractUrl(contractId: string): string {
  return `${STELLAR_CONFIG.explorerBaseUrl}/contract/${contractId}`;
}

export function getExplorerAccountUrl(address: string): string {
  return `${STELLAR_CONFIG.explorerBaseUrl}/account/${address}`;
}

export function getExplorerTxUrl(txHash: string): string {
  return `${STELLAR_CONFIG.explorerBaseUrl}/tx/${txHash}`;
}
