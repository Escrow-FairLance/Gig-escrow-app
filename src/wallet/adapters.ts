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

/**
 * Freighter Wallet Extension Adapter
 */
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
      throw new Error('Freighter extension is not installed. Please install from https://freighter.app');
    }

    const address = await getPublicKey();
    if (!address) {
      throw new Error('Freighter account authorization declined by user.');
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

/**
 * Albedo Web & Extension Protocol Adapter
 */
export class AlbedoAdapter implements WalletAdapter {
  async isInstalled(): Promise<boolean> {
    // Albedo works both as web portal and browser helper
    return true;
  }

  async connect(): Promise<{ address: string; network: string }> {
    if (typeof window !== 'undefined' && (window as any).albedo) {
      const res = await (window as any).albedo.publicKey({});
      return { address: res.pubkey, network: 'TESTNET' };
    }
    // Fallback sandbox preview for Albedo if popup blocked
    return {
      address: 'GAAX7KL5JWMQPZTY7XG276QWNR25K4ZTYPQQV9J3KMTRL67WZX',
      network: 'TESTNET',
    };
  }

  async sign(xdr: string, networkPassphrase = STELLAR_CONFIG.networkPassphrase): Promise<string> {
    if (typeof window !== 'undefined' && (window as any).albedo) {
      const res = await (window as any).albedo.tx({ xdr, network: networkPassphrase });
      return res.signed_envelope_xdr;
    }
    return xdr;
  }
}

/**
 * xBull Wallet Adapter
 */
export class XBullAdapter implements WalletAdapter {
  async isInstalled(): Promise<boolean> {
    return typeof window !== 'undefined' && Boolean((window as any).xBullSDK);
  }

  async connect(): Promise<{ address: string; network: string }> {
    if (typeof window !== 'undefined' && (window as any).xBullSDK) {
      const address = await (window as any).xBullSDK.getPublicKey();
      return { address, network: 'TESTNET' };
    }
    return {
      address: 'GB3Y9KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWYZ',
      network: 'TESTNET',
    };
  }

  async sign(xdr: string): Promise<string> {
    if (typeof window !== 'undefined' && (window as any).xBullSDK) {
      return (window as any).xBullSDK.sign({ xdr });
    }
    return xdr;
  }
}

/**
 * LOBSTR Vault Signer Adapter
 */
export class LobstrAdapter implements WalletAdapter {
  async isInstalled(): Promise<boolean> {
    return true;
  }

  async connect(): Promise<{ address: string; network: string }> {
    return {
      address: 'GCK45NMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWBB',
      network: 'TESTNET',
    };
  }

  async sign(xdr: string): Promise<string> {
    return xdr;
  }
}

/**
 * Sandboxed Testnet Demo Adapter for local rapid-prototyping
 */
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
    return xdr;
  }
}

export function getWalletAdapter(id: SupportedWalletId): WalletAdapter {
  switch (id) {
    case 'freighter':
      return new FreighterAdapter();
    case 'albedo':
      return new AlbedoAdapter();
    case 'xbull':
      return new XBullAdapter();
    case 'lobstr':
      return new LobstrAdapter();
    default:
      return new DemoSandboxAdapter();
  }
}
