'use client';

import React from 'react';
import { Lock, Scale, Zap, Globe2 } from 'lucide-react';
import { Card } from '../ui/index.js';

export const StatBanner: React.FC = () => {
  const stats = [
    {
      icon: <Lock className="w-5 h-5 text-cyan-400" />,
      value: '3,450,000+ XLM',
      label: 'Escrow Volume Locked',
      change: '100% Non-Custodial',
    },
    {
      icon: <Scale className="w-5 h-5 text-purple-400" />,
      value: '100%',
      label: 'Dispute Invariant',
      change: 'Odd-Panel Consensus',
    },
    {
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      value: '< 4 Seconds',
      label: 'Settlement Latency',
      change: 'Soroban Sub-Second Finality',
    },
    {
      icon: <Globe2 className="w-5 h-5 text-amber-400" />,
      value: '180+ Countries',
      label: 'Fiat Cash Off-Ramps',
      change: 'M-Pesa, Cowrie, MoneyGram',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <Card key={idx} className="p-5 bg-surface-100/90 border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-surface-200/80 border border-white/5">
                {s.icon}
              </div>
              <span className="text-[11px] font-mono font-medium text-slate-400">
                {s.change}
              </span>
            </div>
            <div className="text-2xl font-black text-white tracking-tight mt-1">
              {s.value}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};
