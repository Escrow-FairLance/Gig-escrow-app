'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Briefcase, Sparkles, AlertCircle } from 'lucide-react';
import { JobView } from '../../types/escrow.js';
import { JobFilter, FilterState } from '../../components/jobs/JobFilter.js';
import { JobCard } from '../../components/jobs/JobCard.js';
import { Button, Badge } from '../../components/ui/index.js';

// Realistic sample jobs on Soroban Testnet
const initialMockJobs: JobView[] = [
  {
    id: 'job-9841-soroban-escrow',
    clientAddress: 'GAAX7KL5JWMQPZTY7XG276QWNR25K4ZTYPQQV9J3KMTRL67WZX',
    freelancerAddress: 'GB3Y9KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWYZ',
    tokenAddress: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    totalAmount: '45000000000', // 4,500 XLM
    escrowBalance: '30000000000', // 3,000 XLM remaining
    status: 'ACTIVE',
    currentMilestoneIndex: 1,
    milestoneCount: 3,
    termsHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    arbitratorFeeBps: 300, // 3%
    reviewWindowSeconds: '259200', // 72 hours
    workTimeoutSeconds: '1209600', // 14 days
    disputeWindowSeconds: '604800', // 7 days
    arbitratorPanel: [
      'GDC7W8KMQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWAA',
      'GCK45NMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWBB',
      'GBR12VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWCC',
    ],
    milestones: [
      {
        id: 'm1',
        index: 0,
        title: 'Soroban Escrow Smart Contract v1 & Invariant Tests',
        amount: '15000000000',
        deadline: '2026-10-15',
        status: 'APPROVED',
        revisionCount: 0,
        deliverableHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      },
      {
        id: 'm2',
        index: 1,
        title: 'Client-Side Deliverable Hasher & Freighter Kit Integration',
        amount: '15000000000',
        deadline: '2026-10-24',
        status: 'SUBMITTED',
        revisionCount: 1,
        deliverableHash: 'cb8379ac2098aa165029e3938a51da0bcecfc008fd6795f401178647f96c5b34',
      },
      {
        id: 'm3',
        index: 2,
        title: 'End-to-End Testnet Verification & Security Audit Report',
        amount: '15000000000',
        deadline: '2026-11-05',
        status: 'PENDING',
        revisionCount: 0,
      },
    ],
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-07T14:30:00Z',
  },
  {
    id: 'job-1042-fiat-anchor-rails',
    clientAddress: 'GDT45PM89XZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWDD',
    freelancerAddress: '',
    tokenAddress: 'CCW67KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWEE', // USDC
    totalAmount: '22000000000', // 2,200 USDC
    escrowBalance: '22000000000',
    status: 'CREATED',
    currentMilestoneIndex: 0,
    milestoneCount: 2,
    termsHash: '9f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9070',
    arbitratorFeeBps: 250,
    reviewWindowSeconds: '172800', // 48 hours
    workTimeoutSeconds: '604800', // 7 days
    disputeWindowSeconds: '432000', // 5 days
    arbitratorPanel: [
      'GDC7W8KMQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWAA',
      'GCK45NMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWBB',
      'GBR12VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWCC',
    ],
    milestones: [
      {
        id: 'm1',
        index: 0,
        title: 'SEP-24 Interactive Off-Ramp Flow for Cowrie & M-Pesa',
        amount: '11000000000',
        deadline: '2026-10-20',
        status: 'PENDING',
        revisionCount: 0,
      },
      {
        id: 'm2',
        index: 1,
        title: 'KYC Webview Modal & Transaction Polling Service',
        amount: '11000000000',
        deadline: '2026-10-30',
        status: 'PENDING',
        revisionCount: 0,
      },
    ],
    createdAt: '2026-10-04T12:00:00Z',
    updatedAt: '2026-10-04T12:00:00Z',
  },
  {
    id: 'job-5520-fullstack-defi-ui',
    clientAddress: 'GCP89KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWFF',
    freelancerAddress: 'GDX12KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWGG',
    tokenAddress: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    totalAmount: '60000000000', // 6,000 XLM
    escrowBalance: '20000000000',
    status: 'DISPUTED',
    currentMilestoneIndex: 2,
    milestoneCount: 3,
    termsHash: 'aa79b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9071',
    arbitratorFeeBps: 400,
    reviewWindowSeconds: '259200',
    workTimeoutSeconds: '1814400',
    disputeWindowSeconds: '604800',
    arbitratorPanel: [
      'GDC7W8KMQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWAA',
      'GCK45NMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWBB',
      'GBR12VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWCC',
      'GDX88VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWDD',
      'GB999VMXQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWEE',
    ],
    milestones: [
      {
        id: 'm1',
        index: 0,
        title: 'Design System & Glassmorphic UI Primitives',
        amount: '20000000000',
        deadline: '2026-09-20',
        status: 'APPROVED',
        revisionCount: 1,
        deliverableHash: '1234b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9072',
      },
      {
        id: 'm2',
        index: 1,
        title: 'Wallet Context & Soroban Invocation SDK',
        amount: '20000000000',
        deadline: '2026-10-01',
        status: 'APPROVED',
        revisionCount: 0,
        deliverableHash: '5678b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9073',
      },
      {
        id: 'm3',
        index: 2,
        title: 'Production Deployment & Sub-Second Indexing Pipeline',
        amount: '20000000000',
        deadline: '2026-10-08',
        status: 'DISPUTED',
        revisionCount: 2,
        deliverableHash: '9900b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9074',
      },
    ],
    createdAt: '2026-09-10T11:00:00Z',
    updatedAt: '2026-10-08T09:00:00Z',
  },
  {
    id: 'job-7731-rust-contract-audit',
    clientAddress: 'GBB11KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWHH',
    freelancerAddress: 'GCC22KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWII',
    tokenAddress: 'CCW67KM5NPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWEE', // USDC
    totalAmount: '35000000000', // 3,500 USDC
    escrowBalance: '0',
    status: 'COMPLETED',
    currentMilestoneIndex: 2,
    milestoneCount: 2,
    termsHash: 'bb88b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9075',
    arbitratorFeeBps: 200,
    reviewWindowSeconds: '172800',
    workTimeoutSeconds: '604800',
    disputeWindowSeconds: '432000',
    arbitratorPanel: [
      'GDC7W8KMQZPXZTR12VWQ56PZTRK88LMN456QAZTYKMPQRSTVWAA',
    ],
    milestones: [
      {
        id: 'm1',
        index: 0,
        title: 'Static Analysis & Symbolic Execution Run',
        amount: '17500000000',
        deadline: '2026-09-15',
        status: 'APPROVED',
        revisionCount: 0,
        deliverableHash: '3344b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9076',
      },
      {
        id: 'm2',
        index: 1,
        title: 'Final Audit Report with Remediations Verified',
        amount: '17500000000',
        deadline: '2026-09-28',
        status: 'APPROVED',
        revisionCount: 0,
        deliverableHash: '5566b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9077',
      },
    ],
    createdAt: '2026-09-01T15:00:00Z',
    updatedAt: '2026-09-28T18:00:00Z',
  },
];

