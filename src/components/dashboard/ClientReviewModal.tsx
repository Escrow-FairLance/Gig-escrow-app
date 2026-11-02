'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  X,
  ShieldCheck,
  FileCheck,
  Clock,
  Download,
} from 'lucide-react';
import { Card, Button, Badge } from '../ui/index';
import { deliverableStorageClient } from '../../storage/ipfs';

interface ClientReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  milestoneTitle: string;
  milestoneIndex: number;
  amount: string;
  currency: string;
  deliverableHash: string;
  revisionCount: number;
  onApprove: () => Promise<void>;
  onRequestRevision: (feedback: string) => Promise<void>;
  onOpenDispute: (reason: string) => Promise<void>;
}

export const ClientReviewModal: React.FC<ClientReviewModalProps> = ({
  isOpen,
  onClose,
  jobId,
  milestoneTitle,
  milestoneIndex,
  amount,
  currency,
  deliverableHash,
  revisionCount,
  onApprove,
  onRequestRevision,
  onOpenDispute,
}) => {
  const [activeTab, setActiveTab] = useState<'inspect' | 'revision' | 'dispute'>('inspect');
  const [feedback, setFeedback] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadAndDecrypt = async () => {
    setIsDecrypting(true);
    try {
      const { data, packageInfo } = await deliverableStorageClient.retrieveAndDecryptDeliverable({
        sha256OrCid: deliverableHash,
        encryptionSecret: 'fairlance-escrow-key',
      });
      const blob = new Blob([data], { type: packageInfo.mimeType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = packageInfo.originalFileName || `deliverable-${milestoneIndex + 1}.bin`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Deliverable package not available in local testnet cache.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleApproveClick = async () => {
    setIsProcessing(true);
    try {
      await onApprove();
      setIsProcessing(false);
      onClose();
    } catch {
      setIsProcessing(false);
    }
  };

  const handleRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setIsProcessing(true);
    try {
      await onRequestRevision(feedback.trim());
      setIsProcessing(false);
      onClose();
    } catch {
      setIsProcessing(false);
    }
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;
    setIsProcessing(true);
    try {
      await onOpenDispute(disputeReason.trim());
      setIsProcessing(false);
      onClose();
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-surface-100/95 border border-white/10 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Review Milestone Deliverable</h3>
              <p className="text-xs text-slate-400">
                Milestone #{milestoneIndex + 1}: {milestoneTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-surface-200/60 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('inspect')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'inspect'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Inspect & Sign Off
          </button>
          <button
            onClick={() => setActiveTab('revision')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'revision'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Request Revision ({revisionCount}/2)
          </button>
          <button
            onClick={() => setActiveTab('dispute')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dispute'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dispute Panel
          </button>
        </div>

        {/* Tab 1: Inspect & Sign Off */}
        {activeTab === 'inspect' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-200/90 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Delivered SHA-256 Checksum:
                </span>
                <span className="text-emerald-400 font-mono text-xs font-bold">
                  {amount} {currency}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-300 break-all bg-black/40 p-2.5 rounded-lg border border-white/5 select-all">
                0x{deliverableHash}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Approving executes immediate non-custodial smart contract transfer directly to the freelancer&apos;s
                wallet on the Stellar network.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadAndDecrypt}
                  disabled={isDecrypting}
                  className="text-xs gap-1.5 border-cyan-500/30 hover:border-cyan-400 text-cyan-300"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDecrypting ? 'Decrypting AES-256...' : 'Download & Decrypt Archive'}</span>
                </Button>
                {downloadSuccess && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Integrity Verified
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Later
              </Button>
              <Button
                variant="primary"
                isLoading={isProcessing}
                onClick={handleApproveClick}
                className="gap-2 shadow-glow"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Sign Off & Release Payout</span>
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Request Revision */}
        {activeTab === 'revision' && (
          <form onSubmit={handleRevisionSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 space-y-1">
              <span className="font-bold">Strict 2-Revision Limit Protection:</span>
              <p className="text-slate-400 text-[11px]">
                Clients are allotted up to 2 revisions per milestone to prevent scope creep. Feedback is
                hashed and committed on-chain.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Actionable Feedback for Freelancer
              </label>
              <textarea
                rows={4}
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Explicitly detail discrepancies against original milestone terms..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <Button variant="outline" type="button" onClick={onClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                isLoading={isProcessing}
                disabled={revisionCount >= 2 || !feedback.trim()}
                className="gap-2 text-amber-400 border-amber-500/30 hover:border-amber-400"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Commit Revision Request (#{revisionCount + 1}/2)</span>
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Dispute */}
        {activeTab === 'dispute' && (
          <form onSubmit={handleDisputeSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Escalate to Decentralized Arbitrator Panel
              </span>
              <p className="text-slate-400 text-[11px]">
                Freezes escrow balance and transfers ruling authority to the odd-sized juror quorum.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Dispute Claim & Justification
              </label>
              <textarea
                rows={4}
                required
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Describe reason for dispute, lack of delivery, or critical contract violation..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <Button variant="outline" type="button" onClick={onClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                isLoading={isProcessing}
                disabled={!disputeReason.trim()}
                className="gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Open Formal Dispute</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
