'use client';

import React from 'react';
import { Coins, ExternalLink, Zap } from 'lucide-react';
import { STELLAR_CONFIG, formatAddress } from '../../config/constants';

export const NetworkBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-cyan-950/60 via-surface-100/80 to-purple-950/60 border-b border-cyan-500/20 py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2 text-cyan-200">
          <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
          <span>
            Connected to <strong>Stellar Testnet</strong> | Contract:{' '}
            <span className="font-mono text-cyan-300">
              {formatAddress(STELLAR_CONFIG.escrowContractId, 5)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://laboratory.stellar.org/#account-creator?network=testnet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
          >
            <Coins className="w-3 h-3 text-cyan-400" />
            <span>Friendbot Faucet (Get 10,000 XLM)</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
