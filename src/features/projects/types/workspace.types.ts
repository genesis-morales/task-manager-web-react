// ============================================
// Workspace Types — Tasks, Notes, Activity
// ============================================

// Tasks
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  source_note_id: string | null;
  created_at: string;
  updated_at: string;
}

// Notes
export type NoteType = 'RAW' | 'TASK' | 'ARCHITECTURE_DECISION';

export interface ProjectNote {
  id: string;
  project_id: string;
  content: string;
  note_type: NoteType;
  is_enriched: boolean;
  created_at: string;
  updated_at: string;
}

// Activity (if endpoint exists)
export interface ActivityEvent {
  id: string;
  project_id: string;
  event_type: string;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// Paginated
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
