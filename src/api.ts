import {
  User,
  Brand,
  BrandParameter,
  Campaign,
  Submission,
  AuditLog,
  AppNotification,
  SystemSettings,
  AnalyticsData,
  ReviewVelocityStats,
  SubmissionComment,
  SupervisorMetric,
  AIUsageLog,
  DriveStatusResponse,
  DeliveryPackage,
} from './types';

async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retries = 3,
  delayMs = 350
): Promise<Response> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('z_token') || localStorage.getItem('zarvis_token')
      : null;

  const headers = new Headers(options?.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers,
  };

  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, mergedOptions);
      if (res.ok) return res;
      if (res.status >= 500 && i < retries - 1) {
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
        continue;
      }
    }
  }
  throw lastError || new Error(`Fetch failed for ${url}`);
}

export const api = {
  // Auth
  getUsers: async (): Promise<User[]> => {
    const res = await fetchWithRetry('/api/auth/users');
    return res.json();
  },
  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const res = await fetchWithRetry('/api/auth/me');
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unauthorized' }));
      throw new Error(err.error || 'Failed to get current user session');
    }
    return res.json();
  },
  login: async (
    email: string,
    role?: string,
    password?: string
  ): Promise<{ success: boolean; user: User; token: string }> => {
    const res = await fetchWithRetry('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('z_token', data.token);
      localStorage.setItem('zarvis_token', data.token);
    }
    return data;
  },
  logout: async (): Promise<{ success: boolean }> => {
    try {
      const res = await fetchWithRetry('/api/auth/logout', { method: 'POST' });
      return res.json();
    } catch {
      return { success: true };
    } finally {
      localStorage.removeItem('z_token');
      localStorage.removeItem('zarvis_token');
    }
  },
  updateUserRole: async (userId: string, role: string): Promise<{ success: boolean; user: User }> => {
    const res = await fetchWithRetry(`/api/auth/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update role' }));
      throw new Error(err.error || 'Failed to update user role');
    }
    return res.json();
  },

  // Brands
  getBrands: async (): Promise<Brand[]> => {
    const res = await fetchWithRetry('/api/brands');
    return res.json();
  },
  createBrand: async (brand: Partial<Brand>): Promise<Brand> => {
    const res = await fetchWithRetry('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand),
    });
    return res.json();
  },
  updateBrandToolkit: async (
    brandId: string,
    data: { toolkit?: any; colorPalette?: any; typography?: any }
  ): Promise<Brand> => {
    const res = await fetchWithRetry(`/api/brands/${brandId}/toolkit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateBrand: async (id: string, brand: Partial<Brand>): Promise<Brand> => {
    const res = await fetchWithRetry(`/api/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand),
    });
    return res.json();
  },

  // Parameters
  getParameters: async (brandId?: string): Promise<BrandParameter[]> => {
    const url = brandId ? `/api/parameters?brandId=${brandId}` : '/api/parameters';
    const res = await fetchWithRetry(url);
    return res.json();
  },
  createParameter: async (param: Partial<BrandParameter>): Promise<BrandParameter> => {
    const res = await fetchWithRetry('/api/parameters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(param),
    });
    return res.json();
  },
  updateParameter: async (id: string, param: Partial<BrandParameter>): Promise<BrandParameter> => {
    const res = await fetchWithRetry(`/api/parameters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(param),
    });
    return res.json();
  },
  deleteParameter: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetchWithRetry(`/api/parameters/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Campaigns
  getCampaigns: async (brandId?: string): Promise<Campaign[]> => {
    const url = brandId ? `/api/campaigns?brandId=${brandId}` : '/api/campaigns';
    const res = await fetchWithRetry(url);
    return res.json();
  },
  createCampaign: async (camp: Partial<Campaign>): Promise<Campaign> => {
    const res = await fetchWithRetry('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(camp),
    });
    return res.json();
  },
  createCampaignWithGuidelines: async (data: {
    campaign: Partial<Campaign>;
    guidelines: Partial<BrandParameter>[];
  }): Promise<{ campaign: Campaign; parameters: BrandParameter[] }> => {
    const res = await fetchWithRetry('/api/campaigns/with-guidelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Submissions
  getSubmissions: async (params?: { userId?: string; role?: string; brandId?: string; status?: string }): Promise<Submission[]> => {
    const q = new URLSearchParams();
    if (params?.userId) q.set('userId', params.userId);
    if (params?.role) q.set('role', params.role);
    if (params?.brandId) q.set('brandId', params.brandId);
    if (params?.status) q.set('status', params.status);
    const res = await fetchWithRetry(`/api/submissions?${q.toString()}`);
    return res.json();
  },
  getSubmission: async (id: string): Promise<Submission> => {
    const res = await fetchWithRetry(`/api/submissions/${id}`);
    return res.json();
  },
  createSubmission: async (data: any): Promise<Submission> => {
    const res = await fetchWithRetry('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create submission');
    }
    return res.json();
  },
  importCanvaSubmission: async (data: {
    canvaUrl: string;
    brandId?: string;
    userId?: string;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
    changelog?: string;
    title?: string;
  }): Promise<Submission> => {
    const res = await fetchWithRetry('/api/submissions/canva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || err.details || 'Failed to process Canva design');
    }
    return res.json();
  },
  archiveToGoogleDrive: async (
    submissionId: string,
    data?: { userId?: string; userName?: string }
  ): Promise<{ success: boolean; driveArchive: any; submission: Submission }> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/archive-drive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to archive submission to Drive');
    }
    return res.json();
  },
  confirmClaimIntent: async (
    submissionId: string,
    data: { parameterId?: string; userName?: string; action?: string; userId?: string }
  ): Promise<{ success: boolean; submission: Submission }> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/confirm-claim-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to confirm claim intent');
    }
    return res.json();
  },
  submitNewVersion: async (submissionId: string, data: any): Promise<Submission> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit new version');
    }
    return res.json();
  },

  // Manager Human Review
  reviewSubmission: async (
    submissionId: string,
    decision: 'APPROVED' | 'REQUEST_CHANGES' | 'REJECTED',
    reviewerId: string,
    reviewerName: string,
    comment?: string
  ): Promise<Submission> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, reviewerId, reviewerName, comment }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Review submission failed');
    }
    return res.json();
  },

  // Comments
  getComments: async (submissionId: string): Promise<SubmissionComment[]> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/comments`);
    return res.json();
  },
  addComment: async (submissionId: string, data: any): Promise<SubmissionComment> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Settings
  getSettings: async (): Promise<SystemSettings> => {
    const res = await fetchWithRetry('/api/settings');
    return res.json();
  },
  updateSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    const res = await fetchWithRetry('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  // Audit Logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await fetchWithRetry('/api/audit-logs');
    return res.json();
  },

  // Analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    const res = await fetchWithRetry('/api/analytics');
    return res.json();
  },
  // Review Velocity & Turnaround Stats
  getReviewVelocity: async (): Promise<ReviewVelocityStats> => {
    const res = await fetchWithRetry('/api/analytics/review-velocity');
    return res.json();
  },

  // Supervisor Workflows & Queue
  getSupervisors: async (): Promise<User[]> => {
    const res = await fetchWithRetry('/api/supervisors');
    return res.json();
  },

  assignSupervisorToCampaign: async (
    campaignId: string,
    supervisorId: string,
    adminId?: string,
    adminName?: string
  ): Promise<Campaign> => {
    const res = await fetchWithRetry(`/api/campaigns/${campaignId}/assign-supervisor`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supervisorId, adminId, adminName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to assign supervisor to campaign');
    }
    return res.json();
  },

  getSupervisorReviews: async (userId?: string): Promise<Submission[]> => {
    const url = userId ? `/api/supervisor/reviews?userId=${userId}` : '/api/supervisor/reviews';
    const res = await fetchWithRetry(url, {
      headers: userId ? { 'x-user-id': userId } : {},
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch supervisor review queue');
    }
    return res.json();
  },

  getSupervisorMetrics: async (): Promise<SupervisorMetric[]> => {
    const res = await fetchWithRetry('/api/admin/supervisor-metrics');
    return res.json();
  },

  getAiUsage: async (): Promise<{ logs: AIUsageLog[]; summary: any }> => {
    const res = await fetchWithRetry('/api/admin/ai-usage');
    return res.json();
  },

  analyzeSubmission: async (submissionId: string): Promise<Submission> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to analyze submission');
    }
    return res.json();
  },

  reworkSubmission: async (submissionId: string, data: any): Promise<Submission> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/rework`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit rework');
    }
    return res.json();
  },

  // Notifications
  getNotifications: async (userId?: string): Promise<AppNotification[]> => {
    const url = userId ? `/api/notifications?userId=${userId}` : '/api/notifications';
    const res = await fetchWithRetry(url);
    return res.json();
  },
  markNotificationRead: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetchWithRetry(`/api/notifications/${id}/read`, { method: 'PUT' });
    return res.json();
  },

  // Google Drive & Client Delivery Integration
  getDriveStatus: async (): Promise<DriveStatusResponse> => {
    const res = await fetchWithRetry('/api/drive/status');
    return res.json();
  },

  testDriveConnection: async (): Promise<any> => {
    const res = await fetchWithRetry('/api/drive/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  syncBrandToolkitToDrive: async (brandId: string, userId?: string, userName?: string): Promise<any> => {
    const res = await fetchWithRetry(`/api/brands/${brandId}/sync-drive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to sync brand toolkit to Google Drive');
    }
    return res.json();
  },

  prepareDeliveryPackage: async (
    submissionId: string,
    userId?: string,
    userName?: string
  ): Promise<{ success: boolean; deliveryPackage: DeliveryPackage; submission: Submission }> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/delivery-package`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to prepare delivery package');
    }
    return res.json();
  },

  dispatchDelivery: async (
    submissionId: string,
    payload: {
      channel?: string;
      recipientEmail?: string;
      recipientName?: string;
      deliveryMessage?: string;
      deliveryNotes?: string;
      sentBy?: string;
      sentByName?: string;
    }
  ): Promise<{ success: boolean; deliveryPackage: DeliveryPackage; submission: Submission }> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/dispatch-delivery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to dispatch delivery');
    }
    return res.json();
  },

  // Direct Client Share
  shareWithClient: async (
    submissionId: string,
    payload: {
      channel?: string;
      recipientEmail?: string;
      recipientName?: string;
      note?: string;
      sharedBy?: string;
      sharedByName?: string;
    }
  ): Promise<{ success: boolean; submission: Submission; shareRecord: any }> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/share-client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to share with client');
    }
    return res.json();
  },

  // Client Public Portal Feedback & Approval
  submitClientFeedback: async (
    submissionId: string,
    payload: {
      clientName: string;
      clientEmail?: string;
      decision: 'APPROVED' | 'CHANGES_REQUESTED';
      comment?: string;
    }
  ): Promise<{ success: boolean; submission: Submission; feedbackRecord: any }> => {
    const res = await fetchWithRetry(`/api/submissions/${submissionId}/client-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit client feedback');
    }
    return res.json();
  },
};


