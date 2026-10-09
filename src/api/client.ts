import { STELLAR_CONFIG } from '../config/constants';
import { ArbitratorCandidateView, DisputeView, JobView, MilestoneView } from '../types/escrow';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = STELLAR_CONFIG.apiBaseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('fairlance_jwt');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      // Graceful offline fallback
      console.warn(`[ApiClient] Request to ${endpoint} failed:`, err);
      throw err;
    }
  }

  // Templates
  async getTemplates(): Promise<{ templates: any[] }> {
    return this.request('/templates');
  }

  async hashTerms(terms: Record<string, unknown>): Promise<{ termsHash: string }> {
    return this.request('/templates/hash-terms', {
      method: 'POST',
      body: JSON.stringify({ terms }),
    });
  }

  // Jobs
  async getJobs(params: { userAddress?: string; role?: string } = {}): Promise<{ jobs: JobView[]; total: number }> {
    const q = new URLSearchParams();
    if (params.userAddress) q.set('userAddress', params.userAddress);
    if (params.role) q.set('role', params.role);
    return this.request(`/jobs?${q.toString()}`);
  }

  async getJobById(id: string): Promise<{ job: JobView }> {
    return this.request(`/jobs/${id}`);
  }

  async createJob(payload: any): Promise<{ job: JobView }> {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Milestones
  async submitMilestone(jobId: string, index: number, deliverableHash: string): Promise<{ milestone: MilestoneView }> {
    return this.request(`/jobs/${jobId}/milestones/${index}/submit`, {
      method: 'POST',
      body: JSON.stringify({ deliverableHash }),
    });
  }

  async reviewMilestone(
    jobId: string,
    index: number,
    action: 'APPROVE' | 'REQUEST_REVISION',
    feedback?: string
  ): Promise<{ milestone: MilestoneView }> {
    return this.request(`/jobs/${jobId}/milestones/${index}/review`, {
      method: 'POST',
      body: JSON.stringify({ action, feedback }),
    });
  }

  async autoReleaseMilestone(jobId: string, index: number): Promise<any> {
    return this.request(`/jobs/${jobId}/milestones/${index}/auto-release`, {
      method: 'POST',
    });
  }

  // Disputes & Arbitration
  async openDispute(jobId: string, index: number, reason: string): Promise<{ dispute: DisputeView }> {
    return this.request(`/jobs/${jobId}/milestones/${index}/dispute`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async castVote(jobId: string, index: number, freelancerShareBps: number): Promise<any> {
    return this.request(`/jobs/${jobId}/milestones/${index}/dispute/vote`, {
      method: 'POST',
      body: JSON.stringify({ freelancerShareBps }),
    });
  }

  async getArbitrators(): Promise<{ arbitrators: any[] }> {
    return this.request('/arbitrators');
  }

  async suggestPanel(params: any): Promise<{ panel: ArbitratorCandidateView[]; recommendedSize: number }> {
    return this.request('/arbitrators/suggest-panel', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Anchors (SEP-24)
  async getAnchors(countryCode?: string): Promise<{ anchors: any[] }> {
    const q = countryCode ? `?countryCode=${countryCode}` : '';
    return this.request(`/anchors${q}`);
  }

  async initiateDeposit(anchorDomain: string, assetCode: string, amount?: string): Promise<{ session: any }> {
    return this.request('/anchors/deposit', {
      method: 'POST',
      body: JSON.stringify({ anchorDomain, assetCode, amount }),
    });
  }

  async initiateWithdraw(anchorDomain: string, assetCode: string, amount?: string): Promise<{ session: any }> {
    return this.request('/anchors/withdraw', {
      method: 'POST',
      body: JSON.stringify({ anchorDomain, assetCode, amount }),
    });
  }
}

export const api = new ApiClient();
