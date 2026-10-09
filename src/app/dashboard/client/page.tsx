'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Coins,
} from 'lucide-react';
import { useWallet } from '../../../wallet/context';
import { formatAddress, formatStroopsToXlm } from '../../../config/constants';
import { ClientReviewModal } from '../../../components/dashboard/ClientReviewModal';
import { Card, Button, Badge } from '../../../components/ui/index';

interface ClientJobItem {
  id: string;
  title: string;
  totalBudget: string;
  escrowBalance: string;
  currency: string;
  status: 'ACTIVE' | 'CREATED' | 'COMPLETED' | 'DISPUTED';
  pendingReviewMilestone?: {
    idx: number;
    title: string;
    amount: string;
    deliverableHash: string;
    revisionCount: number;
  };
  freelancerAddress: string;
}

const mockClientJobs: ClientJobItem[] = [
  {
    id: 'job-9841-soroban-escrow',
    title: 'Soroban Escrow Smart Contract & Cross-Border Rails Bridge',
    totalBudget: '45000000000',
    escrowBalance: '30000000000',
    currency: 'XLM',
    status: 'ACTIVE',
    freelancerAddress: 'GB3Y9KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWYZ',
    pendingReviewMilestone: {
      idx: 1,
      title: 'Client-Side Deliverable Hasher & Freighter Kit Integration',
      amount: '1,500',
      deliverableHash: 'cb8379ac2098aa165029e3938a51da0bcecfc008fd6795f401178647f96c5b34',
      revisionCount: 1,
    },
  },
  {
    id: 'job-1042-fiat-anchor-rails',
    title: 'SEP-24 Interactive Off-Ramp Flow for Cowrie & M-Pesa',
    totalBudget: '22000000000',
    escrowBalance: '22000000000',
    currency: 'USDC',
    status: 'CREATED',
    freelancerAddress: '',
  },
];

export default function ClientDashboardPage() {
  const { state: wallet } = useWallet();
  const [jobs, setJobs] = useState<ClientJobItem[]>(mockClientJobs);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ClientJobItem | null>(null);

  const handleOpenReview = (job: ClientJobItem) => {
    setSelectedJob(job);
    setReviewModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan">Client Hub</Badge>
            <Badge variant="purple" dot>
              Non-Custodial Escrow
            </Badge>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Client Escrows & Verifications
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit cryptographic deliverables, release instant milestone payouts, or open odd-panel disputes.
          </p>
        </div>

        <Link href="/jobs/new">
          <Button variant="primary" className="gap-2 text-xs shadow-glow">
            <Plus className="w-4 h-4" />
            <span>Post New Job & Fund Escrow</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Escrow Deposited</span>
            <Coins className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">6,700 XLM / USDC</div>
          <span className="text-[10px] text-emerald-400 font-mono">Locked in Soroban SAC</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Posted Contracts</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">2 Jobs</div>
          <span className="text-[10px] text-cyan-400 font-mono">1 active, 1 open</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Awaiting Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">1 Milestone</div>
          <span className="text-[10px] text-amber-400 font-mono">Action required before timeout</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Settled Payouts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">1,500 XLM</div>
          <span className="text-[10px] text-emerald-400 font-mono">1 milestone completed</span>
        </Card>
      </div>

      {/* Posted Jobs Section */}
      <Card className="p-6 bg-surface-100/80 border-white/5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Active Escrow Contracts</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">{jobs.length} Posted</span>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-xl bg-surface-200/50 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={job.status === 'ACTIVE' ? 'purple' : 'cyan'}>
                    {job.status}
                  </Badge>
                  <span className="text-sm font-bold text-white">{job.title}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>
                    Budget: <strong className="text-white">{formatStroopsToXlm(job.totalBudget)} {job.currency}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Remaining: <strong className="text-cyan-300">{formatStroopsToXlm(job.escrowBalance)} {job.currency}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Freelancer: {job.freelancerAddress ? formatAddress(job.freelancerAddress, 4) : 'Open'}
                  </span>
                </div>

                {job.pendingReviewMilestone && (
                  <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs flex items-center justify-between gap-2">
                    <span className="text-amber-300 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Milestone #{job.pendingReviewMilestone.idx + 1} Submitted: "{job.pendingReviewMilestone.title}"
                    </span>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleOpenReview(job)}
                      className="text-xs py-1 px-3 shadow-glow"
                    >
                      Inspect & Review
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <Link href={`/jobs/${job.id}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    <span>Manage Escrow</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Review Modal */}
      {selectedJob && selectedJob.pendingReviewMilestone && (
        <ClientReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          jobId={selectedJob.id}
          milestoneTitle={selectedJob.pendingReviewMilestone.title}
          milestoneIndex={selectedJob.pendingReviewMilestone.idx}
          amount={selectedJob.pendingReviewMilestone.amount}
          currency={selectedJob.currency}
          deliverableHash={selectedJob.pendingReviewMilestone.deliverableHash}
          revisionCount={selectedJob.pendingReviewMilestone.revisionCount}
          onApprove={async () => {
            const updated = jobs.map((j) =>
              j.id === selectedJob.id ? { ...j, pendingReviewMilestone: undefined } : j
            );
            setJobs(updated);
          }}
          onRequestRevision={async (fb) => {
            alert('Revision submitted!');
          }}
          onOpenDispute={async (reason) => {
            alert('Dispute opened!');
          }}
        />
      )}
    </div>
  );
}
