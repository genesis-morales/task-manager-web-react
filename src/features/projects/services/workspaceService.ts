import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { Task, ProjectNote, ActivityEvent, PaginatedResponse } from '../types/workspace.types';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Accept': 'application/json',
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

// Tasks API
export const tasksApi = {
  list: (projectId: string, params?: { status?: string; priority?: string; page?: number; size?: number }) =>
    api.get<PaginatedResponse<Task>>(`/api/v1/projects/${projectId}/tasks`, { params }),

  create: (projectId: string, data: { title: string; description?: string; priority?: string }) =>
    api.post<Task>(`/api/v1/projects/${projectId}/tasks`, data),

  update: (taskId: string, data: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority'>>) =>
    api.patch<Task>(`/api/v1/tasks/${taskId}`, data),

  delete: (taskId: string) =>
    api.delete(`/api/v1/tasks/${taskId}`),
};

// Notes API
export const notesApi = {
  list: (projectId: string, params?: { type?: string; page?: number; size?: number }) =>
    api.get<PaginatedResponse<ProjectNote>>(`/api/v1/projects/${projectId}/notes`, { params }),

  create: (projectId: string, data: { content: string }) =>
    api.post<ProjectNote>(`/api/v1/projects/${projectId}/notes`, data),

  update: (noteId: string, data: { content?: string; note_type?: string }) =>
    api.patch<ProjectNote>(`/api/v1/notes/${noteId}`, data),

  delete: (noteId: string) =>
    api.delete(`/api/v1/notes/${noteId}`),

  convert: (noteId: string, targetType: 'TASK' | 'ARCHITECTURE_DECISION') =>
    api.post<{ message: string; created_entity_id?: string }>(`/api/v1/notes/${noteId}/convert`, { target_type: targetType }),
};

// Activity API (may not exist yet)
export const activityApi = {
  list: (projectId: string, params?: { page?: number; size?: number }) =>
    api.get<PaginatedResponse<ActivityEvent>>(`/api/v1/projects/${projectId}/activity`, { params }),
};
