'use client';

import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { computeSha256 } from '../../crypto/hasher';
import { Card, Button, Badge } from '../ui/index';

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneIndex: number;
  currentRevisionCount: number;
  onConfirmRevision: (feedbackText: string, feedbackHash: string) => Promise<void>;
}

export const RevisionModal: React.FC<RevisionModalProps> = ({
  isOpen,
  onClose,
  milestoneIndex,
  currentRevisionCount,
  onConfirmRevision,
}) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const remainingRevisions = 2 - currentRevisionCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      alert('Please specify clear revision feedback');
      return;
    }

    setIsSubmitting(true);
    try {
      const hash = await computeSha256(feedback.trim());
      await onConfirmRevision(feedback.trim(), hash);
      setIsSubmitting(false);
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-surface-100/95 border border-white/10 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Request Milestone Revision (#{currentRevisionCount + 1})
              </h3>
              <p className="text-xs text-slate-400">
                Milestone #{milestoneIndex + 1}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <strong className="text-white">Revision Limit Enforced On-Chain:</strong>
              <div className="mt-1">
                Clients are allowed a maximum of <strong>2 revisions</strong> per milestone. You
                have <strong className="text-purple-300">{remainingRevisions}</strong> remaining.
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Detailed Revision Feedback & Deficiencies Found
            </label>
            <textarea
              rows={4}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="State precisely what deliverables fell short of acceptance criteria and required modifications..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-400 resize-none"
            />
            <p className="text-[11px] text-slate-500">
              Feedback is cryptographically hashed (SHA-256) and committed on Soroban.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              <span>Submit Formal Revision Request</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
