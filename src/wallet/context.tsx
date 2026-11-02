'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { STELLAR_CONFIG } from '../config/constants';
import { SupportedWalletId, WalletBalance, WalletState } from '../types/wallet';
import { getWalletAdapter } from './adapters';
import { SorobanTransactionSigner } from '../contracts/runner';

interface WalletContextType {
  state: WalletState;
  signer: SorobanTransactionSigner;
  connect: (walletId: SupportedWalletId) => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
  signTransaction: (xdr: string) => Promise<string>;
}

const defaultState: WalletState = {
  isConnected: false,
  isConnecting: false,
  address: null,
  walletId: null,
  network: 'TESTNET',
  balances: [],
  nativeBalance: '0',
  isUnfunded: false,
  error: null,
};

const WalletContext = createContext<WalletContextType>({
  state: defaultState,
  signer: { sign: async () => '' },
  connect: async () => {},
  disconnect: () => {},
  refreshBalances: async () => {},
  signTransaction: async () => '',
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WalletState>(defaultState);

  const fetchBalances = async (publicKey: string) => {
    try {
      const res = await fetch(`${STELLAR_CONFIG.horizonUrl}/accounts/${publicKey}`);
      if (!res.ok) {
        // Unfunded on testnet (404)
        setState((prev) => ({
          ...prev,
          nativeBalance: '0.0000000',
          balances: [{ assetCode: 'XLM', balance: '0.0000000' }],
          isUnfunded: true,
        }));
        return;
      }

      const data = await res.json();
      const balances: WalletBalance[] = (data.balances || []).map((b: any) => ({
        assetCode: b.asset_type === 'native' ? 'XLM' : b.asset_code,
        assetIssuer: b.asset_issuer,
        balance: b.balance,
      }));

      const native = balances.find((b) => b.assetCode === 'XLM')?.balance || '0';

      setState((prev) => ({
        ...prev,
        balances,
        nativeBalance: native,
        isUnfunded: false,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        nativeBalance: '0.0000000',
        balances: [{ assetCode: 'XLM', balance: '0.0000000' }],
        isUnfunded: true,
      }));
    }
  };

  const connect = async (walletId: SupportedWalletId) => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      const adapter = getWalletAdapter(walletId);
      const { address, network } = await adapter.connect();

      setState((prev) => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        address,
        walletId,
        network,
      }));

      localStorage.setItem('fairlance_wallet', walletId);
      localStorage.setItem('fairlance_address', address);

      await fetchBalances(address);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: err instanceof Error ? err.message : 'Failed to connect wallet',
      }));
    }
  };

  const disconnect = () => {
    setState(defaultState);
    localStorage.removeItem('fairlance_wallet');
    localStorage.removeItem('fairlance_address');
  };

  const refreshBalances = async () => {
    if (state.address) {
      await fetchBalances(state.address);
    }
  };

  const signTransaction = useCallback(async (xdr: string): Promise<string> => {
    if (!state.walletId) {
      throw new Error('No wallet connected to sign transaction');
    }
    const adapter = getWalletAdapter(state.walletId);
    return adapter.sign(xdr);
  }, [state.walletId]);

  const signer = useMemo<SorobanTransactionSigner>(() => ({
    sign: async (xdrString: string) => signTransaction(xdrString),
  }), [signTransaction]);

  useEffect(() => {
    const savedWallet = localStorage.getItem('fairlance_wallet') as SupportedWalletId;
    const savedAddr = localStorage.getItem('fairlance_address');

    if (savedWallet && savedAddr) {
      setState((prev) => ({
        ...prev,
        isConnected: true,
        address: savedAddr,
        walletId: savedWallet,
      }));
      fetchBalances(savedAddr);
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        state,
        signer,
        connect,
        disconnect,
        refreshBalances,
        signTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
