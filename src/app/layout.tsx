import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from '../wallet/context.js';
import { I18nProvider } from '../i18n/context.js';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';
import { NetworkBanner } from '../components/common/NetworkBanner.js';

export const metadata: Metadata = {
  title: 'Escrow-FairLance | Decentralized Milestone Escrow Protocol on Stellar & Soroban',
  description:
    'Non-custodial freelance escrow platform on Stellar & Soroban smart contracts. Verifiable milestone payments, cryptographic SHA-256 deliverable hashing, anti-ghosting auto-release, and odd-sized decentralized arbitration.',
  keywords: [
    'Stellar',
    'Soroban',
    'Smart Contracts',
    'Escrow',
    'Freelance',
    'Milestone Payments',
    'Arbitration',
    'SEP-24',
    'Off-Ramp',
  ],
  authors: [{ name: 'Escrow-FairLance Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
        <I18nProvider>
          <WalletProvider>
            <div className="flex min-h-screen flex-col">
              <NetworkBanner />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </WalletProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
