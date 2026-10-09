import { isConnected, getPublicKey, getNetwork, signTransaction } from '@stellar/freighter-api';
import { STELLAR_CONFIG } from '../config/constants';
import { SupportedWalletId, WalletInfo } from '../types/wallet';

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    id: 'freighter',
    name: 'Freighter Wallet',
    icon: '🚀',
    downloadUrl: 'https://www.freighter.app/',
  },
  {
    id: 'albedo',
    name: 'Albedo Link',
    icon: '⚡',
    downloadUrl: 'https://albedo.link/',
  },
  {
    id: 'xbull',
    name: 'xBull Wallet',
    icon: '🐂',
    downloadUrl: 'https://xbull.app/',
  },
  {
    id: 'lobstr',
    name: 'LOBSTR Vault',
    icon: '🦞',
    downloadUrl: 'https://lobstr.co/',
  },
];

export interface WalletAdapter {
  isInstalled(): Promise<boolean>;
  connect(): Promise<{ address: string; network: string }>;
  sign(xdr: string, networkPassphrase?: string): Promise<string>;
}

export class FreighterAdapter implements WalletAdapter {
  async isInstalled(): Promise<boolean> {
    try {
      return await isConnected();
    } catch {
      return false;
    }
  }

  async connect(): Promise<{ address: string; network: string }> {
    const installed = await this.isInstalled();
    if (!installed) {
      throw new Error('Freighter extension is not installed. Please install from freighter.app');
    }

    const address = await getPublicKey();
    if (!address) {
      throw new Error('Freighter account authorization declined');
    }

    let network = 'TESTNET';
    try {
      network = await getNetwork();
    } catch {
      // default
    }

    return { address, network };
  }

  async sign(xdr: string, networkPassphrase = STELLAR_CONFIG.networkPassphrase): Promise<string> {
    return signTransaction(xdr, { networkPassphrase });
  }
}

export class DemoSandboxAdapter implements WalletAdapter {
  private demoAddress: string;

  constructor(demoAddress = 'GB6CML3GZYGJ4BLR2PK5QTKQIF6KTT56ZXXTIHXTWG4JAPB3RKDVQTU4') {
    this.demoAddress = demoAddress;
  }

  async isInstalled(): Promise<boolean> {
    return true;
  }

  async connect(): Promise<{ address: string; network: string }> {
    return {
      address: this.demoAddress,
      network: 'TESTNET',
    };
  }

  async sign(xdr: string): Promise<string> {
    // In demo sandbox, returns input transaction
    return xdr;
  }
}

export function getWalletAdapter(id: SupportedWalletId): WalletAdapter {
  switch (id) {
    case 'freighter':
      return new FreighterAdapter();
    case 'albedo':
    case 'xbull':
    case 'lobstr':
    default:
      // Return demo sandbox or freighter fallback
      return new DemoSandboxAdapter();
  }
}
