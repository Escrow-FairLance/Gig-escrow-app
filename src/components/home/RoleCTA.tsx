'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Code, Scale, ArrowRight, ShieldCheck, Zap, Coins } from 'lucide-react';
import { Card, Button, Badge } from '../ui/index';

export const RoleCTA: React.FC = () => {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="purple" className="mb-3">
            Choose Your Role
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Build the Future of Work?
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Non-custodial milestone escrows for builders, clients, and decentralized jurors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Client */}
          <Card
            hoverEffect
            className="p-8 bg-gradient-to-b from-surface-100/90 to-surface-200/90 border-cyan-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 text-cyan-400 shadow-glow">
                <Briefcase className="w-6 h-6" />
              </div>
              <Badge variant="cyan" className="mb-3 text-[10px]">
                Clients & Companies
              </Badge>
              <h3 className="text-xl font-bold text-white mb-2">Hire with 100% Protection</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Split complex projects into verifiable milestones. Funds only release when you inspect
                cryptographic delivery hashes and approve, or auto-reclaim if deadlines are missed.
              </p>

              <ul className="space-y-2.5 mb-8 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Deposit locked safely in Soroban escrow</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Up to 2 revision requests per milestone</span>
                </li>
                <li className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Reclaim unreleased funds on timeout</span>
                </li>
              </ul>
            </div>

            <Link href="/jobs/new" className="w-full">
              <Button variant="primary" className="w-full group">
                <span>Post a Job & Fund Escrow</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          {/* Card 2: Freelancer */}
          <Card
            hoverEffect
            className="p-8 bg-gradient-to-b from-surface-100/90 to-surface-200/90 border-purple-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 text-purple-400 shadow-glow">
                <Code className="w-6 h-6" />
              </div>
              <Badge variant="purple" className="mb-3 text-[10px]">
                Freelancers & Engineers
              </Badge>
              <h3 className="text-xl font-bold text-white mb-2">Never Get Ghosted Again</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Work with guaranteed escrow backing. If a client is unresponsive after your milestone
                submission window, automatically trigger payment release on-chain.
              </p>

              <ul className="space-y-2.5 mb-8 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Funds deposited upfront before you start</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Anti-ghosting auto-release timer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Instant off-ramp to local currency via SEP-24</span>
                </li>
              </ul>
            </div>

            <Link href="/jobs" className="w-full">
              <Button variant="secondary" className="w-full group border-purple-500/30 text-purple-300 hover:text-white">
                <span>Browse Verified Jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          {/* Card 3: Arbitrator */}
          <Card
            hoverEffect
            className="p-8 bg-gradient-to-b from-surface-100/90 to-surface-200/90 border-amber-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400 shadow-glow">
                <Scale className="w-6 h-6" />
              </div>
              <Badge variant="amber" className="mb-3 text-[10px]">
                Jurors & Arbitrators
              </Badge>
              <h3 className="text-xl font-bold text-white mb-2">Stake & Resolve Disputes</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Join decentralized panels of 1, 3, 5, or 7 jurors. Stake XLM, review cryptographic
                evidence, vote objectively, and earn platform arbitration fees.
              </p>

              <ul className="space-y-2.5 mb-8 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Earn arbitration fees on every resolved dispute</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Fair split ruling options (basis points math)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Strict conflict-of-interest prevention</span>
                </li>
              </ul>
            </div>

            <Link href="/arbitration" className="w-full">
              <Button variant="outline" className="w-full group border-amber-500/30 text-amber-300 hover:text-white">
                <span>Join Arbitrator Panel</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
};
