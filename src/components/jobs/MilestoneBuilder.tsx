'use client';

import React from 'react';
import { Plus, Trash2, Layers, Calendar, DollarSign, AlertCircle, Info } from 'lucide-react';
import { Card, Button, Input, Badge } from '../ui/index.js';

export interface MilestoneDraft {
  id: string;
  title: string;
  description: string;
  amount: string; // human-readable string (e.g. "500")
  durationDays: number;
}

interface MilestoneBuilderProps {
  milestones: MilestoneDraft[];
  currency: 'XLM' | 'USDC';
  onChange: (milestones: MilestoneDraft[]) => void;
}

export const MilestoneBuilder: React.FC<MilestoneBuilderProps> = ({
  milestones,
  currency,
  onChange,
}) => {
  const addMilestone = () => {
    const nextIdx = milestones.length + 1;
    const newMilestone: MilestoneDraft = {
      id: Math.random().toString(36).substring(2, 9),
      title: `Milestone ${nextIdx}: Deliverable Title`,
      description: '',
      amount: '500',
      durationDays: 7,
    };
    onChange([...milestones, newMilestone]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    const updated = milestones.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateMilestone = (index: number, field: keyof MilestoneDraft, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const totalAmount = milestones.reduce((sum, m) => {
    const val = parseFloat(m.amount) || 0;
    return sum + val;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Milestone Schedule & Escrow Allocation</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Break the contract into verifiable phases. Each milestone requires cryptographic deliverable submission before payment release.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total Escrow Budget</div>
          <div className="text-lg font-black text-white font-mono flex items-center gap-1 justify-end">
            <span className="text-cyan-400">{totalAmount.toLocaleString()}</span>
            <span>{currency}</span>
          </div>
        </div>
      </div>

      {/* List of Milestones */}
      <div className="space-y-4">
        {milestones.map((milestone, idx) => {
          const milestoneAmt = parseFloat(milestone.amount) || 0;
          const sharePct = totalAmount > 0 ? Math.round((milestoneAmt / totalAmount) * 100) : 0;

          return (
            <Card
              key={milestone.id}
              className="p-5 bg-surface-100/90 border-white/5 relative group"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center border border-cyan-500/30">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold text-white">Milestone #{idx + 1}</span>
                  <Badge variant="cyan" className="text-[10px] font-mono">
                    {sharePct}% of total budget
                  </Badge>
                </div>

                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(idx)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Remove Milestone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Milestone Title
                  </label>
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                    placeholder="e.g. Smart Contract Architecture & Invariant Tests"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Payout Amount ({currency})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={milestone.amount}
                      onChange={(e) => updateMilestone(idx, 'amount', e.target.value)}
                      placeholder="500"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">
                      {currency}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={milestone.durationDays}
                    onChange={(e) =>
                      updateMilestone(idx, 'durationDays', parseInt(e.target.value) || 1)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="md:col-span-12 space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Deliverable Scope & Verification Criteria
                  </label>
                  <textarea
                    rows={2}
                    value={milestone.description}
                    onChange={(e) => updateMilestone(idx, 'description', e.target.value)}
                    placeholder="Describe expected artifacts, test coverage, repository PR link, or design specs required for approval..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Milestone Button */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addMilestone}
          className="border-dashed border-cyan-500/40 text-cyan-300 hover:text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Another Milestone</span>
        </Button>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Maximum 10 milestones per Soroban contract execution</span>
        </div>
      </div>
    </div>
  );
};
