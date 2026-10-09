'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Coins,
  FileCheck,
  Lock,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { formatAddress, formatStroopsToXlm } from '../../../config/constants';
import { Card, Badge, Button } from '../../../components/ui/index';

export default function DisputeDetailPage() {
  const params = useParams();

  const mockDispute = {
    id: params.id || 'dispute-5520-indexing',
    jobId: 'job-5520-fullstack-defi-ui',
    jobTitle: 'Full-Stack DeFi UI & Sub-Second Indexing Pipeline',
    milestoneIndex: 2,
    milestoneTitle: 'Production Deployment & Sub-Second Indexing Pipeline',
    disputedAmount: '20000000000', // 2,000 XLM
    currency: 'XLM',
    clientAddress: 'GCP89KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWFF',
    freelancerAddress: 'GDX12KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWGG',
    arbitratorFeeBps: 400, // 4%
    status: 'ACTIVE',
    createdAt: '2026-10-08T09:00:00Z',
    votingDeadline: '2026-10-15T09:00:00Z',
    clientClaim:
      'The indexing pipeline experiences intermittent data drops under high RPC volume and fails the 99.9% uptime requirement specified in Milestone 3 acceptance criteria.',
    clientEvidenceHash: '7a9c8b2d1e0f3456789abcdef0123456789abcdef0123456789abcdef0123456',
    freelancerClaim:
      'The indexing service meets all specification limits on Stellar testnet Horizon and Soroban RPC. RPC drops are caused by client rate limits, not contract code.',
    deliverableHash: '9900b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9074',
    panel: [
      {
        address: 'GDC7W8KMQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWAA',
        name: 'Amina Bello (Smart Contracts Juror)',
        voted: false,
      },
      {
        address: 'GCK45NMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWBB',
        name: 'Kwame Mensah (DeFi & Financial Law)',
        voted: true,
        ruling: '70% Freelancer / 30% Client',
        freelancerBps: 7000,
      },
      {
        address: 'GBR12VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWCC',
        name: 'Dr. Chidi Okonkwo (System Architecture)',
        voted: false,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/arbitration"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Arbitration Portal</span>
        </Link>
      </div>

      {/* Main Header */}
      <Card glow className="p-6 sm:p-8 bg-surface-100/90 border-amber-500/30 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="amber" dot>
                Dispute In Arbitration
              </Badge>
              <Badge variant="slate" className="font-mono text-[10px]">
                Case #{mockDispute.id}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {mockDispute.jobTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Milestone #{mockDispute.milestoneIndex + 1}: {mockDispute.milestoneTitle}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Frozen Milestone Escrow</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {formatStroopsToXlm(mockDispute.disputedAmount)} {mockDispute.currency}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Arbitrator Fee Pool: {mockDispute.arbitratorFeeBps / 100}%
            </span>
          </div>
        </div>

        {/* Dispute Parties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-200/50 border border-white/5 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Client Claim</span>
            <div className="font-mono text-cyan-300">
              {formatAddress(mockDispute.clientAddress, 5)}
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{mockDispute.clientClaim}</p>
            <div className="pt-2 text-[10px] font-mono text-slate-400 break-all">
              Evidence Hash: 0x{mockDispute.clientEvidenceHash.slice(0, 24)}...
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-200/50 border border-white/5 space-y-2">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">
              Freelancer Deliverable Defense
            </span>
            <div className="font-mono text-purple-300">
              {formatAddress(mockDispute.freelancerAddress, 5)}
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {mockDispute.freelancerClaim}
            </p>
            <div className="pt-2 text-[10px] font-mono text-slate-400 break-all">
              Deliverable Hash: 0x{mockDispute.deliverableHash.slice(0, 24)}...
            </div>
          </div>
        </div>
      </Card>

      {/* Juror Quorum Progress */}
      <Card className="p-6 bg-surface-100/90 border-white/5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Odd-Panel Juror Quorum (3 Members)</span>
          </h2>
          <span className="text-xs text-amber-300 font-mono">
            1 of 3 Votes Cast (Consensus at 2 Votes)
          </span>
        </div>

        <div className="space-y-3">
          {mockDispute.panel.map((juror, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-200/50 border border-white/5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    juror.voted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-surface-200 text-slate-400'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">{juror.name}</div>
                  <span className="font-mono text-slate-400 text-[10px]">
                    {formatAddress(juror.address, 4)}
                  </span>
                </div>
              </div>

              <div>
                {juror.voted ? (
                  <Badge variant="emerald" className="font-mono">
                    Voted: {juror.ruling}
                  </Badge>
                ) : (
                  <Badge variant="amber" className="font-mono">
                    Awaiting Vote
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
