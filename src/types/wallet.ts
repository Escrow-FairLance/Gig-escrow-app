export type SupportedWalletId = 'freighter' | 'albedo' | 'xbull' | 'lobstr';

export interface WalletInfo {
  id: SupportedWalletId;
  name: string;
  icon: string;
  downloadUrl: string;
}

export interface WalletBalance {
  assetCode: string;
  assetIssuer?: string;
  balance: string;
}

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  walletId: SupportedWalletId | null;
  network: string;
  balances: WalletBalance[];
  nativeBalance: string;
  error: string | null;
}

export interface SignTransactionResult {
  signedXdr: string;
  hash?: string;
}
