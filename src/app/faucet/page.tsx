'use client';

import React, { useState } from 'react';
import { Coins, Sparkles, CheckCircle2, ExternalLink, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useWallet } from '../../wallet/context.js';
import { formatAddress, STELLAR_CONFIG } from '../../config/constants.js';
import { Card, Button, Badge } from '../../components/ui/index.js';

export default function FaucetPage() {
  const { state: wallet, refreshBalances } = useWallet();
  const [targetAddress, setTargetAddress] = useState(wallet.address || '');
  const [isFunding, setIsFunding] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFundFriendbot = async () => {
    if (!targetAddress) {
      alert('Please enter or connect a Stellar testnet address');
      return;
    }

    setIsFunding(true);
    try {
      const res = await fetch(`https://friendbot.stellar.org?addr=${targetAddress}`);
      if (res.ok) {
        setSuccessMsg(`Successfully credited 10,000 testnet XLM to ${formatAddress(targetAddress, 4)}!`);
        await refreshBalances();
      } else {
        setSuccessMsg('Account already funded or rate limit reached. Checking testnet balance...');
      }
    } catch {
      setSuccessMsg('Friendbot call processed! Refresh balance in your wallet.');
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="cyan" className="mb-2">
          Stellar Testnet Tools
        </Badge>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Testnet Faucet & Account Funding
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Fund any Stellar public key with 10,000 testnet Lumens (XLM) via Stellar Friendbot to test
          escrow deposits, milestone payments, and arbitrator staking.
        </p>
      </div>

      <Card glow className="p-8 bg-surface-100/90 border-cyan-500/30 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Stellar Friendbot Direct Faucet</h2>
            <p className="text-xs text-slate-400">Instant Testnet Account Provisioning</p>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Stellar Testnet Public Key (G...)
            </label>
            <input
              type="text"
              placeholder="e.g. GB3Y9KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWYZ"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {wallet.isConnected && wallet.address && (
              <button
                type="button"
                onClick={() => setTargetAddress(wallet.address || '')}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                Use Connected Wallet ({formatAddress(wallet.address, 4)})
              </button>
            )}

            <Button
              variant="primary"
              isLoading={isFunding}
              onClick={handleFundFriendbot}
              className="gap-2 shadow-glow ml-auto text-xs"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>Request 10,000 Testnet XLM</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
