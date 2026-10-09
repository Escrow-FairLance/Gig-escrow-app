'use client';

import React, { useState } from 'react';
import { Scale, AlertTriangle, X, ShieldAlert, FileText, Lock } from 'lucide-react';
import { computeSha256 } from '../../crypto/hasher';
import { Button, Card, Badge } from '../ui/index';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneIndex: number;
  arbitratorPanelCount: number;
  arbitratorFeeBps: number;
  onConfirmDispute: (reasonText: string, reasonHash: string) => Promise<void>;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  milestoneIndex,
  arbitratorPanelCount,
  arbitratorFeeBps,
  onConfirmDispute,
}) => {
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please specify clear dispute justification');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = JSON.stringify({
        reason: reason.trim(),
        evidenceUrl: evidenceUrl.trim(),
        timestamp: new Date().toISOString(),
      });
      const hash = await computeSha256(payload);
      await onConfirmDispute(payload, hash);
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
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Initiate Formal Dispute Arbitration
              </h3>
              <p className="text-xs text-slate-400">
                Milestone #{milestoneIndex + 1} • Soroban Dispute Escalation
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
          {/* Arbitration Warning Box */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Odd-Sized Juror Quorum: {arbitratorPanelCount} Arbitrators</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once escalated, the milestone escrow funds are frozen. The designated {arbitratorPanelCount}-member
              arbitration panel will review both parties' claims, examine cryptographic deliverable hashes,
              and cast votes to reach majority consensus.
            </p>
            <div className="text-[11px] font-mono text-amber-400">
              Arbitration Fee: <strong>{arbitratorFeeBps / 100}%</strong> (deducted proportionally upon ruling)
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Formal Claim & Disagreement Statement <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Detail specifically what terms were violated, missing deliverables, or failures to comply with milestone specifications..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Evidence Link or Encrypted Vault CID (Optional)
            </label>
            <input
              type="text"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="e.g. ipfs://bafy... or encrypted evidence archive link"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              isLoading={isSubmitting}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold"
            >
              <span>Escalate to Arbitration Panel</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
