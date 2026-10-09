'use client';

import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, CheckCircle2, Scale, Lock, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/index';

interface TickerItem {
  id: string;
  type: 'deposit' | 'release' | 'dispute' | 'submit';
  message: string;
  amount: string;
  txHash: string;
  timeAgo: string;
}

const mockActivities: TickerItem[] = [
  {
    id: '1',
    type: 'deposit',
    message: 'Job #84 "Rust Soroban Oracle Bridge" funded into escrow',
    amount: '3,200 USDC',
    txHash: '0x9d4e...a21f',
    timeAgo: '2m ago',
  },
  {
    id: '2',
    type: 'release',
    message: 'Milestone 2 instant payout approved by client',
    amount: '850 XLM',
    txHash: '0x3c71...884d',
    timeAgo: '5m ago',
  },
  {
    id: '3',
    type: 'dispute',
    message: 'Dispute #19 resolved by 5-member panel (75/25 Split)',
    amount: '1,400 USDC',
    txHash: '0xee92...11b4',
    timeAgo: '12m ago',
  },
  {
    id: '4',
    type: 'submit',
    message: 'Deliverable SHA-256 hash verified on-chain (M3 Deliverable)',
    amount: 'Hash: 4f1a...99c2',
    txHash: '0x55d0...a991',
    timeAgo: '18m ago',
  },
  {
    id: '5',
    type: 'release',
    message: 'Anti-ghosting auto-release executed after 72h client silence',
    amount: '1,100 USDC',
    txHash: '0xab42...f08e',
    timeAgo: '26m ago',
  },
];

export const LiveActivityTicker: React.FC = () => {
  const [items] = useState<TickerItem[]>(mockActivities);

  return (
    <div className="w-full bg-surface-100/60 border-y border-white/5 py-3 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Live Soroban Activity
          </span>
        </div>

        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-xs text-slate-300">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 shrink-0">
              {item.type === 'deposit' && <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              {item.type === 'release' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              {item.type === 'dispute' && <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              {item.type === 'submit' && <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />}

              <span>{item.message}</span>
              <Badge variant="cyan" className="text-[10px] py-0 px-1.5 font-mono">
                {item.amount}
              </Badge>
              <span className="text-[10px] text-slate-400 font-mono">{item.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
