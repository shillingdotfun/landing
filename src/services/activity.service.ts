// src/services/activity.service.ts

import api from './api';
import { Activity } from '../types/activity.types';
import { ApiResponse, PaginatedResponse } from '../types/api.types';


export const activityService = {
  async getLatest(limit = 20): Promise<ApiResponse<Activity[]>> {
    return (await api.get('/activities/latest', { limit } as any)).data;
  },

  async getStream(params?: {
    page?: number;
    perPage?: number;
    type?: string;
    campaignId?: string;
  }): Promise<PaginatedResponse<Activity>> {
    return (await api.get('/activities', params as any)).data;
  },
};