'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Scale,
  Coins,
  Layers,
  Star,
  ExternalLink,
  Award,
  Clock,
} from 'lucide-react';
import { formatAddress, STELLAR_CONFIG } from '../../../config/constants';
import { Card, Button, Badge } from '../../../components/ui/index';

export default function ProfilePage() {
  const params = useParams();
  const address = (params.address as string) || 'GB3Y9KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWYZ';

  const mockProfile = {
    address,
    reputationScore: 99.1,
    role: 'Senior Soroban Engineer & Smart Contract Auditor',
    country: 'Nigeria / Global Remote',
    completedMilestones: 42,
    disputeRate: 2.3, // 2.3%
    totalVolume: '28,500 XLM',
    skills: ['Rust', 'Soroban', 'Security Audit', 'Stellar SDK', 'Next.js', 'SEP-24'],
    recentJobs: [
      {
        id: 'job-9841-soroban-escrow',
        title: 'Soroban Escrow Smart Contract v1 & Invariant Tests',
        role: 'Freelancer',
        payout: '1,500 XLM',
        status: 'APPROVED',
        date: '2026-10-04',
      },
      {
        id: 'job-7731-rust-contract-audit',
        title: 'Static Analysis & Symbolic Execution Run',
        role: 'Auditor',
        payout: '1,750 USDC',
        status: 'APPROVED',
        date: '2026-09-28',
      },
      {
        id: 'job-3321-defi-amm-pool',
        title: 'Stellar Soroban AMM Integration',
        role: 'Freelancer',
        payout: '3,000 XLM',
        status: 'APPROVED',
        date: '2026-09-12',
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <Card glow className="p-6 sm:p-8 bg-surface-100/90 border-cyan-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-glow">
              {address.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white font-mono">
                  {formatAddress(address, 6)}
                </h1>
                <Badge variant="emerald" dot>
                  Verified On-Chain
                </Badge>
              </div>
              <p className="text-xs text-slate-300">{mockProfile.role}</p>
              <span className="text-[11px] text-slate-400">{mockProfile.country}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end text-amber-400 font-bold text-xl font-mono">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{mockProfile.reputationScore}%</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              On-Chain Reputation Score
            </span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2 pt-4">
          {mockProfile.skills.map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-lg bg-surface-200 text-xs text-cyan-300 font-mono border border-cyan-500/20"
            >
              {s}
            </span>
          ))}
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Milestones Settled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {mockProfile.completedMilestones}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Zero ghosting flags</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Dispute Rate</span>
            <Scale className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {mockProfile.disputeRate}%
          </div>
          <span className="text-[10px] text-purple-400 font-mono">100% win rate</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Volume</span>
            <Coins className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {mockProfile.totalVolume}
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">Non-custodial escrow</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Avg. Turnaround</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">3.4 Days</div>
          <span className="text-[10px] text-slate-400 font-mono">Faster than timeout</span>
        </Card>
      </div>

      {/* Contract History */}
      <Card className="p-6 bg-surface-100/80 border-white/5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Verified Escrow Milestone History</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Recent Deliverables</span>
        </div>

        <div className="space-y-3">
          {mockProfile.recentJobs.map((j) => (
            <div
              key={j.id}
              className="p-4 rounded-xl bg-surface-200/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="cyan" className="font-mono text-[10px]">
                    {j.role}
                  </Badge>
                  <span className="font-bold text-white">{j.title}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{j.date}</span>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="font-mono text-emerald-400 font-bold">{j.payout}</span>
                <Badge variant="emerald" className="text-[10px]">
                  Approved & Released
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
