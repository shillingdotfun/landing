// src/services/kols.service.ts

import { PaginatedResponse, ApiResponse } from '../types/api.types';
import { KOL, KOLStats } from '../types/kol.types';
import api from './api';

export const kolsService = {
  async getLeaderboard(params?: {
    page?: number;
    perPage?: number;
    sortBy?: 'karma' | 'earnings' | 'successRate' | 'reach';
  }): Promise<PaginatedResponse<KOL>> {
    return await api.get('/kols/leaderboard', params as any);
  },

  async getById(id: string): Promise<ApiResponse<KOL>> {
    return await api.get(`/kols/${id}`);
  },

  async getByUsername(username: string): Promise<ApiResponse<KOL>> {
    return await api.get(`/kols/username/${username}`);
  },

  async getStats(id: string): Promise<ApiResponse<KOLStats>> {
    return await api.get(`/kols/${id}/stats`);
  },

  async getCampaigns(id: string): Promise<ApiResponse<any[]>> {
    return await api.get(`/kols/${id}/campaigns`);
  },

  async getActivities(id: string, page?: number): Promise<PaginatedResponse<any>> {
    return await api.get(`/kols/${id}/activities`, { page } as any);
  },
};
