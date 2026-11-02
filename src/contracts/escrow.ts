import {
  Address,
  Contract,
  nativeToScVal,
  xdr,
} from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from '../config/constants';
import { sorobanRunner, SorobanExecutionResult, SorobanTransactionSigner } from './runner';

export interface MilestoneParam {
  amount: bigint;
  deadline: bigint;
  titleHashHex: string;
}

export interface CreateJobParams {
  client: string;
  freelancer: string;
  token: string;
  milestones: MilestoneParam[];
  termsHashHex: string;
  arbitratorFeeBps: number;
  clientCancelFeeBps: number;
  reviewWindowSeconds: number;
  workTimeoutSeconds: number;
  disputeWindowSeconds: number;
  arbitratorStakeReq: bigint;
  arbitratorPanel: string[];
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
  buildCreateJobOp(params: CreateJobParams): xdr.Operation {
    const scMilestones = params.milestones.map((m) => {
      const cleanHash = m.titleHashHex.replace(/^0x/, '');
      return nativeToScVal(
        {
          amount: m.amount,
          deadline: m.deadline,
          title_hash: Buffer.from(cleanHash, 'hex'),
        },
        {
          type: {
            amount: 'i128',
            deadline: 'u64',
            title_hash: 'bytes',
          },
        }
      );
    });

    const scPanel = params.arbitratorPanel.map((addr) =>
      new Address(addr).toScVal()
    );

    const cleanTermsHash = params.termsHashHex.replace(/^0x/, '');

    return this.contract.call(
      'create_job',
      new Address(params.client).toScVal(),
      new Address(params.freelancer).toScVal(),
      new Address(params.token).toScVal(),
      xdr.ScVal.scvVec(scMilestones),
      nativeToScVal(Buffer.from(cleanTermsHash, 'hex'), { type: 'bytes' }),
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
   * Submits create_job transaction on Soroban.
   */
  async createJob(params: CreateJobParams, signer: SorobanTransactionSigner): Promise<SorobanExecutionResult> {
    const op = this.buildCreateJobOp(params);
    return sorobanRunner.invokeContract({
      sourceAddress: params.client,
      operation: op,
      signer,
    });
  }

  /**
   * Builds submit_milestone operation.
   */
  buildSubmitMilestoneOp(jobId: bigint, milestoneIndex: number, deliverableHashHex: string): xdr.Operation {
    const cleanHash = deliverableHashHex.replace(/^0x/, '');
    return this.contract.call(
      'submit_milestone',
      nativeToScVal(jobId, { type: 'u64' }),
      nativeToScVal(milestoneIndex, { type: 'u32' }),
      nativeToScVal(Buffer.from(cleanHash, 'hex'), { type: 'bytes' })
    );
  }

  /**
   * Submits submit_milestone transaction on Soroban.
   */
  async submitMilestone(
    callerAddress: string,
    jobId: bigint,
    milestoneIndex: number,
    deliverableHashHex: string,
    signer: SorobanTransactionSigner
  ): Promise<SorobanExecutionResult> {
    const op = this.buildSubmitMilestoneOp(jobId, milestoneIndex, deliverableHashHex);
    return sorobanRunner.invokeContract({
      sourceAddress: callerAddress,
      operation: op,
      signer,
    });
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
   * Submits approve_milestone transaction on Soroban.
   */
  async approveMilestone(
    clientAddress: string,
    jobId: bigint,
    milestoneIndex: number,
    signer: SorobanTransactionSigner
  ): Promise<SorobanExecutionResult> {
    const op = this.buildApproveMilestoneOp(jobId, milestoneIndex);
    return sorobanRunner.invokeContract({
      sourceAddress: clientAddress,
      operation: op,
      signer,
    });
  }

  /**
   * Builds request_revision operation.
   */
  buildRequestRevisionOp(jobId: bigint, milestoneIndex: number, feedbackHashHex: string): xdr.Operation {
    const cleanHash = feedbackHashHex.replace(/^0x/, '');
    return this.contract.call(
      'request_revision',
      nativeToScVal(jobId, { type: 'u64' }),
      nativeToScVal(milestoneIndex, { type: 'u32' }),
      nativeToScVal(Buffer.from(cleanHash, 'hex'), { type: 'bytes' })
    );
  }

  /**
   * Submits request_revision transaction on Soroban.
   */
  async requestRevision(
    clientAddress: string,
    jobId: bigint,
    milestoneIndex: number,
    feedbackHashHex: string,
    signer: SorobanTransactionSigner
  ): Promise<SorobanExecutionResult> {
    const op = this.buildRequestRevisionOp(jobId, milestoneIndex, feedbackHashHex);
    return sorobanRunner.invokeContract({
      sourceAddress: clientAddress,
      operation: op,
      signer,
    });
  }

  /**
   * Builds open_dispute operation.
   */
  buildOpenDisputeOp(jobId: bigint, milestoneIndex: number, reasonHashHex: string): xdr.Operation {
    const cleanHash = reasonHashHex.replace(/^0x/, '');
    return this.contract.call(
      'open_dispute',
      nativeToScVal(jobId, { type: 'u64' }),
      nativeToScVal(milestoneIndex, { type: 'u32' }),
      nativeToScVal(Buffer.from(cleanHash, 'hex'), { type: 'bytes' })
    );
  }

  /**
   * Submits open_dispute transaction on Soroban.
   */
  async openDispute(
    callerAddress: string,
    jobId: bigint,
    milestoneIndex: number,
    reasonHashHex: string,
    signer: SorobanTransactionSigner
  ): Promise<SorobanExecutionResult> {
    const op = this.buildOpenDisputeOp(jobId, milestoneIndex, reasonHashHex);
    return sorobanRunner.invokeContract({
      sourceAddress: callerAddress,
      operation: op,
      signer,
    });
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
   * Submits vote_dispute transaction on Soroban.
   */
  async voteDispute(
    arbitratorAddress: string,
    jobId: bigint,
    milestoneIndex: number,
    freelancerShareBps: number,
    signer: SorobanTransactionSigner
  ): Promise<SorobanExecutionResult> {
    const op = this.buildVoteDisputeOp(jobId, milestoneIndex, arbitratorAddress, freelancerShareBps);
    return sorobanRunner.invokeContract({
      sourceAddress: arbitratorAddress,
      operation: op,
      signer,
    });
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
   * Submits auto_release_payment transaction on Soroban.
   */
  async autoReleasePayment(
    callerAddress: string,
    jobId: bigint,
    milestoneIndex: number,
    signer: SorobanTransactionSigner
  ): Promise<SorobanExecutionResult> {
    const op = this.buildAutoReleaseOp(jobId, milestoneIndex);
    return sorobanRunner.invokeContract({
      sourceAddress: callerAddress,
      operation: op,
      signer,
    });
  }

  /**
   * Builds reclaim_stalled_job operation.
   */
  buildReclaimStalledJobOp(jobId: bigint): xdr.Operation {
    return this.contract.call('reclaim_stalled_job', nativeToScVal(jobId, { type: 'u64' }));
  }

  /**
   * Submits reclaim_stalled_job transaction on Soroban.
   */
  async reclaimStalledJob(
    clientAddress: string,
    jobId: bigint,
    signer: SorobanTransactionSigner
  ): Promise<SorobanExecutionResult> {
    const op = this.buildReclaimStalledJobOp(jobId);
    return sorobanRunner.invokeContract({
      sourceAddress: clientAddress,
      operation: op,
      signer,
    });
  }
}

export const escrowContractClient = new EscrowContractClient();
