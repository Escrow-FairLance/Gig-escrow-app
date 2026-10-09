export const en: Record<string, string> = {
  // Navigation
  'nav.home': 'Home',
  'nav.jobs': 'Contracts',
  'nav.createJob': 'Create Escrow',
  'nav.dashboard': 'Dashboard',
  'nav.arbitration': 'Arbitration Panel',
  'nav.fiatRails': 'Local Off-Ramps',
  'nav.connectWallet': 'Connect Wallet',
  'nav.disconnect': 'Disconnect',
  'nav.connected': 'Connected',

  // Hero
  'hero.badge': 'Powered by Stellar & Soroban SDK v22',
  'hero.title': 'Trustless Freelancer Escrow on Stellar',
  'hero.subtitle':
    'Lock milestone payments into non-custodial Soroban smart contracts. Encrypted file deliverables, strict 2-revision limit protection, impartial arbitrator panels, and instant off-ramps to M-Pesa & African bank accounts.',
  'hero.ctaClient': 'Create Escrow Contract',
  'hero.ctaFreelancer': 'View Active Jobs',
  'hero.statTvl': 'Total Value Locked',
  'hero.statSettled': 'Disputes Settled',
  'hero.statCountries': 'Supported Countries',

  // Features
  'feat.title': 'Built for Cross-Border Freelancing',
  'feat.desc': 'Eliminate ghosting, endless revisions, and payment delays with cryptographic certainty.',
  'feat.milestonesTitle': 'Multi-Milestone Escrow',
  'feat.milestonesDesc': 'Clients fund all milestones upfront into smart contracts. Funds are released instantly as deliverables are approved.',
  'feat.revisionsTitle': '2-Revision Limit Protection',
  'feat.revisionsDesc': 'Freelancers are protected from infinite scope creep. Clients can request up to 2 revisions before they must approve or dispute.',
  'feat.autoReleaseTitle': 'Silence Auto-Release',
  'feat.autoReleaseDesc': 'If a client is silent past the review window (e.g. 3 days), anyone can trigger instant automatic payout.',
  'feat.arbitrationTitle': 'Odd-Sized Arbitrators',
  'feat.arbitrationDesc': 'Disputes are settled by vetted panels (1, 3, 5, or 7 members) voting proportional basis points with staking & slashing.',
  'feat.fiatTitle': 'Instant Local Off-Ramps',
  'feat.fiatDesc': 'Direct integration with Cowrie (NGN), ClickPesa (KES/M-Pesa), Yellow Card, and MoneyGram for local currency payout.',

  // Wizard
  'wizard.title': 'Create New Escrow Job',
  'wizard.step1': '1. Project Scope',
  'wizard.step2': '2. Milestones & Budget',
  'wizard.step3': '3. Arbitrator Panel',
  'wizard.step4': '4. Fund Escrow',
  'wizard.client': 'Client Stellar Address',
  'wizard.freelancer': 'Freelancer Stellar Address',
  'wizard.token': 'Escrow Token (XLM / USDC)',
  'wizard.milestoneTitle': 'Milestone Title',
  'wizard.milestoneAmount': 'Amount (XLM)',
  'wizard.milestoneDeadline': 'Target Deadline',
  'wizard.addMilestone': '+ Add Another Milestone',
  'wizard.oddPanelNotice': 'Arbitrator panel must have an odd number of members (1, 3, 5, or 7) to prevent voting ties.',
  'wizard.fundButton': 'Sign & Deposit Escrow to Soroban',

  // Dashboard
  'dash.title': 'Escrow Dashboard',
  'dash.clientTab': 'My Jobs as Client',
  'dash.freelancerTab': 'My Jobs as Freelancer',
  'dash.empty': 'No active contracts found for this wallet.',
  'dash.revisionsRemaining': 'revisions remaining',
  'dash.reviewWindow': 'Review Window',
  'dash.autoReleaseIn': 'Auto-releases in',
  'dash.submitDeliverable': 'Submit Deliverable',
  'dash.approvePayout': 'Approve & Release Payment',
  'dash.requestRevision': 'Request Revision',
  'dash.openDispute': 'Open Dispute',

  // Arbitration
  'arb.title': 'Dispute Arbitration Center',
  'arb.subtitle': 'Review submitted work and evidence, then cast your proportional settlement vote.',
  'arb.freelancerShare': 'Freelancer Share (Basis Points)',
  'arb.clientRefund': 'Client Refund Share',
  'arb.castVote': 'Cast On-Chain Vote',
  'arb.threshold': 'Consensus Majority Threshold',

  // Rails
  'rails.title': 'African & Global Fiat Rails (SEP-24)',
  'rails.subtitle': 'Off-ramp your crypto earnings directly into your local mobile money or bank account.',
  'rails.deposit': 'Deposit Local Fiat',
  'rails.withdraw': 'Withdraw to Mobile Money / Bank',
  'rails.partner': 'Anchor Partner',
  'rails.instantNotice': 'Settles instantly via Stellar SEP-24 interactive rails.',
};
