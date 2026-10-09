'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, Zap, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Card, Button, Badge } from '../ui/index.js';

interface AutoReleaseTimerCardProps {
  milestoneIndex: number;
  submittedAt?: string;
  reviewWindowSeconds: number; // e.g. 259200 (72h)
  onTriggerAutoRelease: () => Promise<void>;
}

export const AutoReleaseTimerCard: React.FC<AutoReleaseTimerCardProps> = ({
  milestoneIndex,
  submittedAt,
  reviewWindowSeconds,
  onTriggerAutoRelease,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (!submittedAt) return reviewWindowSeconds;
    const elapsed = Math.floor((Date.now() - new Date(submittedAt).getTime()) / 1000);
    return Math.max(0, reviewWindowSeconds - elapsed);
  });
  const [isTriggering, setIsTriggering] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft === 0;

  const handleExecute = async () => {
    setIsTriggering(true);
    try {
      await onTriggerAutoRelease();
      setIsTriggering(false);
    } catch {
      setIsTriggering(false);
    }
  };

  return (
    <Card
      glow={isExpired}
      className={`p-5 transition-all ${
        isExpired
          ? 'bg-emerald-950/30 border-emerald-500/40'
          : 'bg-surface-100/90 border-cyan-500/20'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isExpired ? 'bg-emerald-400' : 'bg-cyan-400 animate-ping'
              }`}
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Anti-Ghosting Review Window
            </span>
            <Badge variant={isExpired ? 'emerald' : 'cyan'} className="text-[10px]">
              {isExpired ? 'Eligible for Auto-Release' : 'Countdown Active'}
            </Badge>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
            {isExpired
              ? 'Client silence period has expired! Anyone can execute auto_release_payout on Soroban to immediately deliver the milestone payout to the freelancer.'
              : 'Client must inspect deliverables and approve, request revision, or dispute. If client remains unresponsive past the window, payment unlocks automatically.'}
          </p>
        </div>

        {/* Countdown Displays */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 font-mono text-center">
            <div className="p-2 rounded-xl bg-surface-200/90 border border-white/10 min-w-11">
              <div className="text-base font-black text-white">{hours}</div>
              <div className="text-[9px] text-slate-400">HRS</div>
            </div>
            <span className="text-slate-500 font-bold">:</span>
            <div className="p-2 rounded-xl bg-surface-200/90 border border-white/10 min-w-11">
              <div className="text-base font-black text-white">
                {minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-[9px] text-slate-400">MIN</div>
            </div>
            <span className="text-slate-500 font-bold">:</span>
            <div className="p-2 rounded-xl bg-surface-200/90 border border-white/10 min-w-11">
              <div className="text-base font-black text-white">
                {seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-[9px] text-slate-400">SEC</div>
            </div>
          </div>

          {isExpired && (
            <Button
              variant="primary"
              size="sm"
              isLoading={isTriggering}
              onClick={handleExecute}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold ml-2 shadow-glow"
            >
              <Zap className="w-3.5 h-3.5 mr-1" />
              <span>Claim Auto-Release</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
