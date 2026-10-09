'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Coins,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  ArrowUpRight,
  ShieldCheck,
  RotateCw,
  Landmark,
} from 'lucide-react';
import { useWallet } from '../../../wallet/context.js';
import { formatAddress, formatStroopsToXlm } from '../../../config/constants.js';
import { DeliverableSubmitModal } from '../../../components/dashboard/DeliverableSubmitModal.js';
import { Card, Button, Badge } from '../../../components/ui/index.js';

interface FreelancerMilestoneItem {
  jobId: string;
  milestoneIdx: number;
  title: string;
  amount: string;
  currency: string;
  status: 'PENDING' | 'SUBMITTED' | 'REVISION_REQUESTED' | 'APPROVED' | 'DISPUTED';
  reviewWindowEnds?: string;
  revisionCount: number;
}

const mockFreelancerTasks: FreelancerMilestoneItem[] = [
  {
    jobId: 'job-9841-soroban-escrow',
    milestoneIdx: 1,
    title: 'Client-Side Deliverable Hasher & Freighter Kit Integration',
    amount: '15000000000',
    currency: 'XLM',
    status: 'SUBMITTED',
    reviewWindowEnds: 'in 36 hours',
    revisionCount: 1,
  },
  {
    jobId: 'job-5520-fullstack-defi-ui',
    milestoneIdx: 2,
    title: 'Production Deployment & Sub-Second Indexing Pipeline',
    amount: '20000000000',
    currency: 'XLM',
    status: 'DISPUTED',
    revisionCount: 2,
  },
  {
    jobId: 'job-9841-soroban-escrow',
    milestoneIdx: 2,
    title: 'End-to-End Testnet Verification & Security Audit Report',
    amount: '15000000000',
    currency: 'XLM',
    status: 'PENDING',
    revisionCount: 0,
  },
];

export default function FreelancerDashboardPage() {
  const { state: wallet } = useWallet();
  const [tasks, setTasks] = useState(mockFreelancerTasks);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<FreelancerMilestoneItem | null>(null);

  const handleSubmitClick = (task: FreelancerMilestoneItem) => {
    setActiveTask(task);
    setSubmitModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="purple">Freelancer Hub</Badge>
            <Badge variant="emerald" dot>
              Escrow Guaranteed
            </Badge>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Freelancer Workspace & Earnings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track active milestone submissions, anti-ghosting review windows, and off-ramp earnings to fiat.
          </p>
        </div>

        <Link href="/rails">
          <Button variant="glow" className="gap-2 text-xs">
            <Landmark className="w-4 h-4 text-cyan-400" />
            <span>SEP-24 Fiat Cashout</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Escrow Locked</span>
            <Coins className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">5,000 XLM</div>
          <span className="text-[10px] text-emerald-400 font-mono">Upfront deposit verified</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Contracts</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">2 Jobs</div>
          <span className="text-[10px] text-purple-400 font-mono">3 Milestones in flight</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Under Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">1,500 XLM</div>
          <span className="text-[10px] text-cyan-400 font-mono">Auto-release active</span>
        </Card>

        <Card className="p-5 bg-surface-100/90 border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Settled to Date</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">3,500 XLM</div>
          <span className="text-[10px] text-slate-400 font-mono">Instant smart contract releases</span>
        </Card>
      </div>

      {/* Active Milestones Table */}
      <Card className="p-6 bg-surface-100/80 border-white/5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Active Milestones & Deliverables</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {tasks.length} Assigned Tasks
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-200/50 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" className="font-mono text-[10px]">
                    {task.jobId.slice(0, 8)}
                  </Badge>
                  <span className="text-sm font-bold text-white">{task.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>
                    Payout: <strong className="text-white">{formatStroopsToXlm(task.amount)} {task.currency}</strong>
                  </span>
                  <span>•</span>
                  <span>Revisions: {task.revisionCount} / 2</span>
                  {task.reviewWindowEnds && (
                    <>
                      <span>•</span>
                      <span className="text-cyan-300">Auto-release {task.reviewWindowEnds}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                {task.status === 'SUBMITTED' && (
                  <Badge variant="cyan" dot>
                    Under Review
                  </Badge>
                )}
                {task.status === 'REVISION_REQUESTED' && (
                  <Badge variant="purple">Revision Required</Badge>
                )}
                {task.status === 'DISPUTED' && (
                  <Badge variant="amber">In Arbitration</Badge>
                )}
                {task.status === 'PENDING' && (
                  <Badge variant="slate">Ready for Work</Badge>
                )}

                {(task.status === 'PENDING' || task.status === 'REVISION_REQUESTED') && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleSubmitClick(task)}
                    className="text-xs shadow-glow"
                  >
                    <UploadCloud className="w-3.5 h-3.5 mr-1" />
                    <span>Submit Work</span>
                  </Button>
                )}

                <Link href={`/jobs/${task.jobId}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    <span>View Contract</span>
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deliverable Submit Modal */}
      {activeTask && (
        <DeliverableSubmitModal
          isOpen={submitModalOpen}
          onClose={() => setSubmitModalOpen(false)}
          milestoneTitle={activeTask.title}
          milestoneIndex={activeTask.milestoneIdx}
          onSubmitSuccess={async (hash, notes) => {
            const updated = tasks.map((t) =>
              t.jobId === activeTask.jobId && t.milestoneIdx === activeTask.milestoneIdx
                ? { ...t, status: 'SUBMITTED' as const }
                : t
            );
            setTasks(updated);
          }}
        />
      )}
    </div>
  );
}
