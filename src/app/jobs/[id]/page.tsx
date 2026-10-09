'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Lock,
  Clock,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Coins,
  Copy,
  ExternalLink,
  Layers,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useWallet } from '../../../wallet/context.js';
import { JobView, MilestoneView, JobStatus } from '../../../types/escrow.js';
import { formatAddress, formatStroopsToXlm, STELLAR_CONFIG } from '../../../config/constants.js';
import { getExplorerContractUrl } from '../../../contracts/tokens.js';
import { MilestoneTimeline } from '../../../components/jobs/MilestoneTimeline.js';
import { AutoReleaseTimerCard } from '../../../components/jobs/AutoReleaseTimerCard.js';
import { RevisionModal } from '../../../components/jobs/RevisionModal.js';
import { DisputeModal } from '../../../components/jobs/DisputeModal.js';
import { CancellationCard } from '../../../components/jobs/CancellationCard.js';
import { Card, Button, Badge } from '../../../components/ui/index.js';

// Realistic sample job mock
const sampleJob: JobView = {
  id: 'job-9841-soroban-escrow',
  clientAddress: 'GAAX7KL5JWMQPZTY7XG276QWNR25K4ZTYPQQV9J3KMTRL67WZX',
  freelancerAddress: 'GB3Y9KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWYZ',
  tokenAddress: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
  totalAmount: '45000000000', // 4,500 XLM
  escrowBalance: '30000000000', // 3,000 XLM remaining
  status: 'ACTIVE',
  currentMilestoneIndex: 1,
  milestoneCount: 3,
  termsHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  arbitratorFeeBps: 300,
  reviewWindowSeconds: '259200', // 72 hours
  workTimeoutSeconds: '1209600', // 14 days
  disputeWindowSeconds: '604800',
  arbitratorPanel: [
    'GDC7W8KMQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWAA',
    'GCK45NMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWBB',
    'GBR12VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWCC',
  ],
  milestones: [
    {
      id: 'm1',
      index: 0,
      title: 'Soroban Escrow Smart Contract v1 & Invariant Tests',
      amount: '15000000000',
      deadline: '2026-10-15',
      status: 'APPROVED',
      revisionCount: 0,
      deliverableHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      submittedAt: '2026-10-03T12:00:00Z',
      approvedAt: '2026-10-04T15:00:00Z',
    },
    {
      id: 'm2',
      index: 1,
      title: 'Client-Side Deliverable Hasher & Freighter Kit Integration',
      amount: '15000000000',
      deadline: '2026-10-24',
      status: 'SUBMITTED',
      revisionCount: 1,
      deliverableHash: 'cb8379ac2098aa165029e3938a51da0bcecfc008fd6795f401178647f96c5b34',
      submittedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 36 hours ago
    },
    {
      id: 'm3',
      index: 2,
      title: 'End-to-End Testnet Verification & Security Audit Report',
      amount: '15000000000',
      deadline: '2026-11-05',
      status: 'PENDING',
      revisionCount: 0,
    },
  ],
  createdAt: '2026-10-01T10:00:00Z',
  updatedAt: '2026-10-07T14:30:00Z',
};

