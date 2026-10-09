'use client';

import React, { useState } from 'react';
import {
  Landmark,
  Coins,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Globe2,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { useWallet } from '../../wallet/context.js';
import { Card, Button, Badge, Input } from '../../components/ui/index.js';

interface AnchorOption {
  id: string;
  name: string;
  region: string;
  fiatCurrency: string;
  rate: number; // e.g. 1 USDC = 1650 NGN
  methods: string[];
  logo: string;
}

const anchors: AnchorOption[] = [
  {
    id: 'cowrie',
    name: 'Cowrie Exchange',
    region: 'Nigeria',
    fiatCurrency: 'NGN',
    rate: 1650,
    methods: ['Nigerian Bank Transfer', 'NIBSS Instant Payment'],
    logo: '🇳🇬',
  },
  {
    id: 'clickpesa',
    name: 'ClickPesa',
    region: 'Kenya & Tanzania',
    fiatCurrency: 'KES',
    rate: 130,
    methods: ['M-Pesa Safaricom', 'Airtel Money', 'Bank Transfer'],
    logo: '🇰🇪',
  },
  {
    id: 'yellowcard',
    name: 'Yellow Card',
    region: 'Pan-Africa (16 Countries)',
    fiatCurrency: 'CFA / ZAR / GHS',
    rate: 610,
    methods: ['MTN MoMo', 'Orange Money', 'Local Banks'],
    logo: '🌍',
  },
  {
    id: 'moneygram',
    name: 'MoneyGram Access',
    region: 'Global (180+ Countries)',
    fiatCurrency: 'USD / EUR / Local Cash',
    rate: 1.0,
    methods: ['Physical Cash Pickup', 'Zero Bank Account Required'],
    logo: '🌐',
  },
];

export default function FiatRailsPage() {
  const { state: wallet } = useWallet();
  const [selectedAnchor, setSelectedAnchor] = useState<AnchorOption>(anchors[0]);
  const [amountUsdc, setAmountUsdc] = useState<string>('250');
  const [recipientAccount, setRecipientAccount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [offrampSuccess, setOfframpSuccess] = useState<boolean>(false);
  const [txRef, setTxRef] = useState<string>('');

  const numAmount = parseFloat(amountUsdc) || 0;
  const estimatedFiat = (numAmount * selectedAnchor.rate).toLocaleString();

  const handleStartOfframp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientAccount.trim()) {
      alert('Please enter your recipient bank or mobile phone number');
      return;
    }

    setIsProcessing(true);
    // Simulate SEP-24 interactive anchor session
    await new Promise((r) => setTimeout(r, 2000));
    setTxRef('SEP24-' + Math.random().toString(36).substring(2, 10).toUpperCase());
    setIsProcessing(false);
    setOfframpSuccess(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto pb-4">
        <Badge variant="cyan" className="mb-2">
          Stellar SEP-24 Anchor Rails
        </Badge>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Instant Fiat Cashout & Off-Ramps
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Convert your freelance milestone escrow earnings into local bank deposits, mobile money,
          or physical cash in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Anchor Directory (Left) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
            Select Regulated Stellar Anchor
          </h2>

          {anchors.map((anchor) => {
            const isSelected = selectedAnchor.id === anchor.id;
            return (
              <Card
                key={anchor.id}
                onClick={() => {
                  setSelectedAnchor(anchor);
                  setOfframpSuccess(false);
                }}
                className={`p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/40 shadow-glow'
                    : 'bg-surface-100/80 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{anchor.logo}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {anchor.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">{anchor.region}</span>
                    </div>
                  </div>

                  <Badge variant={isSelected ? 'cyan' : 'slate'} className="text-[10px] font-mono">
                    {anchor.fiatCurrency}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {anchor.methods.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded bg-surface-200 text-[10px] text-slate-300 font-mono"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Off-Ramp Session Form (Right) */}
        <div className="lg:col-span-7">
          <Card glow className="p-6 sm:p-8 bg-surface-100/90 border-cyan-500/30">
            {!offrampSuccess ? (
              <form onSubmit={handleStartOfframp} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Off-Ramp via {selectedAnchor.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Target Currency: {selectedAnchor.fiatCurrency}
                      </p>
                    </div>
                  </div>

                  <Badge variant="emerald" dot>
                    Anchor Online
                  </Badge>
                </div>

                {/* Amount Inputs & Rate Calculator */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Amount to Withdraw (USDC)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={amountUsdc}
                        onChange={(e) => setAmountUsdc(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-surface-200/80 border border-white/10 text-white font-mono text-base focus:outline-none focus:border-cyan-400"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                        USDC
                      </span>
                    </div>
                  </div>

                  {/* Estimated Conversion Box */}
                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        You Will Receive (Est. Fiat Payout)
                      </span>
                      <div className="text-xl font-black text-cyan-300 font-mono mt-0.5">
                        {estimatedFiat} {selectedAnchor.fiatCurrency}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Rate: 1 USDC ≈ {selectedAnchor.rate.toLocaleString()} {selectedAnchor.fiatCurrency}
                    </span>
                  </div>

                  {/* Recipient Account Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Recipient Bank Account / Mobile Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        selectedAnchor.id === 'clickpesa'
                          ? '+254 712 345 678 (M-Pesa)'
                          : selectedAnchor.id === 'cowrie'
                          ? '0123456789 (Access Bank / GTBank)'
                          : 'Government Photo ID Name for Cash Pickup'
                      }
                      value={recipientAccount}
                      onChange={(e) => setRecipientAccount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isProcessing}
                  className="w-full shadow-glow gap-2"
                >
                  <Coins className="w-4 h-4 text-slate-950" />
                  <span>Initiate Interactive SEP-24 Session</span>
                </Button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-glow">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Fiat Off-Ramp Dispatched!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your funds ({amountUsdc} USDC) were received by {selectedAnchor.name}. Payout of{' '}
                  <strong className="text-cyan-300">{estimatedFiat} {selectedAnchor.fiatCurrency}</strong> is
                  in transit to your destination account.
                </p>

                <div className="p-3 rounded-xl bg-surface-200 border border-white/10 text-xs font-mono text-cyan-300 max-w-sm mx-auto">
                  Reference: {txRef}
                </div>

                <div className="pt-4 flex items-center justify-center gap-3">
                  <Button variant="outline" onClick={() => setOfframpSuccess(false)}>
                    New Withdrawal
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
