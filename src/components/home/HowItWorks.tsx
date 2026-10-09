'use client';

import React, { useState } from 'react';
import {
  FileText,
  Lock,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Scale,
  RotateCw,
  Coins,
  ChevronRight,
  Shield,
  Clock,
} from 'lucide-react';
import { Card, Badge, Button } from '../ui/index';

type RoleTab = 'client' | 'freelancer' | 'arbitrator';

interface Step {
  step: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  detail: string;
  badge: string;
}

export const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RoleTab>('client');

  const stepsData: Record<RoleTab, Step[]> = {
    client: [
      {
        step: '01',
        title: 'Post Job & Define Milestones',
        desc: 'Specify deliverables, deadlines, review windows (24h–14d), work timeout, and select an odd-sized arbitrator panel (1–7 members).',
        icon: <FileText className="w-5 h-5 text-cyan-400" />,
        detail: 'Generates canonical JSON terms and calculates SHA-256 hash for contract terms binding.',
        badge: 'Terms Hashing',
      },
      {
        step: '02',
        title: 'Fund Escrow in Soroban',
        desc: 'Deposit total job budget into the Soroban escrow contract using your Stellar wallet (Freighter, Albedo, or xBull).',
        icon: <Lock className="w-5 h-5 text-purple-400" />,
        detail: 'Tokens remain locked non-custodially on Soroban testnet/mainnet with balance invariant checks.',
        badge: 'Non-Custodial Escrow',
      },
      {
        step: '03',
        title: 'Review & Instant Payout',
        desc: 'Verify delivered file hash. Approve for instant smart-contract release, request up to 2 revisions, or raise a dispute.',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        detail: 'Instant release triggers immediate on-chain transfer to freelancer. Auto-releases if client is silent past review window.',
        badge: 'Instant Settlement',
      },
      {
        step: '04',
        title: 'Timeout Protection',
        desc: 'If freelancer fails to deliver before the work timeout, reclaim all remaining escrow balance with a single click.',
        icon: <RotateCw className="w-5 h-5 text-amber-400" />,
        detail: 'No funds can ever be held hostage by inactive or abandoned freelancer contracts.',
        badge: 'Client Reclaim',
      },
    ],
    freelancer: [
      {
        step: '01',
        title: 'Review Terms & Accept Job',
        desc: 'Examine milestone payouts, review windows, arbitration panel, and accept on-chain to activate the contract.',
        icon: <FileText className="w-5 h-5 text-cyan-400" />,
        detail: 'Accepting binds the freelancer public key to the escrow and initiates the active countdown.',
        badge: 'On-Chain Agreement',
      },
      {
        step: '02',
        title: 'Deliverable SHA-256 Hashing',
        desc: 'Upload finished work. The browser cryptographically generates a SHA-256 checksum and encrypts sensitive files.',
        icon: <UploadCloud className="w-5 h-5 text-purple-400" />,
        detail: 'Only the 32-byte cryptographic hash is committed to Soroban, guaranteeing deliverable integrity without gas bloat.',
        badge: 'Zero-Leakage Hash',
      },
      {
        step: '03',
        title: 'Revision Protection & Auto-Release',
        desc: 'Clients are capped at 2 formal revisions. If client is unresponsive past the review window, auto-release your payment!',
        icon: <Clock className="w-5 h-5 text-emerald-400" />,
        detail: 'Anti-ghosting mechanism: anyone can trigger auto-release after review_window seconds expire.',
        badge: 'Anti-Ghosting',
      },
      {
        step: '04',
        title: 'Instant Cashout via SEP-24',
        desc: 'Receive USDC or XLM instantly into your wallet, or off-ramp directly to local bank accounts and mobile money.',
        icon: <Coins className="w-5 h-5 text-amber-400" />,
        detail: 'Integrated with Stellar Anchor rails (MoneyGram, YellowCard, Vibrant) across 180+ countries.',
        badge: 'Local Fiat Rails',
      },
    ],
    arbitrator: [
      {
        step: '01',
        title: 'Stake XLM & Register Panel',
        desc: 'Arbitrators lock a minimum stake in the Soroban staking pool to establish reputation and qualify for dispute panels.',
        icon: <Shield className="w-5 h-5 text-cyan-400" />,
        detail: 'Unstaking requires an active case safety audit to prevent exit scamming during open disputes.',
        badge: 'Staked Security',
      },
      {
        step: '02',
        title: 'Odd-Sized Panel Assignment',
        desc: 'Job creators designate 1, 3, 5, or 7 arbitrators with strict conflict-of-interest validation (neither client nor worker).',
        icon: <Scale className="w-5 h-5 text-purple-400" />,
        detail: 'Odd panel sizing guarantees deterministic majority vote without deadlock or ties.',
        badge: '1–7 Member Panel',
      },
      {
        step: '03',
        title: 'Audit Cryptographic Evidence',
        desc: 'Review original terms hash, delivered files hash, revision timeline, and party claims in the dispute vault.',
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        detail: 'Every deliverable and claim has cryptographic proof preventing retrospective manipulation.',
        badge: 'Cryptographic Audit',
      },
      {
        step: '04',
        title: 'Cast Ruling & Earn Fees',
        desc: 'Vote Release, Refund, or Split (with custom basis points). Reaching majority triggers Soroban payouts and arbitrator rewards.',
        icon: <Coins className="w-5 h-5 text-emerald-400" />,
        detail: 'Arbitrator fee is split among voting panel members; inactive arbitrators face stake slashing.',
        badge: 'Consensus Payout',
      },
    ],
  };

  return (
    <section className="py-24 relative z-10 bg-surface-50/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="cyan" className="mb-3">
            Interactive Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Escrow-FairLance Works
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            A battle-tested protocol combining Soroban smart contracts, client-side cryptographic hashing, 
            and decentralized odd-sized arbitration.
          </p>

          {/* Role Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-surface-200/80 border border-white/10 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('client')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'client'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Client Workflow
            </button>
            <button
              onClick={() => setActiveTab('freelancer')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'freelancer'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Freelancer Workflow
            </button>
            <button
              onClick={() => setActiveTab('arbitrator')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'arbitrator'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Arbitrator Workflow
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stepsData[activeTab].map((item, idx) => (
            <Card
              key={idx}
              hoverEffect
              className="p-6 bg-surface-100/90 border-white/5 relative flex flex-col justify-between overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity font-mono font-black text-4xl text-white">
                {item.step}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-surface-200 border border-white/10 shadow-inner">
                    {item.icon}
                  </div>
                  <Badge variant="purple" className="text-[10px]">
                    {item.badge}
                  </Badge>
                </div>

                <div className="text-xs font-mono text-cyan-400 mb-1">Step {item.step}</div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="text-[11px] font-mono text-slate-400 bg-surface-200/50 p-2.5 rounded-lg border border-white/5 flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{item.detail}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
