'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Sparkles, Shield, Heart } from 'lucide-react';
import { STELLAR_CONFIG, formatAddress } from '../../config/constants.js';
import { getExplorerContractUrl } from '../../contracts/tokens.js';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-surface-50/50 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-glow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-white text-base">
                Escrow-<span className="text-cyan-400">FairLance</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decentralized escrow protocol for cross-border freelancers powered by Stellar & Soroban smart contracts.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Stellar Testnet Live
            </div>
          </div>

          {/* Col 2: Smart Contract Details */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              On-Chain Contract
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <div className="text-slate-400">Escrow Contract:</div>
                <a
                  href={getExplorerContractUrl(STELLAR_CONFIG.escrowContractId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  {formatAddress(STELLAR_CONFIG.escrowContractId, 6)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <div className="text-slate-400">Native SAC Asset:</div>
                <a
                  href={getExplorerContractUrl(STELLAR_CONFIG.nativeTokenId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  {formatAddress(STELLAR_CONFIG.nativeTokenId, 6)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Fiat Off-Ramp Rails */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              African & Global Rails
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <span className="text-white font-medium">Cowrie Exchange:</span> Nigeria (NGN / Bank Transfer)
              </li>
              <li>
                <span className="text-white font-medium">ClickPesa:</span> Kenya (KES / M-Pesa & Airtel)
              </li>
              <li>
                <span className="text-white font-medium">Yellow Card:</span> Pan-African Mobile Money
              </li>
              <li>
                <span className="text-white font-medium">MoneyGram:</span> Cash In-Hand (180+ Countries)
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Rules */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Guaranteed Protections
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                Strict 2-revision limit rule
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                Silence auto-release timer
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                1-7 odd-sized arbitrator panel
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                Proportional dispute settlement
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Escrow-FairLance Protocol. Built with Soroban SDK v22.0.8.</p>
          <div className="flex items-center gap-1">
            Designed for African & International Web3 Freelancers
          </div>
        </div>
      </div>
    </footer>
  );
};
