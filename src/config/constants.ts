export const STELLAR_CONFIG = {
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet',
  networkPassphrase:
    process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ||
    'Test SDF Network ; September 2015',
  sorobanRpcUrl:
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
    'https://soroban-testnet.stellar.org',
  horizonUrl:
    process.env.NEXT_PUBLIC_HORIZON_URL ||
    'https://horizon-testnet.stellar.org',
  escrowContractId:
    process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID ||
    'CDG3CB5IEATXZPTL3SQGCBVJM2A4HUX4J5TTFGMA7NPGFQBMQBYFXZCB',
  nativeTokenId:
    process.env.NEXT_PUBLIC_NATIVE_TOKEN_ID ||
    'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1',
  explorerBaseUrl: 'https://stellar.expert/explorer/testnet',
} as const;

export const ESCROW_RULES = {
  maxRevisions: 2,
  minArbitratorPanelSize: 1,
  maxArbitratorPanelSize: 7,
  defaultReviewWindowSeconds: 259200, // 3 days
  defaultWorkTimeoutSeconds: 604800, // 7 days
  defaultDisputeWindowSeconds: 432000, // 5 days
  defaultArbitratorFeeBps: 500, // 5%
  stroopsPerXlm: 10_000_000n,
} as const;

export function formatAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatStroopsToXlm(stroops: bigint | string | number): string {
  const b = typeof stroops === 'bigint' ? stroops : BigInt(stroops || 0);
  const xlm = Number(b) / 10_000_000;
  return xlm.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
}
