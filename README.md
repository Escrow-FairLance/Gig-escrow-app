# Escrow-FairLance Client (Frontend Web Application)

> **Decentralized Milestone Escrow & Odd-Panel Dispute Protocol for Cross-Border Freelancers on Stellar & Soroban.**

[![Stellar Network](https://img.shields.io/badge/Stellar-Testnet-00F0FF?style=flat&logo=stellar)](https://stellar.org)
[![Soroban SDK](https://img.shields.io/badge/Soroban-v22.0.8-7928CA?style=flat)](https://soroban.stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Bun Test](https://img.shields.io/badge/Tests-Passing%20(21%2F21)-success?style=flat&logo=bun)](https://bun.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Overview

**Escrow-FairLance Client** is the open-source web application for the Escrow-FairLance freelance escrow protocol. It empowers cross-border clients, freelancers, and decentralized jurors with non-custodial milestone escrows, client-side AES-256-GCM encryption, cryptographic deliverable hashing, anti-ghosting auto-releases, and odd-sized decentralized dispute resolution.

### Key Capabilities
- **Non-Custodial Milestone Escrow**: Clients lock 100% of the project budget upfront in Soroban smart contracts (`escrow_contract`). Funds are held safely with invariant balance guarantees.
- **Client-Side SHA-256 Deliverable Hasher & AES-256-GCM Vault**: Freelancers upload work; the browser computes a SHA-256 digest on-the-fly and encrypts deliverables using AES-256-GCM with PBKDF2 key derivation (100,000 iterations). Only the 32-byte hash is committed on-chain.
- **Enforced 2-Revision Limit**: Clients can request a maximum of 2 formal revisions per milestone, each cryptographically hashed on-chain to prevent scope creep.
- **Anti-Ghosting Auto-Release**: If a client is silent past the review window (e.g. 72 hours), any participant can trigger `auto_release_payout` on-chain to deliver payment to the freelancer.
- **Odd-Sized Juror Quorum (1, 3, 5, 7 members)**: Staked jurors audit cryptographic deliverable hashes, terms, and claims, voting on Release, Refund, or custom Proportional Splits (in basis points) with deterministic consensus.
- **Unilateral Reclaim on Stalled Jobs**: Clients can reclaim unreleased escrow balances if a freelancer fails to deliver before the contract timeout.
- **Multi-Wallet Support**: Pluggable wallet adapters for Freighter, Albedo, and xBull with unified signing interfaces.
- **Integrated SEP-24 Anchor Rails**: Instant cashout to local African bank accounts, M-Pesa, Airtel Money, or cash pickup via MoneyGram across 180+ countries.
- **Multi-Language Internationalization**: English, French, Hausa, Yoruba, and Swahili localization dictionaries for West, East, and Central African freelancers.

---

## 🛠️ Architecture & Tech Stack

```
Gig-escrow-app/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root Layout with Wallet, i18n & Network Banners
│   │   ├── page.tsx             # Landing Page (Hero, Stats, Flow, Features, Role CTA)
│   │   ├── jobs/
│   │   │   ├── page.tsx         # Jobs Marketplace (Search, Filter, Cards)
│   │   │   ├── new/page.tsx     # Post-Job Wizard (Milestones, Odd Panel, Terms Hashing)
│   │   │   └── [id]/page.tsx    # Live Escrow Details (Timeline, Revisions, Disputes)
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Role Selector Portal
│   │   │   ├── freelancer/      # Freelancer Workspace & Task Queue
│   │   │   └── client/          # Client Workspace & Review Queue
│   │   ├── arbitration/page.tsx # Juror Staking & Dispute Voting Portal
│   │   ├── disputes/[id]/       # Dispute Evidence Vault & Quorum Progress
│   │   ├── rails/page.tsx       # SEP-24 Anchor Off-Ramp Interactive Directory
│   │   ├── profile/[address]/   # On-Chain Reputation & Historical Milestones
│   │   └── faucet/page.tsx      # Friendbot Testnet Account Faucet
│   ├── components/
│   │   ├── home/                # Hero, StatBanner, Features, HowItWorks, RoleCTA
│   │   ├── jobs/                # JobCard, JobFilter, MilestoneBuilder, ArbitratorSelector
│   │   ├── dashboard/           # DeliverableSubmitModal, ClientReviewModal
│   │   ├── arbitration/         # StakingModal, ArbitratorRulingCard
│   │   ├── layout/              # Navbar, Footer
│   │   ├── common/              # NetworkBanner
│   │   ├── ui/                  # Button, Card, Badge, Input primitives
│   │   └── wallet/              # ConnectWalletModal
│   ├── config/                  # Stellar Testnet Contract Addresses & Constants
│   ├── contracts/               # Soroban Invocation Client, Transaction Runner & SEP-24
│   ├── crypto/                  # AES-256-GCM Encryption Suite & Canonical JSON Serializer
│   ├── i18n/                    # EN, FR, HA, YO, SW Translation Context
│   ├── storage/                 # Decentralized IPFS Storage & Envelope Vault
│   ├── types/                   # Escrow, Milestone, Dispute & Wallet View Models
│   └── wallet/                  # Stellar Wallets Kit (Freighter, Albedo, xBull)
└── test/                        # Bun Test Suites (Crypto, Escrow, Storage, Wallet, SEP-24)
```

---

## 🌐 Testnet Contract Deployments

| Component | Testnet Address |
| :--- | :--- |
| **Escrow Smart Contract** | `CDG3CB5IEATXZPTL3SQGCBVJM2A4HUX4J5TTFGMA7NPGFQBMQBYFXZCB` |
| **Stellar Asset Contract (SAC Native XLM)** | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| **Horizon Testnet RPC** | `https://horizon-testnet.stellar.org` |
| **Soroban RPC Server** | `https://soroban-testnet.stellar.org` |
| **Network Passphrase** | `Test SDF Network ; September 2015` |

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js v20+ or [Bun](https://bun.sh)
- [Freighter Wallet](https://www.freighter.app/) extension configured for **Testnet**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Escrow-FairLance/Gig-escrow-app.git
cd Gig-escrow-app

# Install dependencies
bun install
```

### 3. Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_ESCROW_CONTRACT_ID=CDG3CB5IEATXZPTL3SQGCBVJM2A4HUX4J5TTFGMA7NPGFQBMQBYFXZCB
NEXT_PUBLIC_NATIVE_TOKEN_ID=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

### 4. Running Quality Checks & Tests
```bash
# Run unit & integration test suites
bun test

# Run ESLint code quality analysis
bun run lint

# Run TypeScript typecheck
bun run typecheck

# Build production bundle
bun run build
```

### 5. Run Development Server
```bash
bun run dev
```
Navigate to `http://localhost:3000`.

---

## 📜 Complete 3-Repository Architecture

Escrow-FairLance is delivered across three specialized repositories:
1. **[Gig-escrow-contracts](https://github.com/Escrow-FairLance/Gig-escrow-contracts)**: Soroban Rust smart contracts with milestone accounting, odd-sized arbitration, invariant proofs, and testnet deployment scripts.
2. **[Gig-escrow-service](https://github.com/Escrow-FairLance/Gig-escrow-service)**: Fastify & TypeScript backend service with SQLite/Prisma, SEP-10 JWT authentication, deliverable encryption, and SEP-24 off-ramp rails.
3. **[Gig-escrow-app](https://github.com/Escrow-FairLance/Gig-escrow-app)**: Next.js web application with multi-wallet integration, client-side cryptographic hashing, and juror arbitration portal.

---

## 📄 License
MIT © 2026 Escrow-FairLance Protocol Team
