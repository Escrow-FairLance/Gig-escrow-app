'use client';

import React, { useState } from 'react';
import { RotateCw, Handshake, AlertOctagon, CheckCircle2, Shield } from 'lucide-react';
import { formatStroopsToXlm } from '../../config/constants';
import { Card, Button, Badge } from '../ui/index';

interface CancellationCardProps {
  escrowBalance: string;
  tokenSymbol: string;
  workTimeoutSeconds: number;
  isStalledEligible: boolean;
  isClient: boolean;
  isFreelancer: boolean;
  onMutualCancel: () => Promise<void>;
  onReclaimStalled: () => Promise<void>;
}

export const CancellationCard: React.FC<CancellationCardProps> = ({
  escrowBalance,
  tokenSymbol,
  workTimeoutSeconds,
  isStalledEligible,
  isClient,
  isFreelancer,
  onMutualCancel,
  onReclaimStalled,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMutual = async () => {
    if (!confirm('Are you sure you want to request mutual cancellation? Both parties must confirm to release remaining funds back to client without penalties.')) return;
    setIsProcessing(true);
    try {
      await onMutualCancel();
      setIsProcessing(false);
    } catch {
      setIsProcessing(false);
    }
  };

  const handleReclaim = async () => {
    if (!confirm('Reclaim stalled escrow funds? The work timeout has passed without delivery.')) return;
    setIsProcessing(true);
    try {
      await onReclaimStalled();
      setIsProcessing(false);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 bg-surface-100/70 border-white/5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-400" />
          <span>Exit Conditions & Fund Safety</span>
        </h3>
        <span className="text-xs font-mono text-slate-400">
          Remaining Escrow: <strong className="text-white">{formatStroopsToXlm(escrowBalance)} {tokenSymbol}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: Mutual Cancellation */}
        <div className="p-4 rounded-xl bg-surface-200/50 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
              <Handshake className="w-4 h-4 text-cyan-400" />
              <span>Mutual Cancellation Agreement</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              Both client and freelancer mutually agree to conclude the contract amicably. Any unreleased
              escrow balance is immediately returned to the client without incurring arbitration fees.
            </p>
          </div>

          {(isClient || isFreelancer) && (
            <Button
              variant="outline"
              size="sm"
              isLoading={isProcessing}
              onClick={handleMutual}
              className="text-xs border-white/10 hover:border-cyan-500/30"
            >
              Sign Mutual Cancellation
            </Button>
          )}
        </div>

        {/* Option 2: Reclaim Stalled Job */}
        <div className="p-4 rounded-xl bg-surface-200/50 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
              <RotateCw className="w-4 h-4 text-amber-400" />
              <span>Reclaim Abandoned / Stalled Funds</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              If the freelancer has not accepted or has not delivered work past the contract timeout
              ({Math.round(workTimeoutSeconds / 86400)} days), the client can invoke unilateral fund reclaim.
            </p>
          </div>

          {isClient && (
            <Button
              variant={isStalledEligible ? 'danger' : 'outline'}
              size="sm"
              disabled={!isStalledEligible}
              isLoading={isProcessing}
              onClick={handleReclaim}
              className="text-xs"
            >
              {isStalledEligible ? 'Reclaim Stalled Escrow Now' : 'Timeout Not Yet Reached'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
