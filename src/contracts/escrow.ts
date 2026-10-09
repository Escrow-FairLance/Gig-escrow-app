import {
  Address,
  Contract,
  nativeToScVal,
  Operation,
  scValToNative,
  xdr,
} from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from '../config/constants';

export interface ContractMilestoneInit {
  amount: bigint;
  deadline: bigint;
  title_hash: Buffer;
}

export class EscrowContractClient {
  public contract: Contract;
  public contractId: string;

  constructor(contractId = STELLAR_CONFIG.escrowContractId) {
    this.contractId = contractId;
    this.contract = new Contract(contractId);
  }

  /**
   * Builds create_job contract call operation.
   */
  buildCreateJobOp(params: {
    client: string;
    freelancer: string;
    token: string;
    milestones: { amount: bigint; deadline: bigint; titleHashHex: string }[];
    termsHashHex: string;
    arbitratorFeeBps: number;
    clientCancelFeeBps: number;
    reviewWindowSeconds: number;
    workTimeoutSeconds: number;
    disputeWindowSeconds: number;
    arbitratorStakeReq: bigint;
    arbitratorPanel: string[];
  }): xdr.Operation {
    const scMilestones = params.milestones.map((m) =>
      nativeToScVal(
        {
          amount: m.amount,
          deadline: m.deadline,
          title_hash: Buffer.from(m.titleHashHex, 'hex'),
        },
        {
          type: {
            amount: 'i128',
            deadline: 'u64',
            title_hash: 'bytes',
          },
        }
      )
    );

    const scPanel = params.arbitratorPanel.map((addr) =>
      new Address(addr).toScVal()
    );

    return this.contract.call(
      'create_job',
      new Address(params.client).toScVal(),
      new Address(params.freelancer).toScVal(),
      new Address(params.token).toScVal(),
      xdr.ScVal.scvVec(scMilestones),
      nativeToScVal(Buffer.from(params.termsHashHex, 'hex'), { type: 'bytes' }),
      nativeToScVal(params.arbitratorFeeBps, { type: 'u32' }),
      nativeToScVal(params.clientCancelFeeBps, { type: 'u32' }),
      nativeToScVal(params.reviewWindowSeconds, { type: 'u64' }),
      nativeToScVal(params.workTimeoutSeconds, { type: 'u64' }),
      nativeToScVal(params.disputeWindowSeconds, { type: 'u64' }),
      nativeToScVal(params.arbitratorStakeReq, { type: 'i128' }),
      xdr.ScVal.scvVec(scPanel)
    );
  }

  /**
   * Builds submit_milestone operation.
   */
  buildSubmitMilestoneOp(jobId: bigint, milestoneIndex: number, deliverableHashHex: string): xdr.Operation {
    return this.contract.call(
      'submit_milestone',
      nativeToScVal(jobId, { type: 'u64' }),
      nativeToScVal(milestoneIndex, { type: 'u32' }),
      nativeToScVal(Buffer.from(deliverableHashHex, 'hex'), { type: 'bytes' })
    );
  }

  /**
   * Builds approve_milestone operation.
   */
  buildApproveMilestoneOp(jobId: bigint, milestoneIndex: number): xdr.Operation {
    return this.contract.call(
      'approve_milestone',
      nativeToScVal(jobId, { type: 'u64' }),
      nativeToScVal(milestoneIndex, { type: 'u32' })
    );
  }

  /**
   * Builds request_revision operation.
   */
  buildRequestRevisionOp(jobId: bigint, milestoneIndex: number, feedbackHashHex: string): xdr.Operation {
    return this.contract.call(
      'request_revision',
      nativeToScVal(jobId, { type: 'u64' }),
      nativeToScVal(milestoneIndex, { type: 'u32' }),
      nativeToScVal(Buffer.from(feedbackHashHex, 'hex'), { type: 'bytes' })
    );
  }

  /**
   * Builds open_dispute operation.
   */
  buildOpenDisputeOp(jobId: bigint, milestoneIndex: number, reasonHashHex: string): xdr.Operation {
    return this.contract.call(
      'open_dispute',
      nativeToScVal(jobId, { type: 'u64' }),
      nativeToScVal(milestoneIndex, { type: 'u32' }),
      nativeToScVal(Buffer.from(reasonHashHex, 'hex'), { type: 'bytes' })
    );
  }

  /**
   * Builds vote_dispute operation.
   */
  buildVoteDisputeOp(jobId: bigint, milestoneIndex: number, arbitrator: string, freelancerShareBps: number): xdr.Operation {
    return this.contract.call(
      'vote_dispute',
      nativeToScVal(jobId, { type: 'u64' }),
      nativeToScVal(milestoneIndex, { type: 'u32' }),
      new Address(arbitrator).toScVal(),
      nativeToScVal(freelancerShareBps, { type: 'u32' })
    );
  }

  /**
   * Builds auto_release_payment operation.
   */
  buildAutoReleaseOp(jobId: bigint, milestoneIndex: number): xdr.Operation {
    return this.contract.call(
      'auto_release_payment',
      nativeToScVal(jobId, { type: 'u64' }),
      nativeToScVal(milestoneIndex, { type: 'u32' })
    );
  }

  /**
   * Builds reclaim_stalled_job operation.
   */
  buildReclaimStalledJobOp(jobId: bigint): xdr.Operation {
    return this.contract.call('reclaim_stalled_job', nativeToScVal(jobId, { type: 'u64' }));
  }
}

export const escrowContractClient = new EscrowContractClient();
