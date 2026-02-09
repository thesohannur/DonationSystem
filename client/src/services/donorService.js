import api from './api';

export const donorService = {
  // Get donor profile
  getMyProfile: async () => {
    const response = await api.get('/donors/me');
    return response.data;
  },

  // Update donor profile
  updateMyProfile: async (data) => {
    const response = await api.patch('/donors/me', data);
    return response.data;
  },

  // Get donor statistics
  getMyStats: async () => {
    const response = await api.get('/donors/me/stats');
    return response.data;
  },

  // Get donation history
  getMyDonations: async () => {
    const response = await api.get('/donors/me/donations');
    return response.data;
  },

  // Get active campaigns
  getActiveCampaigns: async () => {
    const response = await api.get('/campaigns/active');
    return response.data;
  },

  // Get filtered campaigns
  getFilteredCampaigns: async (filters) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/campaigns/filter?${params}`);
    return response.data;
  },

  // Get campaign by ID
  getCampaign: async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  // Create donation
  createDonation: async (donationData) => {
    const response = await api.post('/payments/donate', donationData);
    return response.data;
  },
};