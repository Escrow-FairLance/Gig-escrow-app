'use client';

import React from 'react';
import Link from 'next/link';
import {
  Lock,
  Layers,
  Clock,
  Scale,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { JobView } from '../../types/escrow';
import { formatAddress, formatStroopsToXlm } from '../../config/constants';
import { Card, Badge, Button } from '../ui/index';

interface JobCardProps {
  job: JobView;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const getStatusBadge = () => {
    switch (job.status) {
      case 'CREATED':
        return (
          <Badge variant="cyan" dot>
            Open for Acceptance
          </Badge>
        );
      case 'ACTIVE':
        return (
          <Badge variant="purple" dot>
            In Progress
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="emerald" dot>
            Completed & Settled
          </Badge>
        );
      case 'DISPUTED':
        return (
          <Badge variant="amber" dot>
            In Arbitration
          </Badge>
        );
      case 'CANCELLED':
      case 'DECLINED':
      case 'STALLED_RECLAIMED':
        return <Badge variant="rose">Closed / Reclaimed</Badge>;
      default:
        return <Badge variant="slate">{job.status}</Badge>;
    }
  };

  const completedMilestones = job.milestones.filter((m) => m.status === 'APPROVED').length;
  const progressPercent =
    job.milestones.length > 0 ? (completedMilestones / job.milestones.length) * 100 : 0;

  const isXlm = !job.tokenAddress || job.tokenAddress.toLowerCase().includes('native') || job.tokenAddress.startsWith('C');
  const currencySymbol = isXlm ? 'XLM' : 'USDC';
  const displayAmount = formatStroopsToXlm(job.totalAmount);

  return (
    <Card
      hoverEffect
      className="p-6 bg-surface-100/80 border-white/5 flex flex-col justify-between group transition-all duration-300"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {getStatusBadge()}
            <Badge variant="slate" className="font-mono text-[10px]">
              ID: {job.id.slice(0, 8)}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-white tracking-tight flex items-center justify-end gap-1">
              <span className="text-cyan-400">{displayAmount}</span>
              <span className="text-xs text-slate-400 font-mono">{currencySymbol}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Escrow: {formatStroopsToXlm(job.escrowBalance)} {currencySymbol}
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <Link href={`/jobs/${job.id}`}>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
            Job #{job.id.slice(0, 6)}: Full-Stack Freelance Milestone Escrow
          </h3>
        </Link>

        {/* Client Address & Network Metadata */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Client:</span>
            <span className="font-mono text-slate-300 hover:text-white transition-colors">
              {formatAddress(job.clientAddress, 4)}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {Math.round(parseInt(job.workTimeoutSeconds || '604800') / 86400)}d timeout
            </span>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1.5 mb-5 p-3 rounded-xl bg-surface-200/50 border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Milestone Progress: <strong>{completedMilestones}</strong> of{' '}
                <strong>{job.milestones.length}</strong>
              </span>
            </div>
            <span className="font-mono text-cyan-400 font-bold text-[11px]">
              {Math.round(progressPercent)}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-surface-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Pill Badges & View CTA */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            title="Arbitrator Panel Size"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-surface-200 text-[10px] font-mono text-amber-300 border border-amber-500/20"
          >
            <Scale className="w-3 h-3 text-amber-400" />
            <span>{job.arbitratorPanel.length} Jurors</span>
          </div>

          <div
            title="Anti-Ghosting Review Window"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-surface-200 text-[10px] font-mono text-cyan-300 border border-cyan-500/20"
          >
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{Math.round(parseInt(job.reviewWindowSeconds || '259200') / 3600)}h Review</span>
          </div>
        </div>

        <Link href={`/jobs/${job.id}`}>
          <Button size="sm" variant="glow" className="text-xs group-hover:bg-cyan-500/25">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
