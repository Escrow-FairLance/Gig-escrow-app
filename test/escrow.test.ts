import { describe, expect, it } from 'bun:test';
import { EscrowContractClient } from '../src/contracts/escrow';
import { xdr } from '@stellar/stellar-sdk';

import { Keypair } from '@stellar/stellar-sdk';

describe('EscrowContractClient Operation Builders', () => {
  const client = new EscrowContractClient('CDG3CB5IEATXZPTL3SQGCBVJM2A4HUX4J5TTFGMA7NPGFQBMQBYFXZCB');

  const clientKey = Keypair.random().publicKey();
  const freelancerKey = Keypair.random().publicKey();
  const arbitratorKey1 = Keypair.random().publicKey();
  const arbitratorKey2 = Keypair.random().publicKey();
  const arbitratorKey3 = Keypair.random().publicKey();

  const sampleParams = {
    client: clientKey,
    freelancer: freelancerKey,
    token: 'CDG3CB5IEATXZPTL3SQGCBVJM2A4HUX4J5TTFGMA7NPGFQBMQBYFXZCB',
    milestones: [
      {
        amount: 15000000000n,
        deadline: 1800000000n,
        titleHashHex: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    ],
    termsHashHex: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    arbitratorFeeBps: 500,
    clientCancelFeeBps: 200,
    reviewWindowSeconds: 259200,
    workTimeoutSeconds: 1209600,
    disputeWindowSeconds: 604800,
    arbitratorStakeReq: 100000000n,
    arbitratorPanel: [
      arbitratorKey1,
      arbitratorKey2,
      arbitratorKey3,
    ],
  };

  it('should build valid create_job operation', () => {
    const op = client.buildCreateJobOp(sampleParams);
    expect(op).toBeInstanceOf(xdr.Operation);
    expect(op.body().switch().name).toBe('invokeHostFunction');
  });

  it('should build valid submit_milestone operation', () => {
    const op = client.buildSubmitMilestoneOp(
      1n,
      0,
      '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    );
    expect(op).toBeInstanceOf(xdr.Operation);
    expect(op.body().switch().name).toBe('invokeHostFunction');
  });

  it('should build valid approve_milestone operation', () => {
    const op = client.buildApproveMilestoneOp(1n, 0);
    expect(op).toBeInstanceOf(xdr.Operation);
  });

  it('should build valid request_revision operation', () => {
    const op = client.buildRequestRevisionOp(
      1n,
      0,
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
    expect(op).toBeInstanceOf(xdr.Operation);
  });

  it('should build valid open_dispute operation', () => {
    const op = client.buildOpenDisputeOp(
      1n,
      0,
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
    expect(op).toBeInstanceOf(xdr.Operation);
  });

  it('should build valid vote_dispute operation', () => {
    const op = client.buildVoteDisputeOp(
      1n,
      0,
      arbitratorKey1,
      6000
    );
    expect(op).toBeInstanceOf(xdr.Operation);
  });

  it('should build valid auto_release_payment operation', () => {
    const op = client.buildAutoReleaseOp(1n, 0);
    expect(op).toBeInstanceOf(xdr.Operation);
  });

  it('should build valid reclaim_stalled_job operation', () => {
    const op = client.buildReclaimStalledJobOp(1n);
    expect(op).toBeInstanceOf(xdr.Operation);
  });
});
