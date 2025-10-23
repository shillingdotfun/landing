// src/services/campaigns.service.ts

import { PaginatedResponse, ApiResponse } from '../types/api.types';
import { Campaign, CreateCampaignDTO } from '../types/campaign.types';
import api from './api';


export const campaignsService = {
  async getAll(params?: {
    page?: number;
    perPage?: number;
    status?: string;
    type?: string;
    sort?: string;
  }): Promise<PaginatedResponse<Campaign>> {
    return api.get('/campaigns', params as any);
  },

  async getById(id: string): Promise<ApiResponse<Campaign>> {
    return await api.get(`/campaigns/${id}`);
  },

  async getPublicById(id: string): Promise<ApiResponse<Campaign>> {
    return await api.get(`/public/campaigns/${id}`);
  },

  async getActive(): Promise<ApiResponse<Campaign[]>> {
    return await api.get('/campaigns/active');
  },

  async getPublicActive(): Promise<ApiResponse<Campaign[]>> {
    return await api.get('/public/campaigns/active');
  },

  async create(data: CreateCampaignDTO): Promise<ApiResponse<Campaign>> {
    return await api.post('/campaigns', data);
  },

  async join(campaignId: string): Promise<ApiResponse<any>> {
    return await api.post(`/campaigns/${campaignId}/join`);
  },

  async getParticipants(campaignId: string): Promise<ApiResponse<any[]>> {
    return await api.get(`/campaigns/${campaignId}/participants`);
  },

  async getActivities(campaignId: string): Promise<ApiResponse<any[]>> {
    return await api.get(`/campaigns/${campaignId}/activities`);
  },
};