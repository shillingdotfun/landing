// src/services/apiClient.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject the token into each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Use localStorage to store the token
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    switch (error.response?.status) {
      case 422:
        return Promise.resolve({
          success: false,
          message: error.response.data?.message || 'Validation failed',
          errors: error.response.data?.errors || undefined,
        });
      case 401:
        localStorage.removeItem('token');
        return Promise.reject({
          success: false,
          message: error.response?.data?.message || 'Forbidden',
          errors: null,
        });
    }

    return Promise.resolve({
      success: false,
      message: error.response?.data?.message || 'Unexpected error',
      errors: null,
    });
  }
);

export default api;
