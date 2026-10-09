'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, FileCheck, Landmark } from 'lucide-react';
import { useI18n } from '../../i18n/context';
import { Button, Card, Badge } from '../ui/index';

export const Hero: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="relative pt-20 pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-cyan-500/20 via-purple-600/10 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-6 shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Trustless Freelancer{' '}
            <span className="gradient-text">Escrow on Stellar</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/jobs/create">
              <Button size="lg" variant="primary" className="shadow-glow">
                <span>{t('hero.ctaClient')}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="secondary">
                <span>{t('hero.ctaFreelancer')}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Animated Escrow State Pipeline Visualizer */}
        <div className="mt-16 max-w-5xl mx-auto">
          <Card glow className="p-6 sm:p-8 bg-surface-100/80 border-cyan-500/30">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  Live Soroban Escrow State Protocol
                </span>
              </div>
              <Badge variant="emerald" dot>
                Milestone Invariant Verified
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-surface-200/60 border border-white/5 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Step 1</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-bold text-white text-sm mb-1">Fund Milestones</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Client locks 100% of agreed budget into Soroban contract upfront.
                </p>
                <div className="mt-3 px-2 py-1 rounded bg-black/40 text-[10px] font-mono text-cyan-300 border border-white/5">
                  Deposit: 1,500 XLM
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-surface-200/60 border border-white/5 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Step 2</span>
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="font-bold text-white text-sm mb-1">Deliverable Hash</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Freelancer uploads work; browser computes immutable SHA-256 checksum.
                </p>
                <div className="mt-3 px-2 py-1 rounded bg-black/40 text-[10px] font-mono text-slate-400 truncate border border-white/5">
                  hash: 9e3b4e3f...8a2b
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-surface-200/60 border border-white/5 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">Step 3</span>
                  <Badge variant="amber" className="text-[9px] px-1.5 py-0.5">
                    ≤ 2 Revisions
                  </Badge>
                </div>
                <div className="font-bold text-white text-sm mb-1">Review & Sign-Off</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instant approval, max 2 revisions, or auto-releases if client is silent.
                </p>
                <div className="mt-3 px-2 py-1 rounded bg-black/40 text-[10px] font-mono text-amber-300 border border-white/5">
                  Review: 72h window
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/50 to-surface-200/80 border border-cyan-500/30 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Step 4</span>
                  <Landmark className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="font-bold text-white text-sm mb-1">Local Fiat Payout</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instant cash-out to M-Pesa, Nigerian bank account, or MoneyGram cash.
                </p>
                <div className="mt-3 px-2 py-1 rounded bg-cyan-950/80 text-[10px] font-mono text-emerald-400 border border-cyan-800/60">
                  Payout: M-Pesa / NGN
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
