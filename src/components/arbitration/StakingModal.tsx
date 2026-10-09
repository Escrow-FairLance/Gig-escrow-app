'use client';

import React, { useState } from 'react';
import {
  Coins,
  ShieldCheck,
  AlertTriangle,
  X,
  Lock,
  Unlock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { formatStroopsToXlm } from '../../config/constants';
import { Card, Button, Badge } from '../ui/index';

interface StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStaked: string; // in XLM
  activeCasesCount: number;
  onStake: (amount: string) => Promise<void>;
  onUnstake: (amount: string) => Promise<void>;
}

export const StakingModal: React.FC<StakingModalProps> = ({
  isOpen,
  onClose,
  currentStaked,
  activeCasesCount,
  onStake,
  onUnstake,
}) => {
  const [tab, setTab] = useState<'stake' | 'unstake'>('stake');
  const [amount, setAmount] = useState('500');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const hasActiveCases = activeCasesCount > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      alert('Please enter a valid stake amount');
      return;
    }

    setIsProcessing(true);
    try {
      if (tab === 'stake') {
        await onStake(amount);
      } else {
        if (hasActiveCases) {
          alert('Cannot unstake while assigned to active dispute cases!');
          setIsProcessing(false);
          return;
        }
        await onUnstake(amount);
      }
      setIsProcessing(false);
      onClose();
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-surface-100/95 border border-white/10 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Arbitrator Staking Vault</h3>
              <p className="text-xs text-slate-400">Soroban Security Staking Pool</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-surface-200/80 border border-white/10 mb-6 text-xs">
          <button
            type="button"
            onClick={() => setTab('stake')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              tab === 'stake'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Stake XLM (Deposit)
          </button>
          <button
            type="button"
            onClick={() => setTab('unstake')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              tab === 'unstake'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unstake XLM (Withdraw)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-200/50 border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Active Stake:</span>
              <strong className="text-white font-mono">{currentStaked} XLM</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active Dispute Cases:</span>
              <strong className={hasActiveCases ? 'text-amber-400 font-mono' : 'text-emerald-400 font-mono'}>
                {activeCasesCount} Cases
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Arbitration Fee Earning:</span>
              <strong className="text-cyan-300 font-mono">2.0% – 4.0% per case</strong>
            </div>
          </div>

          {tab === 'unstake' && hasActiveCases && (
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Safety Lockout:</strong> You cannot unstake collateral while assigned to open dispute panels. Complete your rulings to release collateral.
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Amount to {tab === 'stake' ? 'Deposit' : 'Withdraw'} (XLM)
            </label>
            <div className="relative">
              <input
                type="number"
                min="100"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                XLM
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Minimum 500 XLM stake required to qualify for 1-7 member dispute quorums.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isProcessing}
              disabled={tab === 'unstake' && hasActiveCases}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-2"
            >
              {tab === 'stake' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>
                {tab === 'stake' ? `Stake ${amount} XLM` : `Unstake ${amount} XLM`}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
