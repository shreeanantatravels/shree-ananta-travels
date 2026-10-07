"use client";
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear user data on unauthorized
      localStorage.removeItem('ananda_user');
      localStorage.removeItem('ananda_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
