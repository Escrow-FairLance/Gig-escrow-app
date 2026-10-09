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
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Card, Button, Badge } from '../ui/index';

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

  if (!isOpen) return null;

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

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-surface-200/80 border border-white/10 mb-6 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('inspect')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'inspect'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Inspect & Sign Off
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('revision')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'revision'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Request Revision ({revisionCount}/2)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dispute')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'dispute'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
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
                Approving executes immediate non-custodial smart contract transfer directly to the freelancer's
                wallet on the Stellar network.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Later
              </Button>
              <Button
                variant="primary"
                isLoading={isProcessing}
                onClick={handleApproveClick}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold gap-2 shadow-glow"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Instant Payout ({amount} {currency})</span>
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Revision */}
        {activeTab === 'revision' && (
          <form onSubmit={handleRevisionSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Revision Feedback
              </label>
              <textarea
                rows={4}
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="State specific adjustments required before sign-off..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                isLoading={isProcessing}
                className="text-purple-300 hover:text-white border-purple-500/30"
              >
                Submit Revision Request
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Dispute */}
        {activeTab === 'dispute' && (
          <form onSubmit={handleDisputeSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Dispute Justification
              </label>
              <textarea
                rows={4}
                required
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Provide detailed justification for the odd-panel arbitrators..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                isLoading={isProcessing}
                className="text-amber-300 border-amber-500/30 hover:bg-amber-950/30"
              >
                Open Arbitration Dispute
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
