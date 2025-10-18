// src/services/activity.service.ts

import { Activity } from '../types/activity.types';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { api } from './api';

export const activityService = {
  async getLatest(limit = 20): Promise<ApiResponse<Activity[]>> {
    return api.get('/activities/latest', { limit });
  },

  async getStream(params?: {
    page?: number;
    perPage?: number;
    type?: string;
    campaignId?: string;
  }): Promise<PaginatedResponse<Activity>> {
    return api.get('/activities', params);
  },
};