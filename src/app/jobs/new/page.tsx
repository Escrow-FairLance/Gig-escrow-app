'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Layers,
  Scale,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { useWallet } from '../../../wallet/context.js';
import { MilestoneDraft, MilestoneBuilder } from '../../../components/jobs/MilestoneBuilder.js';
import { ArbitratorSelector } from '../../../components/jobs/ArbitratorSelector.js';
import { TermsPreviewModal } from '../../../components/jobs/TermsPreviewModal.js';
import { Button, Card, Badge, Input } from '../../../components/ui/index.js';
import { CATEGORIES } from '../../../components/jobs/JobFilter.js';

export default function CreateJobPage() {
  const router = useRouter();
  const { state: wallet } = useWallet();

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Soroban & Rust');
  const [description, setDescription] = useState('');
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [currency, setCurrency] = useState<'XLM' | 'USDC'>('XLM');

  // Milestones
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([
    {
      id: 'm-1',
      title: 'Milestone 1: Core Architecture & Spec',
      description: 'Initial architectural diagram, data structures, and test suite setup.',
      amount: '500',
      durationDays: 7,
    },
    {
      id: 'm-2',
      title: 'Milestone 2: Implementation & Deliverable Hash',
      description: 'Full code implementation, cryptographic file hash submission, and unit tests.',
      amount: '1000',
      durationDays: 14,
    },
  ]);

  // Parameters
  const [reviewWindowHours, setReviewWindowHours] = useState(72);
  const [workTimeoutDays, setWorkTimeoutDays] = useState(14);
  const [disputeWindowDays, setDisputeWindowDays] = useState(7);

  // Arbitrators
  const [panelSize, setPanelSize] = useState<1 | 3 | 5 | 7>(3);
  const [selectedArbitrators, setSelectedArbitrators] = useState<string[]>([
    'GDC7W8KMQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWAA',
    'GCK45NMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWBB',
    'GBR12VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWCC',
  ]);

  // Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const totalBudget = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim()) {
        alert('Please enter a job title');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (totalBudget <= 0) {
        alert('Total escrow budget must be greater than zero');
        return;
      }
      setStep(3);
    }
  };

  const handlePrev = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Wizard Progress Stepper */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <Badge variant="cyan" className="mb-2">
              Step {step} of 3
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Post Job & Fund Soroban Escrow
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Total Upfront Escrow:</span>
            <div className="text-lg font-black text-cyan-400 font-mono">
              {totalBudget.toLocaleString()} {currency}
            </div>
          </div>
        </div>

        {/* Step indicator bar */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className={`h-1.5 rounded-full transition-all ${
              step >= 1 ? 'bg-cyan-400' : 'bg-surface-300'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all ${
              step >= 2 ? 'bg-cyan-400' : 'bg-surface-300'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all ${
              step >= 3 ? 'bg-cyan-400' : 'bg-surface-300'
            }`}
          />
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card className="p-6 bg-surface-100/90 border-white/5 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Project Scope & Roles</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Job Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Build Soroban Escrow & Cross-Border Rails Bridge"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Escrow Settlement Currency
                </label>
                <div className="flex items-center gap-2 p-1 rounded-xl bg-surface-200/80 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setCurrency('XLM')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                      currency === 'XLM'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    XLM (Stellar Native)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USDC')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                      currency === 'USDC'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    USDC (Stablecoin)
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Assigned Freelancer Public Key (Optional)
              </label>
              <input
                type="text"
                placeholder="Leave blank for open public applications (e.g. G..."
                value={freelancerAddress}
                onChange={(e) => setFreelancerAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-slate-500">
                If specified, only this Stellar wallet can accept and submit deliverables for this escrow.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Detailed Project Description
              </label>
              <textarea
                rows={4}
                placeholder="Outline project objectives, tech stack expectations, architecture requirements, and milestones..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <Button variant="primary" onClick={handleNext} className="gap-2">
              <span>Continue to Milestones</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Milestone Schedule */}
      {step === 2 && (
        <Card className="p-6 bg-surface-100/90 border-white/5 space-y-6">
          <MilestoneBuilder
            milestones={milestones}
            currency={currency}
            onChange={setMilestones}
          />

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <Button variant="outline" onClick={handlePrev} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            <Button variant="primary" onClick={handleNext} className="gap-2">
              <span>Continue to Protections</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Protections & Arbitration Panel */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Timeout & Review Windows Card */}
          <Card className="p-6 bg-surface-100/90 border-white/5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Anti-Ghosting & Timeout Windows</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Client Review Window
                </label>
                <select
                  value={reviewWindowHours}
                  onChange={(e) => setReviewWindowHours(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value={24}>24 Hours (Fast Pace)</option>
                  <option value={48}>48 Hours (Standard)</option>
                  <option value={72}>72 Hours (Recommended)</option>
                  <option value={168}>7 Days (Extended)</option>
                </select>
                <p className="text-[10px] text-slate-500">
                  If client is silent past this window, payment auto-releases.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Freelancer Work Timeout
                </label>
                <select
                  value={workTimeoutDays}
                  onChange={(e) => setWorkTimeoutDays(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days (Standard)</option>
                  <option value={30}>30 Days</option>
                  <option value={60}>60 Days</option>
                </select>
                <p className="text-[10px] text-slate-500">
                  If worker abandons without submission, client reclaims funds.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Dispute Voting Window
                </label>
                <select
                  value={disputeWindowDays}
                  onChange={(e) => setDisputeWindowDays(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days (Standard)</option>
                </select>
                <p className="text-[10px] text-slate-500">
                  Time allocated for jurors to audit evidence and rule.
                </p>
              </div>
            </div>
          </Card>

          {/* Arbitrator Selector */}
          <ArbitratorSelector
            panelSize={panelSize}
            onPanelSizeChange={setPanelSize}
            selectedArbitrators={selectedArbitrators}
            onSelectArbitrator={setSelectedArbitrators}
            clientAddress={wallet.address || undefined}
            freelancerAddress={freelancerAddress || undefined}
          />

          {/* Final Action Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-100 border border-white/10">
            <Button variant="outline" onClick={handlePrev} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsPreviewOpen(true)}
              className="gap-2 shadow-glow"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>Preview Terms & Fund Escrow ({totalBudget.toLocaleString()} {currency})</span>
            </Button>
          </div>
        </div>
      )}

      {/* Terms Preview & Escrow Funding Modal */}
      <TermsPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        jobDraft={{
          title,
          description,
          freelancerAddress,
          tokenAddress:
            currency === 'XLM'
              ? 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'
              : 'CCW67KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWEE',
          currency,
          totalAmount: totalBudget.toString(),
          reviewWindowHours,
          workTimeoutDays,
          disputeWindowDays,
          arbitrators: selectedArbitrators,
          milestones,
        }}
        onConfirmSuccess={(tx) => {
          setTimeout(() => {
            router.push('/jobs');
          }, 1500);
        }}
      />
    </div>
  );
}
