'use client';

import React from 'react';
import {
  ShieldCheck,
  Clock,
  Scale,
  Lock,
  Layers,
  Banknote,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useI18n } from '../../i18n/context.js';
import { Card, Badge } from '../ui/index.js';

export const Features: React.FC = () => {
  const { t } = useI18n();

  const featureList = [
    {
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      title: t('feat.milestonesTitle'),
      desc: t('feat.milestonesDesc'),
      badge: 'Non-Custodial',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      title: t('feat.revisionsTitle'),
      desc: t('feat.revisionsDesc'),
      badge: 'Enforced On-Chain',
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-400" />,
      title: t('feat.autoReleaseTitle'),
      desc: t('feat.autoReleaseDesc'),
      badge: 'Anti-Ghosting',
    },
    {
      icon: <Scale className="w-6 h-6 text-amber-400" />,
      title: t('feat.arbitrationTitle'),
      desc: t('feat.arbitrationDesc'),
      badge: 'Odd 1–7 Members',
    },
    {
      icon: <Lock className="w-6 h-6 text-rose-400" />,
      title: 'AES-256-GCM File Encryption',
      desc: 'Deliverables and dispute evidence are encrypted at rest with cryptographic authentication tags preventing tampering.',
      badge: 'Confidentiality',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-blue-400" />,
      title: 'Stalled Job Reclamation',
      desc: 'If a freelancer defaults or abandons a milestone past the work timeout, clients can safely reclaim unreleased funds.',
      badge: 'Client Protection',
    },
    {
      icon: <Banknote className="w-6 h-6 text-emerald-400" />,
      title: t('feat.fiatTitle'),
      desc: t('feat.fiatDesc'),
      badge: 'SEP-24 Rails',
    },
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: 'Lossless Integer Math',
      desc: 'All accounting in Soroban uses 128-bit integers and basis points (0–10,000) with zero precision loss or rounding dust.',
      badge: 'Invariant Guard',
    },
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="purple" className="mb-3">
            Soroban Escrow Mechanics
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('feat.title')}
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            {t('feat.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((f, i) => (
            <Card
              key={i}
              hoverEffect
              className="p-6 bg-surface-100/70 border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-surface-200/80 border border-white/5 shadow-inner">
                    {f.icon}
                  </div>
                  <Badge variant="cyan" className="text-[10px]">
                    {f.badge}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
