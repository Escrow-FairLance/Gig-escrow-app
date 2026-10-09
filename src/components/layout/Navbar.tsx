'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe,
  Wallet,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useWallet } from '../../wallet/context';
import { useI18n, LANGUAGES, SupportedLanguage } from '../../i18n/context';
import { formatAddress, formatStroopsToXlm } from '../../config/constants';
import { ConnectWalletModal } from '../wallet/ConnectWalletModal';
import { Badge, Button } from '../ui/index';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { state: wallet, disconnect } = useWallet();
  const { language, setLanguage, t } = useI18n();
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [isLangMenuOpen, setLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/jobs', label: t('nav.jobs') },
    { href: '/jobs/create', label: t('nav.createJob') },
    { href: '/dashboard', label: t('nav.dashboard') },
    { href: '/arbitration', label: t('nav.arbitration') },
    { href: '/rails', label: t('nav.fiatRails') },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Fair<span className="text-cyan-400">Lance</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 rounded">
                Soroban
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-100/50 p-1 rounded-xl border border-white/5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-100/70 border border-white/5 hover:border-white/15 text-xs text-slate-300 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="uppercase font-mono">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl glass-panel shadow-2xl p-1.5 border border-white/10 z-50 animate-in fade-in zoom-in-95">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as SupportedLanguage);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                        language === lang.code
                          ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {lang.code.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wallet Connect Pill */}
            {wallet.isConnected && wallet.address ? (
              <div className="flex items-center gap-2 bg-surface-100/70 border border-cyan-500/30 p-1 pl-3 rounded-xl shadow-glow">
                <div className="hidden sm:block text-right">
                  <div className="text-[11px] font-mono text-cyan-300 font-semibold">
                    {formatStroopsToXlm(wallet.nativeBalance)} XLM
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {formatAddress(wallet.address, 4)}
                  </div>
                </div>
                <button
                  onClick={disconnect}
                  title="Disconnect"
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Button
                variant="glow"
                size="sm"
                onClick={() => setWalletModalOpen(true)}
                className="gap-2 text-xs"
              >
                <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('nav.connectWallet')}</span>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-background/95 p-4 space-y-2 backdrop-blur-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </>
  );
};
