// src/services/api.ts

import axios, { AxiosError, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
  validationItems?: any;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 422) {
      // Transform error to 422 but REJECT the promise
      const apiError = new Error(error.response.data?.message || 'Validation failed') as any;
      apiError.response = error.response;
      apiError.validationErrors = error.response.data?.errors;
      return Promise.reject(apiError);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    // Always REJECT so the tray/catch blocks always work
    return Promise.reject(error);
  }
);

export default api;