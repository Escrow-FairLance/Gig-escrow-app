'use client';

import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Star,
  Coins,
  Sparkles,
} from 'lucide-react';
import { ArbitratorCandidateView } from '../../types/escrow.js';
import { formatAddress, formatStroopsToXlm } from '../../config/constants.js';
import { Card, Badge, Button } from '../ui/index.js';

interface ArbitratorSelectorProps {
  panelSize: 1 | 3 | 5 | 7;
  onPanelSizeChange: (size: 1 | 3 | 5 | 7) => void;
  selectedArbitrators: string[];
  onSelectArbitrator: (addresses: string[]) => void;
  clientAddress?: string;
  freelancerAddress?: string;
}

// Sample registered testnet arbitrators
const registeredJurors: ArbitratorCandidateView[] = [
  {
    address: 'GDC7W8KMQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWAA',
    displayName: 'Amina Bello (Smart Contracts Juror)',
    skills: ['Soroban Rust', 'Security Audit', 'Escrow Accounting'],
    languages: ['EN', 'HA', 'FR'],
    feeBps: 250, // 2.5%
    reputationScore: 99.2,
    stakedAmount: '15000000000', // 1,500 XLM
    activeCasesCount: 1,
    totalCasesVoted: 48,
  },
  {
    address: 'GCK45NMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWBB',
    displayName: 'Kwame Mensah (DeFi & Financial Law)',
    skills: ['Stellar Rails', 'Tokenomics', 'Contract Law'],
    languages: ['EN', 'FR'],
    feeBps: 300, // 3%
    reputationScore: 98.7,
    stakedAmount: '20000000000', // 2,000 XLM
    activeCasesCount: 2,
    totalCasesVoted: 62,
  },
  {
    address: 'GBR12VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWCC',
    displayName: 'Dr. Chidi Okonkwo (System Architecture)',
    skills: ['Distributed Systems', 'Cryptography', 'Next.js'],
    languages: ['EN', 'YO'],
    feeBps: 200, // 2%
    reputationScore: 100.0,
    stakedAmount: '35000000000', // 3,500 XLM
    activeCasesCount: 0,
    totalCasesVoted: 89,
  },
  {
    address: 'GDX88VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWDD',
    displayName: 'Fatima Zahra (UI/UX & Product Design)',
    skills: ['Figma Audits', 'Frontend QA', 'Product Deliverables'],
    languages: ['EN', 'FR', 'AR'],
    feeBps: 250,
    reputationScore: 97.9,
    stakedAmount: '10000000000',
    activeCasesCount: 1,
    totalCasesVoted: 34,
  },
  {
    address: 'GB999VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWEE',
    displayName: 'Mwangi Kamau (Full Stack & APIs)',
    skills: ['Node.js', 'PostgreSQL', 'SEP-24 Protocols'],
    languages: ['EN', 'SW'],
    feeBps: 250,
    reputationScore: 98.4,
    stakedAmount: '12000000000',
    activeCasesCount: 0,
    totalCasesVoted: 41,
  },
  {
    address: 'GB777VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWFF',
    displayName: 'Sipho Ndlovu (Protocol Security)',
    skills: ['Pen Testing', 'Formal Verification', 'Zero Knowledge'],
    languages: ['EN'],
    feeBps: 350,
    reputationScore: 99.5,
    stakedAmount: '25000000000',
    activeCasesCount: 1,
    totalCasesVoted: 77,
  },
  {
    address: 'GCL55VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWGG',
    displayName: 'Zainab Touré (Regulatory & Compliance)',
    skills: ['Cross-Border AML', 'Fiat Settlement', 'Arbitration'],
    languages: ['FR', 'EN'],
    feeBps: 300,
    reputationScore: 98.0,
    stakedAmount: '18000000000',
    activeCasesCount: 1,
    totalCasesVoted: 53,
  },
];

export const ArbitratorSelector: React.FC<ArbitratorSelectorProps> = ({
  panelSize,
  onPanelSizeChange,
  selectedArbitrators,
  onSelectArbitrator,
  clientAddress,
  freelancerAddress,
}) => {
  const toggleArbitrator = (address: string) => {
    // Conflict of interest check
    if (address === clientAddress) {
      alert('Conflict of interest: Client cannot be assigned as arbitrator!');
      return;
    }
    if (address === freelancerAddress) {
      alert('Conflict of interest: Freelancer cannot be assigned as arbitrator!');
      return;
    }

    if (selectedArbitrators.includes(address)) {
      onSelectArbitrator(selectedArbitrators.filter((a) => a !== address));
    } else {
      if (selectedArbitrators.length >= panelSize) {
        // Replace last one or reject
        const sliced = selectedArbitrators.slice(0, panelSize - 1);
        onSelectArbitrator([...sliced, address]);
      } else {
        onSelectArbitrator([...selectedArbitrators, address]);
      }
    }
  };

  const autoSelectTopRated = () => {
    const eligible = registeredJurors.filter(
      (j) => j.address !== clientAddress && j.address !== freelancerAddress
    );
    const top = eligible.slice(0, panelSize).map((j) => j.address);
    onSelectArbitrator(top);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Decentralized Arbitrator Panel Selection</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Designate an odd-sized panel (1, 3, 5, or 7) to adjudicate disputes deterministically on Soroban.
          </p>
        </div>

        {/* Odd Panel Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-200/80 border border-white/10 self-start sm:self-auto">
          {([1, 3, 5, 7] as const).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                onPanelSizeChange(size);
                if (selectedArbitrators.length > size) {
                  onSelectArbitrator(selectedArbitrators.slice(0, size));
                }
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                panelSize === size
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {size} {size === 1 ? 'Juror' : 'Jurors'}
            </button>
          ))}
        </div>
      </div>

      {/* Auto Select & Status bar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-100 border border-white/5 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            Selected:{' '}
            <strong className="text-white font-mono">
              {selectedArbitrators.length} of {panelSize}
            </strong>{' '}
            jurors
          </span>
          {selectedArbitrators.length === panelSize ? (
            <Badge variant="emerald" className="text-[10px]">
              Ready
            </Badge>
          ) : (
            <Badge variant="amber" className="text-[10px]">
              Select {panelSize - selectedArbitrators.length} more
            </Badge>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={autoSelectTopRated}
          className="text-xs border-amber-500/30 text-amber-300 hover:text-white"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
          <span>Auto-Select Top {panelSize}</span>
        </Button>
      </div>

      {/* Juror Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registeredJurors.map((juror) => {
          const isSelected = selectedArbitrators.includes(juror.address);
          const isConflict =
            juror.address === clientAddress || juror.address === freelancerAddress;

          return (
            <Card
              key={juror.address}
              onClick={() => !isConflict && toggleArbitrator(juror.address)}
              className={`p-4 transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-glow'
                  : isConflict
                  ? 'opacity-40 cursor-not-allowed bg-surface-100/50'
                  : 'bg-surface-100/80 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-surface-200 text-slate-400'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {juror.displayName}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      {formatAddress(juror.address, 4)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{juror.reputationScore}%</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
              </div>

              {/* Skills and languages */}
              <div className="flex flex-wrap gap-1.5 my-2.5">
                {juror.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded bg-surface-200 text-[10px] text-slate-300 font-medium border border-white/5"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Staking & cases stats */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <Coins className="w-3 h-3 text-cyan-400" />
                  <span>Stake: {formatStroopsToXlm(juror.stakedAmount)} XLM</span>
                </div>
                <div>
                  Fee: <strong className="text-white">{juror.feeBps / 100}%</strong> | Voted:{' '}
                  <strong className="text-white">{juror.totalCasesVoted}</strong>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
