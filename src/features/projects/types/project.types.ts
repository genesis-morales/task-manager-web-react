// ============================================
// Project Types — aligned with backend API
// ============================================

export interface Project {
  id: string;
  name: string;
  description: string;
  github_repo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  github_repo_url?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  github_repo_url?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface ProjectsQueryParams {
  page?: number;
  size?: number;
}