export default function JobsPage() {
  const [jobs] = useState<JobView[]>(initialMockJobs);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    status: '',
    currency: '',
    sortBy: 'newest',
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search text match
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchTitle = job.id.toLowerCase().includes(q);
        const matchClient = job.clientAddress.toLowerCase().includes(q);
        const matchMilestone = job.milestones.some((m) =>
          m.title.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchClient && !matchMilestone) return false;
      }

      // Status match
      if (filters.status && job.status !== filters.status) {
        return false;
      }

      // Currency match
      if (filters.currency) {
        const isXlm =
          !job.tokenAddress ||
          job.tokenAddress.toLowerCase().includes('native') ||
          job.tokenAddress.startsWith('CDLZ');
        if (filters.currency === 'XLM' && !isXlm) return false;
        if (filters.currency === 'USDC' && isXlm) return false;
      }

      return true;
    });
  }, [jobs, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan">Explore Jobs</Badge>
            <Badge variant="emerald" dot>
              Stellar Testnet Live
            </Badge>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Decentralized Freelance Marketplace
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse jobs with 100% upfront escrow backing and immutable Soroban milestone protection.
          </p>
        </div>

        <Link href="/jobs/new">
          <Button variant="primary" className="shadow-glow whitespace-nowrap">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Post a Job & Fund Escrow</span>
          </Button>
        </Link>
      </div>

      {/* Filter Component */}
      <JobFilter
        filters={filters}
        onChange={setFilters}
        totalJobs={filteredJobs.length}
      />

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-100/50 rounded-2xl border border-white/5 p-8">
          <div className="w-12 h-12 rounded-2xl bg-surface-200 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-white/10">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Jobs Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            No active escrow contracts match your query. Try clearing your search or category filters.
          </p>
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                search: '',
                category: '',
                status: '',
                currency: '',
                sortBy: 'newest',
              })
            }
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
