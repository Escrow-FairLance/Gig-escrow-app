export type JobStatus =
  | 'CREATED'
  | 'ACTIVE'
  | 'DISPUTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DECLINED'
  | 'STALLED_RECLAIMED'
  | 'ABANDONED'
  | 'CLOSED';

export type MilestoneStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'REVISION_REQUESTED'
  | 'APPROVED'
  | 'DISPUTED'
  | 'RESOLVED';

export type DisputeStatus = 'ACTIVE' | 'RESOLVED';

export interface MilestoneView {
  id: string;
  index: number;
  title: string;
  description?: string;
  amount: string; // stroops as string
  deadline: string;
  status: MilestoneStatus;
  deliverableHash?: string;
  revisionFeedbackHash?: string;
  revisionCount: number;
  submittedAt?: string;
  approvedAt?: string;
}

export interface JobView {
  id: string;
  onChainJobId?: string;
  clientAddress: string;
  freelancerAddress: string;
  tokenAddress: string;
  totalAmount: string;
  escrowBalance: string;
  status: JobStatus;
  currentMilestoneIndex: number;
  milestoneCount: number;
  termsHash: string;
  arbitratorFeeBps: number;
  reviewWindowSeconds: string;
  workTimeoutSeconds: string;
  disputeWindowSeconds: string;
  arbitratorPanel: string[];
  milestones: MilestoneView[];
  createdAt: string;
  updatedAt: string;
}

export interface DisputeView {
  id: string;
  jobId: string;
  milestoneIndex: number;
  openedBy: string;
  reason: string;
  reasonHash: string;
  status: DisputeStatus;
  votingDeadline: string;
  arbitratorFeeAmount: string;
  settledFreelancerShareBps?: number;
  votes: {
    arbitratorAddress: string;
    freelancerShareBps: number;
    votedAt: string;
  }[];
}

export interface ArbitratorCandidateView {
  address: string;
  displayName?: string;
  skills: string[];
  languages: string[];
  feeBps: number;
  reputationScore: number;
  stakedAmount: string;
  activeCasesCount: number;
  totalCasesVoted: number;
}
