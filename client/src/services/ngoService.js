import api from './api';

export const ngoService = {
  getMyProfile: async () => {
    const response = await api.get('/ngos/me');
    return response.data;
  },

  updateMyProfile: async (data) => {
    const response = await api.patch('/ngos/me', data);
    return response.data;
  },

  uploadProfilePicture: async (imageBase64) => {
    const response = await api.patch('/ngos/me/profile-picture', { image: imageBase64 });
    return response.data;
  },

  removeProfilePicture: async () => {
    const response = await api.delete('/ngos/me/profile-picture');
    return response.data;
  },

  getMyStats: async () => {
    const response = await api.get('/ngos/me/stats');
    return response.data;
  },

  getMyCampaigns: async () => {
    const response = await api.get('/ngos/me/campaigns');
    return response.data;
  },

  getMyDonations: async () => {
    const response = await api.get('/ngos/me/donations');
    return response.data;
  },

  getMyVolunteers: async () => {
    const response = await api.get('/ngos/me/volunteers');
    return response.data;
  },

  createCampaign: async (data) => {
    const response = await api.post('/campaigns', data);
    return response.data;
  },

  updateCampaign: async (campaignId, data) => {
    const response = await api.patch(`/campaigns/${campaignId}`, data);
    return response.data;
  },

  deleteCampaign: async (campaignId) => {
    const response = await api.delete(`/campaigns/${campaignId}`);
    return response.data;
  },

  updateVolunteerStatus: async (volunteerId, data) => {
    const response = await api.patch(`/volunteers/${volunteerId}`, data);
    return response.data;
  },
};
