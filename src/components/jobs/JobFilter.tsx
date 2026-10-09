'use client';

import React from 'react';
import { Search, SlidersHorizontal, Sparkles, Filter } from 'lucide-react';
import { Badge } from '../ui/index.js';

export interface FilterState {
  search: string;
  category: string;
  status: string;
  currency: string;
  sortBy: string;
}

interface JobFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalJobs: number;
}

export const CATEGORIES = [
  'All Categories',
  'Soroban & Rust',
  'Frontend & Web3',
  'Security & Audit',
  'Backend & APIs',
  'DeFi Architecture',
  'Mobile & Flutter',
  'Design & Branding',
];

export const JobFilter: React.FC<JobFilterProps> = ({ filters, onChange, totalJobs }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleCategoryClick = (cat: string) => {
    onChange({ ...filters, category: cat === 'All Categories' ? '' : cat });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, status: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value });
  };

  const handleCurrencyChange = (curr: string) => {
    onChange({ ...filters, currency: curr === filters.currency ? '' : curr });
  };

  return (
    <div className="w-full space-y-4 bg-surface-100/70 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search verified jobs by title, keyword, or tech stack..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200/80 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Currency Toggles */}
          <div className="flex items-center p-1 rounded-xl bg-surface-200/80 border border-white/10 text-xs">
            <button
              onClick={() => handleCurrencyChange('')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !filters.currency
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => handleCurrencyChange('XLM')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filters.currency === 'XLM'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              XLM
            </button>
            <button
              onClick={() => handleCurrencyChange('USDC')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filters.currency === 'USDC'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              USDC
            </button>
          </div>

          {/* Status Dropdown */}
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="px-3 py-2 rounded-xl bg-surface-200/80 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="CREATED">Open for Applications</option>
            <option value="ACTIVE">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="DISPUTED">In Arbitration</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="px-3 py-2 rounded-xl bg-surface-200/80 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="budget_desc">Highest Budget</option>
            <option value="budget_asc">Lowest Budget</option>
            <option value="milestones">Most Milestones</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
        {CATEGORIES.map((cat) => {
          const isSelected =
            (cat === 'All Categories' && !filters.category) || filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold shadow-glow'
                  : 'bg-surface-200/50 text-slate-400 border-white/5 hover:text-white hover:border-white/15'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Summary Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            Showing <strong className="text-white font-mono">{totalJobs}</strong> verified freelance escrow jobs
          </span>
        </div>
        <Badge variant="cyan" className="text-[10px]">
          100% Upfront Funded
        </Badge>
      </div>
    </div>
  );
};
