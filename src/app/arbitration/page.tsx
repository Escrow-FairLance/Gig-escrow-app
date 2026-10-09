'use client';

import React, { useState } from 'react';
import {
  Scale,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useWallet } from '../../wallet/context';
import { StakingModal } from '../../components/arbitration/StakingModal';
import { ArbitratorRulingCard } from '../../components/arbitration/ArbitratorRulingCard';
import { Card, Button, Badge } from '../../components/ui/index';

interface DisputeCaseItem {
  id: string;
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
}

const mockDisputes: DisputeCaseItem[] = [
  {
    id: 'dispute-5520-indexing',
    jobTitle: 'Full-Stack DeFi UI & Sub-Second Indexing Pipeline',
    milestoneTitle: 'Production Deployment & Sub-Second Indexing Pipeline',
    disputedAmount: '2,000',
    currency: 'XLM',
    arbitratorPanel: [
      'GDC7W8KMQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWAA',
      'GCK45NMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWBB',
      'GBR12VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWCC',
    ],
    arbitratorFeeBps: 300,
    votes: [
      {
        arbitrator: 'GCK45NMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWBB',
        freelancerShareBps: 7000, // 70%
      },
    ],
  },
];

export default function ArbitrationPage() {
  const { state: wallet } = useWallet();
  const [stakedAmount, setStakedAmount] = useState('1500');
  const [stakingModalOpen, setStakingModalOpen] = useState(false);
  const [disputes, setDisputes] = useState(mockDisputes);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleCastVote = async (disputeId: string, bps: number) => {
    const updated = disputes.map((d) => {
      if (d.id === disputeId) {
        return {
          ...d,
          votes: [
            ...d.votes,
            {
              arbitrator: wallet.address || 'GDC7...JUROR',
              freelancerShareBps: bps,
            },
          ],
        };
      }
      return d;
    });
    setDisputes(updated);
    showToast(`Ruling (${bps / 100}% share) recorded on Soroban! Consensus updating.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="amber">Arbitration Portal</Badge>
            <Badge variant="emerald" dot>
              Juror Pool Active
            </Badge>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Decentralized Odd-Panel Juror Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Stake XLM, review cryptographic milestone proofs, vote on disputes, and earn protocol fees.
          </p>
        </div>

        <Button
          variant="glow"
          onClick={() => setStakingModalOpen(true)}
          className="gap-2 text-xs border-amber-500/40 text-amber-300 hover:text-white"
        >
          <Coins className="w-4 h-4 text-amber-400" />
          <span>Manage Stake ({stakedAmount} XLM)</span>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Staked Collateral</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stakedAmount} XLM</div>
          <span className="text-[10px] text-emerald-400 font-mono">Eligible for 1–7 panels</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Cases</span>
            <Scale className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{disputes.length} Case</div>
          <span className="text-[10px] text-amber-400 font-mono">1 pending vote</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Juror Reputation</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">99.4%</div>
          <span className="text-[10px] text-emerald-400 font-mono">48 consensus rulings</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Fees Earned</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">820 XLM</div>
          <span className="text-[10px] text-purple-400 font-mono">Instant Soroban payouts</span>
        </Card>
      </div>

      {/* Active Dispute Cases Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <span>Assigned Cases Awaiting Ruling</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {disputes.length} Active Quorum
          </span>
        </div>

        <div className="space-y-6">
          {disputes.map((dispute) => (
            <ArbitratorRulingCard
              key={dispute.id}
              disputeId={dispute.id}
              jobTitle={dispute.jobTitle}
              milestoneTitle={dispute.milestoneTitle}
              disputedAmount={dispute.disputedAmount}
              currency={dispute.currency}
              arbitratorPanel={dispute.arbitratorPanel}
              arbitratorFeeBps={dispute.arbitratorFeeBps}
              votes={dispute.votes}
              onCastVote={(bps) => handleCastVote(dispute.id, bps)}
            />
          ))}
        </div>
      </div>

      {/* Staking Modal */}
      <StakingModal
        isOpen={stakingModalOpen}
        onClose={() => setStakingModalOpen(false)}
        currentStaked={stakedAmount}
        activeCasesCount={disputes.length}
        onStake={async (amt) => {
          setStakedAmount((prev) => (parseFloat(prev) + parseFloat(amt)).toString());
          showToast(`Successfully staked ${amt} XLM collateral into Soroban pool!`);
        }}
        onUnstake={async (amt) => {
          setStakedAmount((prev) => Math.max(0, parseFloat(prev) - parseFloat(amt)).toString());
          showToast(`Successfully unstaked ${amt} XLM!`);
        }}
      />
    </div>
  );
}
