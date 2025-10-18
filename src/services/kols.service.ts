// src/services/kols.service.ts

import { PaginatedResponse, ApiResponse } from '../types/api.types';
import { KOL, KOLStats } from '../types/kol.types';
import { api } from './api';

export const kolsService = {
  async getLeaderboard(params?: {
    page?: number;
    perPage?: number;
    sortBy?: 'karma' | 'earnings' | 'successRate' | 'reach';
  }): Promise<PaginatedResponse<KOL>> {
    return api.get('/kols/leaderboard', params);
  },

  async getById(id: string): Promise<ApiResponse<KOL>> {
    return api.get(`/kols/${id}`);
  },

  async getByUsername(username: string): Promise<ApiResponse<KOL>> {
    return api.get(`/kols/username/${username}`);
  },

  async getStats(id: string): Promise<ApiResponse<KOLStats>> {
    return api.get(`/kols/${id}/stats`);
  },

  async getCampaigns(id: string): Promise<ApiResponse<any[]>> {
    return api.get(`/kols/${id}/campaigns`);
  },

  async getActivities(id: string, page?: number): Promise<PaginatedResponse<any>> {
    return api.get(`/kols/${id}/activities`, { page });
  },
};
