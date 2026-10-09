'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { canonicalJsonStringify, computeTermsHash } from '../../crypto/hasher';
import { formatAddress, STELLAR_CONFIG } from '../../config/constants';
import { useWallet } from '../../wallet/context';
import { Card, Button, Badge } from '../ui/index';

interface TermsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobDraft: {
    title: string;
    description: string;
    freelancerAddress: string;
    tokenAddress: string;
    currency: 'XLM' | 'USDC';
    totalAmount: string;
    reviewWindowHours: number;
    workTimeoutDays: number;
    disputeWindowDays: number;
    arbitrators: string[];
    milestones: {
      title: string;
      description: string;
      amount: string;
      durationDays: number;
    }[];
  };
  onConfirmSuccess: (txHash: string) => void;
}

export const TermsPreviewModal: React.FC<TermsPreviewModalProps> = ({
  isOpen,
  onClose,
  jobDraft,
  onConfirmSuccess,
}) => {
  const { state: wallet } = useWallet();
  const [canonicalJson, setCanonicalJson] = useState<string>('');
  const [termsHash, setTermsHash] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [step, setStep] = useState<'review' | 'funding' | 'success'>('review');
  const [txResult, setTxResult] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const termsObj = {
      title: jobDraft.title,
      description: jobDraft.description,
      client: wallet.address || 'GAAX...CLIENT',
      freelancer: jobDraft.freelancerAddress || 'UNASSIGNED_OPEN',
      currency: jobDraft.currency,
      totalAmount: jobDraft.totalAmount,
      reviewWindowSeconds: jobDraft.reviewWindowHours * 3600,
      workTimeoutSeconds: jobDraft.workTimeoutDays * 86400,
      disputeWindowSeconds: jobDraft.disputeWindowDays * 86400,
      arbitrators: jobDraft.arbitrators,
      milestones: jobDraft.milestones.map((m, i) => ({
        index: i,
        title: m.title,
        amount: m.amount,
        durationDays: m.durationDays,
      })),
    };

    const canonical = canonicalJsonStringify(termsObj);
    setCanonicalJson(canonical);

    computeTermsHash(termsObj).then((h) => {
      setTermsHash(h);
    });
  }, [isOpen, jobDraft, wallet.address]);

  if (!isOpen) return null;

  const copyHash = () => {
    navigator.clipboard.writeText(termsHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignAndFund = async () => {
    setIsSubmitting(true);
    setStep('funding');

    try {
      // Simulate Soroban Contract Invocation: create_job
      // In production, invokes contract with client signature
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const mockTx =
        '3f9a7c2b' +
        Math.random().toString(16).substring(2, 10) +
        '88e1' +
        Math.random().toString(16).substring(2, 10);
      setTxResult(mockTx);
      setStep('success');
      setIsSubmitting(false);
      onConfirmSuccess(mockTx);
    } catch {
      setIsSubmitting(false);
      setStep('review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-surface-100/95 border border-white/10 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Canonical Terms Hashing & Escrow Funding
              </h3>
              <p className="text-xs text-slate-400">
                Soroban Smart Contract Verification Pipeline
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

        {step === 'review' && (
          <div className="space-y-6">
            {/* Hash Display Card */}
            <div className="p-4 rounded-xl bg-surface-200/90 border border-cyan-500/30 shadow-glow">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  SHA-256 Terms Hash (Committed to Soroban)
                </span>
                <button
                  onClick={copyHash}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-white break-all bg-black/40 p-2.5 rounded-lg border border-white/5 selection:bg-cyan-500/30">
                0x{termsHash || 'computing...'}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                This 32-byte cryptographic hash binds the contract parameters on-chain without bloating
                contract ledger storage.
              </p>
            </div>

            {/* Escrow Parameters Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Total Escrow</span>
                <span className="font-mono font-bold text-white text-sm text-cyan-300">
                  {jobDraft.totalAmount} {jobDraft.currency}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Milestones</span>
                <span className="font-mono font-bold text-white text-sm">
                  {jobDraft.milestones.length} Phases
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Review Window</span>
                <span className="font-mono font-bold text-white text-sm">
                  {jobDraft.reviewWindowHours} Hours
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Arbitration</span>
                <span className="font-mono font-bold text-white text-sm text-amber-300">
                  {jobDraft.arbitrators.length} Jurors
                </span>
              </div>
            </div>

            {/* Canonical JSON View */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-slate-400 block">
                Deterministic Canonical JSON Payload:
              </span>
              <pre className="p-3 rounded-xl bg-black/50 border border-white/5 font-mono text-[11px] text-slate-300 max-h-40 overflow-y-auto no-scrollbar whitespace-pre-wrap break-all">
                {canonicalJson}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSignAndFund}
                disabled={!wallet.isConnected}
                className="gap-2 shadow-glow"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>
                  {wallet.isConnected
                    ? `Sign & Deposit ${jobDraft.totalAmount} ${jobDraft.currency}`
                    : 'Connect Wallet to Fund'}
                </span>
              </Button>
            </div>
          </div>
        )}

        {step === 'funding' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mx-auto" />
            <h4 className="text-lg font-bold text-white">Transacting on Soroban Testnet...</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Invoking <code className="text-cyan-300">create_job</code> with SAC allowance verification
              and terms hash commitment.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-glow">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-white">Escrow Successfully Funded!</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your contract is now live on the Soroban Testnet. Funds are held non-custodially until
              milestone delivery and sign-off.
            </p>

            <div className="p-3 rounded-xl bg-surface-200 border border-white/10 text-xs font-mono text-cyan-300 break-all max-w-md mx-auto">
              Tx: 0x{txResult}
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <Button variant="primary" onClick={onClose}>
                Done & View Active Job
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
