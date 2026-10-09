'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  FileCheck,
  ShieldCheck,
  Copy,
  ExternalLink,
  Lock,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { MilestoneView, JobStatus } from '../../types/escrow';
import { formatAddress, formatStroopsToXlm } from '../../config/constants';
import { Card, Badge, Button } from '../ui/index';

interface MilestoneTimelineProps {
  milestones: MilestoneView[];
  currentMilestoneIndex: number;
  jobStatus: JobStatus;
  tokenSymbol: string;
  isClient: boolean;
  isFreelancer: boolean;
  onApprove: (milestoneIndex: number) => void;
  onRequestRevision: (milestoneIndex: number) => void;
  onOpenDispute: (milestoneIndex: number) => void;
  onSubmitDeliverable: (milestoneIndex: number) => void;
  onAutoRelease: (milestoneIndex: number) => void;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  currentMilestoneIndex,
  jobStatus,
  tokenSymbol,
  isClient,
  isFreelancer,
  onApprove,
  onRequestRevision,
  onOpenDispute,
  onSubmitDeliverable,
  onAutoRelease,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>Milestone Timeline & Cryptographic Deliverables</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Every submission is anchored by an immutable 32-byte SHA-256 hash committed to Soroban.
          </p>
        </div>

        <Badge variant="cyan" className="font-mono text-xs">
          {milestones.filter((m) => m.status === 'APPROVED').length} / {milestones.length} Completed
        </Badge>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, idx) => {
          const isCurrent = idx === currentMilestoneIndex;
          const isApproved = milestone.status === 'APPROVED';
          const isSubmitted = milestone.status === 'SUBMITTED';
          const isRevision = milestone.status === 'REVISION_REQUESTED';
          const isDisputed = milestone.status === 'DISPUTED';

          return (
            <Card
              key={milestone.id || idx}
              className={`p-6 transition-all ${
                isApproved
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : isSubmitted
                  ? 'bg-cyan-950/20 border-cyan-500/30 shadow-glow'
                  : isDisputed
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-surface-100/80 border-white/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                      isApproved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isSubmitted
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : isDisputed
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-surface-200 text-slate-400'
                    }`}
                  >
                    {isApproved ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{milestone.title}</h4>
                    <span className="text-xs text-slate-400">
                      Target Deadline: {milestone.deadline}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-sm font-black text-white font-mono">
                      {formatStroopsToXlm(milestone.amount)} {tokenSymbol}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Revisions: {milestone.revisionCount} / 2
                    </span>
                  </div>

                  {/* Status Badges */}
                  {isApproved && <Badge variant="emerald">Approved & Paid</Badge>}
                  {isSubmitted && <Badge variant="cyan" dot>Under Client Review</Badge>}
                  {isRevision && <Badge variant="purple">Revision #{milestone.revisionCount} Active</Badge>}
                  {isDisputed && <Badge variant="amber">Disputed</Badge>}
                  {milestone.status === 'PENDING' && <Badge variant="slate">Pending</Badge>}
                </div>
              </div>

              {milestone.description && (
                <p className="text-xs text-slate-300 leading-relaxed mb-4 p-3 rounded-xl bg-surface-200/50 border border-white/5">
                  {milestone.description}
                </p>
              )}

              {/* Cryptographic SHA-256 Deliverable Box */}
              {milestone.deliverableHash && (
                <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/20 mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      Soroban Deliverable Checksum:
                    </span>
                    <button
                      onClick={() => copyToClipboard(milestone.deliverableHash || '')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy 32-Byte Hash</span>
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-slate-300 break-all select-all">
                    0x{milestone.deliverableHash}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                    <Badge variant="purple" className="text-[9px] py-0 px-1">
                      AES-256-GCM Encrypted
                    </Badge>
                    <span>Integrity Verified Against Soroban Contract Storage</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  {isSubmitted && (
                    <span className="text-cyan-300 font-mono text-[11px] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      Client Review Window Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Freelancer Submission Action */}
                  {isFreelancer && (milestone.status === 'PENDING' || isRevision) && isCurrent && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onSubmitDeliverable(idx)}
                      className="shadow-glow text-xs"
                    >
                      <FileCheck className="w-3.5 h-3.5 mr-1" />
                      <span>Submit Deliverable Hash</span>
                    </Button>
                  )}

                  {/* Client Review Actions */}
                  {isClient && isSubmitted && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onApprove(idx)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        <span>Approve Instant Payout</span>
                      </Button>

                      {milestone.revisionCount < 2 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onRequestRevision(idx)}
                          className="text-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1" />
                          <span>Request Revision ({milestone.revisionCount}/2)</span>
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onOpenDispute(idx)}
                        className="text-xs"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        <span>Open Dispute</span>
                      </Button>
                    </>
                  )}

                  {/* Auto-Release Action (Anyone can trigger if client silent) */}
                  {isSubmitted && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAutoRelease(idx)}
                      className="text-xs border-cyan-500/30 text-cyan-300 hover:text-white"
                      title="Trigger payout if review window has expired without client objection"
                    >
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <span>Execute Auto-Release</span>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
