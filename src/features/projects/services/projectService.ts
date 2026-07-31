import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  PaginatedResponse,
  ProjectsQueryParams,
} from '../types/project.types';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const projectApi = {
  list: (params?: ProjectsQueryParams) =>
    api.get<PaginatedResponse<Project>>('/api/v1/projects', { params }),

  getById: (id: string) =>
    api.get<Project>(`/api/v1/projects/${id}`),

  create: (data: CreateProjectRequest) =>
    api.post<Project>('/api/v1/projects', data),

  update: (id: string, data: UpdateProjectRequest) =>
    api.put<Project>(`/api/v1/projects/${id}`, data),

  delete: (id: string) =>
    api.delete(`/api/v1/projects/${id}`),
};
