'use client';

import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  ShieldAlert,
  Coins,
  ArrowRight,
} from 'lucide-react';
import { formatAddress, formatStroopsToXlm } from '../../config/constants';
import { Card, Button, Badge } from '../ui/index';

interface ArbitratorRulingCardProps {
  disputeId: string;
  jobTitle: string;
  milestoneTitle: string;
  disputedAmount: string;
  currency: string;
  arbitratorPanel: string[];
  arbitratorFeeBps: number;
  votes: {
    arbitrator: string;
    freelancerShareBps: number;
  }[];
  onCastVote: (freelancerShareBps: number) => Promise<void>;
}

export const ArbitratorRulingCard: React.FC<ArbitratorRulingCardProps> = ({
  disputeId,
  jobTitle,
  milestoneTitle,
  disputedAmount,
  currency,
  arbitratorPanel,
  arbitratorFeeBps,
  votes,
  onCastVote,
}) => {
  const [rulingType, setRulingType] = useState<'freelancer' | 'client' | 'split'>('freelancer');
  const [splitPercent, setSplitPercent] = useState<number>(60); // 60% freelancer
  const [isCasting, setIsCasting] = useState(false);

  const panelSize = arbitratorPanel.length;
  const votesCast = votes.length;
  const majorityThreshold = Math.floor(panelSize / 2) + 1;
  const isMajorityReached = votesCast >= majorityThreshold;

  const handleVoteSubmit = async () => {
    let bps = 10000;
    if (rulingType === 'client') bps = 0;
    if (rulingType === 'split') bps = splitPercent * 100;

    setIsCasting(true);
    try {
      await onCastVote(bps);
      setIsCasting(false);
    } catch {
      setIsCasting(false);
    }
  };

  return (
    <Card className="p-6 bg-surface-100/90 border-amber-500/20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="amber" dot>
              Dispute #{disputeId.slice(0, 8)}
            </Badge>
            <Badge variant="slate" className="font-mono text-[10px]">
              Odd Panel: {panelSize} Jurors
            </Badge>
          </div>
          <h3 className="text-base font-bold text-white">{jobTitle}</h3>
          <p className="text-xs text-slate-400">Milestone: {milestoneTitle}</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Disputed Escrow</span>
          <div className="text-lg font-black text-amber-400 font-mono">
            {disputedAmount} {currency}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Arbitration Fee: {arbitratorFeeBps / 100}%
          </span>
        </div>
      </div>

      {/* Quorum Progress Bar */}
      <div className="p-4 rounded-xl bg-surface-200/60 border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>
              Quorum Tally: <strong>{votesCast}</strong> of <strong>{panelSize}</strong> Jurors Voted
            </span>
          </div>
          <span className="font-mono text-[11px] text-amber-300">
            {isMajorityReached ? 'Consensus Reached' : `${majorityThreshold - votesCast} more needed`}
          </span>
        </div>

        <div className="w-full h-2 bg-surface-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
            style={{ width: `${(votesCast / panelSize) * 100}%` }}
          />
        </div>
      </div>

      {/* Ruling Choice Selector */}
      <div className="space-y-4">
        <label className="block text-xs font-semibold text-slate-200">
          Cast Your Arbitrator Ruling:
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setRulingType('freelancer')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              rulingType === 'freelancer'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-glow'
                : 'bg-surface-200/50 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-xs mb-1">100% Release to Worker</div>
            <div className="text-[10px] opacity-80">Deliverables satisfied acceptance criteria</div>
          </button>

          <button
            type="button"
            onClick={() => setRulingType('client')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              rulingType === 'client'
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-glow'
                : 'bg-surface-200/50 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-xs mb-1">100% Refund to Client</div>
            <div className="text-[10px] opacity-80">Worker failed or abandoned milestone</div>
          </button>

          <button
            type="button"
            onClick={() => setRulingType('split')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              rulingType === 'split'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-glow'
                : 'bg-surface-200/50 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-xs mb-1">Custom Split (%)</div>
            <div className="text-[10px] opacity-80">Proportional basis points settlement</div>
          </button>
        </div>

        {/* Split Slider */}
        {rulingType === 'split' && (
          <div className="p-4 rounded-xl bg-surface-200/70 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-300 font-bold">
                Freelancer: {splitPercent}% ({splitPercent * 100} bps)
              </span>
              <span className="text-cyan-300 font-bold">
                Client: {100 - splitPercent}% ({(100 - splitPercent) * 100} bps)
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="99"
              value={splitPercent}
              onChange={(e) => setSplitPercent(parseInt(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Cast Action */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Failure to vote before timeout incurs stake slashing</span>
        </div>

        <Button
          variant="primary"
          isLoading={isCasting}
          onClick={handleVoteSubmit}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-2 text-xs shadow-glow"
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Cast Binding Vote on Soroban</span>
        </Button>
      </div>
    </Card>
  );
};
