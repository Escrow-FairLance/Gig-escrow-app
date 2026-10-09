'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Code, ArrowRight, ShieldCheck, Coins, Layers } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui/index.js';

export default function DashboardPortalPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="cyan" className="mb-3">
          FairLance Protocol Dashboard
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Select Your Workspace
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Manage your posted escrow contracts or monitor your active milestone tasks and payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Client Workspace Card */}
        <Card
          hoverEffect
          className="p-8 bg-surface-100/90 border-cyan-500/20 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 text-cyan-400 shadow-glow">
              <Briefcase className="w-6 h-6" />
            </div>
            <Badge variant="cyan" className="mb-3 text-[10px]">
              Client & Company Workspace
            </Badge>
            <h2 className="text-xl font-bold text-white mb-2">Client Dashboard</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Review delivered milestone file hashes, sign off on instant smart contract payouts,
              request revisions, or open disputes with odd-sized arbitration panels.
            </p>
          </div>

          <Link href="/dashboard/client">
            <Button variant="primary" className="w-full gap-2">
              <span>Go to Client Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>

        {/* Freelancer Workspace Card */}
        <Card
          hoverEffect
          className="p-8 bg-surface-100/90 border-purple-500/20 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 text-purple-400 shadow-glow">
              <Code className="w-6 h-6" />
            </div>
            <Badge variant="purple" className="mb-3 text-[10px]">
              Freelancer & Engineer Workspace
            </Badge>
            <h2 className="text-xl font-bold text-white mb-2">Freelancer Dashboard</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Submit cryptographic deliverable hashes, monitor anti-ghosting review countdowns,
              trigger auto-releases, and cash out earnings via SEP-24 anchor rails.
            </p>
          </div>

          <Link href="/dashboard/freelancer">
            <Button variant="secondary" className="w-full gap-2 border-purple-500/30 text-purple-300 hover:text-white">
              <span>Go to Freelancer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
