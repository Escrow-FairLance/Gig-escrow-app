'use client';

import React from 'react';
import { X, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { SUPPORTED_WALLETS } from '../../wallet/adapters';
import { useWallet } from '../../wallet/context';
import { SupportedWalletId } from '../../types/wallet';
import { STELLAR_CONFIG } from '../../config/constants';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ isOpen, onClose }) => {
  const { state, connect } = useWallet();

  if (!isOpen) return null;

  const handleSelect = async (walletId: SupportedWalletId) => {
    await connect(walletId);
    if (!state.error) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl glass-panel border border-cyan-500/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Connect Stellar Wallet
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Network: <span className="text-cyan-400 font-mono font-medium">{STELLAR_CONFIG.network}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {state.error && (
          <div className="flex items-start gap-2.5 p-3 mt-4 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-xl">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Wallet list */}
        <div className="grid gap-3 mt-5">
          {SUPPORTED_WALLETS.map((w) => (
            <button
              key={w.id}
              disabled={state.isConnecting}
              onClick={() => handleSelect(w.id)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-surface-100/60 border border-white/5 hover:border-cyan-400/40 hover:bg-surface-200/80 transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl p-2 rounded-lg bg-surface-200/80 border border-white/5 group-hover:scale-110 transition-transform">
                  {w.icon}
                </span>
                <div>
                  <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {w.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {w.id === 'freighter' ? 'Recommended Stellar extension' : 'Browser or mobile vault'}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </button>
          ))}
        </div>

        {/* Sandbox testnet note */}
        <div className="p-3 mt-5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed">
          <strong>Instant Demo Mode:</strong> Selecting any wallet connects automatically to the verified Stellar testnet deployer account to let you test contract functions without installing browser extensions.
        </div>
      </div>
    </div>
  );
};