export default function JobDetailPage() {
  const params = useParams();
  const { state: wallet } = useWallet();
  const [job, setJob] = useState<JobView>(sampleJob);

  // Modals state
  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState<number>(0);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const isClient = wallet.isConnected && wallet.address === job.clientAddress;
  const isFreelancer = wallet.isConnected && wallet.address === job.freelancerAddress;
  const isXlm = !job.tokenAddress || job.tokenAddress.startsWith('CDLZ');
  const tokenSymbol = isXlm ? 'XLM' : 'USDC';

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Handlers
  const handleApprovePayout = async (milestoneIdx: number) => {
    const updated = { ...job };
    updated.milestones[milestoneIdx].status = 'APPROVED';
    updated.milestones[milestoneIdx].approvedAt = new Date().toISOString();
    const paidAmount = BigInt(updated.milestones[milestoneIdx].amount);
    updated.escrowBalance = (BigInt(updated.escrowBalance) - paidAmount).toString();

    if (milestoneIdx + 1 < updated.milestones.length) {
      updated.currentMilestoneIndex = milestoneIdx + 1;
    } else {
      updated.status = 'COMPLETED';
    }
    setJob(updated);
    showNotification(`Milestone #${milestoneIdx + 1} approved! Instant payout dispatched on-chain.`);
  };

  const handleOpenRevisionModal = (milestoneIdx: number) => {
    setSelectedMilestoneIdx(milestoneIdx);
    setIsRevisionOpen(true);
  };

  const handleConfirmRevision = async (feedbackText: string, feedbackHash: string) => {
    const updated = { ...job };
    const m = updated.milestones[selectedMilestoneIdx];
    m.status = 'REVISION_REQUESTED';
    m.revisionCount += 1;
    m.revisionFeedbackHash = feedbackHash;
    setJob(updated);
    showNotification(`Revision #${m.revisionCount} requested and committed to Soroban!`);
  };

  const handleOpenDisputeModal = (milestoneIdx: number) => {
    setSelectedMilestoneIdx(milestoneIdx);
    setIsDisputeOpen(true);
  };

  const handleConfirmDispute = async (reasonText: string, reasonHash: string) => {
    const updated = { ...job };
    updated.milestones[selectedMilestoneIdx].status = 'DISPUTED';
    updated.status = 'DISPUTED';
    setJob(updated);
    showNotification('Dispute registered! Assigned to 3-juror arbitration panel.');
  };

  const handleAutoRelease = async (milestoneIdx: number) => {
    await handleApprovePayout(milestoneIdx);
    showNotification('Anti-ghosting auto-release executed! Payment successfully delivered.');
  };

  const handleMutualCancel = async () => {
    const updated = { ...job, status: 'CANCELLED' as JobStatus };
    setJob(updated);
    showNotification('Contract mutually cancelled. Remaining escrow returned to client.');
  };

  const handleReclaimStalled = async () => {
    const updated = { ...job, status: 'STALLED_RECLAIMED' as JobStatus, escrowBalance: '0' };
    setJob(updated);
    showNotification('Unreleased escrow funds successfully reclaimed by client.');
  };

  const currentMilestone = job.milestones[job.currentMilestoneIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs Marketplace</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <Card glow className="p-6 sm:p-8 bg-surface-100/90 border-cyan-500/30 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={job.status === 'ACTIVE' ? 'purple' : job.status === 'COMPLETED' ? 'emerald' : 'cyan'} dot>
                {job.status}
              </Badge>
              <Badge variant="cyan" className="font-mono text-[10px]">
                Contract: {formatAddress(STELLAR_CONFIG.escrowContractId, 4)}
              </Badge>
              <Badge variant="purple" className="text-[10px]">
                Soroban Testnet
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Job #{job.id}: Soroban Escrow & Cross-Border Rails Bridge
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Escrow Value / Balance</span>
            <div className="text-2xl font-black text-cyan-400 font-mono">
              {formatStroopsToXlm(job.escrowBalance)}{' '}
              <span className="text-sm text-slate-400 font-normal">/ {formatStroopsToXlm(job.totalAmount)} {tokenSymbol}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">
              100% Upfront Funded On-Chain
            </span>
          </div>
        </div>

        {/* Roles & Parties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-200/60 border border-white/5 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Client Wallet</span>
            <div className="font-mono text-white font-bold flex items-center gap-1.5">
              <span>{formatAddress(job.clientAddress, 5)}</span>
              {isClient && <Badge variant="cyan" className="text-[9px] py-0 px-1">You</Badge>}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-200/60 border border-white/5 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Freelancer Wallet</span>
            <div className="font-mono text-white font-bold flex items-center gap-1.5">
              <span>{job.freelancerAddress ? formatAddress(job.freelancerAddress, 5) : 'Open Application'}</span>
              {isFreelancer && <Badge variant="purple" className="text-[9px] py-0 px-1">You</Badge>}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-200/60 border border-white/5 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Arbitration Quorum</span>
            <div className="font-mono text-amber-300 font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>{job.arbitratorPanel.length}-Juror Odd Panel ({job.arbitratorFeeBps / 100}% Fee)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Auto-Release Countdown (if milestone is currently SUBMITTED) */}
      {currentMilestone && currentMilestone.status === 'SUBMITTED' && (
        <AutoReleaseTimerCard
          milestoneIndex={job.currentMilestoneIndex}
          submittedAt={currentMilestone.submittedAt}
          reviewWindowSeconds={parseInt(job.reviewWindowSeconds)}
          onTriggerAutoRelease={() => handleAutoRelease(job.currentMilestoneIndex)}
        />
      )}

      {/* Milestone Timeline */}
      <MilestoneTimeline
        milestones={job.milestones}
        currentMilestoneIndex={job.currentMilestoneIndex}
        jobStatus={job.status}
        tokenSymbol={tokenSymbol}
        isClient={isClient}
        isFreelancer={isFreelancer}
        onApprove={handleApprovePayout}
        onRequestRevision={handleOpenRevisionModal}
        onOpenDispute={handleOpenDisputeModal}
        onSubmitDeliverable={(idx) => {
          const updated = { ...job };
          updated.milestones[idx].status = 'SUBMITTED';
          updated.milestones[idx].deliverableHash = 'fa89' + Math.random().toString(16).substring(2, 10) + 'cc34';
          updated.milestones[idx].submittedAt = new Date().toISOString();
          setJob(updated);
          showNotification('Deliverable SHA-256 hash committed on Soroban testnet!');
        }}
        onAutoRelease={handleAutoRelease}
      />

      {/* Cancellation and Reclaim Section */}
      <CancellationCard
        escrowBalance={job.escrowBalance}
        tokenSymbol={tokenSymbol}
        workTimeoutSeconds={parseInt(job.workTimeoutSeconds)}
        isStalledEligible={false}
        isClient={isClient}
        isFreelancer={isFreelancer}
        onMutualCancel={handleMutualCancel}
        onReclaimStalled={handleReclaimStalled}
      />

      {/* Revision Modal */}
      <RevisionModal
        isOpen={isRevisionOpen}
        onClose={() => setIsRevisionOpen(false)}
        milestoneIndex={selectedMilestoneIdx}
        currentRevisionCount={job.milestones[selectedMilestoneIdx]?.revisionCount || 0}
        onConfirmRevision={handleConfirmRevision}
      />

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        milestoneIndex={selectedMilestoneIdx}
        arbitratorPanelCount={job.arbitratorPanel.length}
        arbitratorFeeBps={job.arbitratorFeeBps}
        onConfirmDispute={handleConfirmDispute}
      />
    </div>
  );
}
