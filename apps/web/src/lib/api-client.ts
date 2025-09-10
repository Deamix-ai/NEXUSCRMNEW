// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Leads
  async getLeads(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return this.request(`/leads${query ? `?${query}` : ''}`);
  }

  async getLeadStats() {
    return this.request('/leads/stats');
  }

  async createLead(data: any) {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLead(id: string, data: any) {
    return this.request(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: string) {
    return this.request(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  // Clients
  async getClients(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return this.request(`/clients${query ? `?${query}` : ''}`);
  }

  async getClientStats() {
    return this.request('/clients/stats');
  }

  async createClient(data: any) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClient(id: string, data: any) {
    return this.request(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteClient(id: string) {
    return this.request(`/clients/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Convenience exports
export const dashboardApi = {
  getStats: () => apiClient.getDashboardStats(),
};

export const leadsApi = {
  getAll: (params?: Parameters<typeof apiClient.getLeads>[0]) => 
    apiClient.getLeads(params),
  getStats: () => apiClient.getLeadStats(),
  create: (data: any) => apiClient.createLead(data),
  update: (id: string, data: any) => apiClient.updateLead(id, data),
  delete: (id: string) => apiClient.deleteLead(id),
};

export const clientsApi = {
  getAll: (params?: Parameters<typeof apiClient.getClients>[0]) => 
    apiClient.getClients(params),
  getStats: () => apiClient.getClientStats(),
  create: (data: any) => apiClient.createClient(data),
  update: (id: string, data: any) => apiClient.updateClient(id, data),
  delete: (id: string) => apiClient.deleteClient(id),
};
