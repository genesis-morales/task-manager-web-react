export type ProjectColor =| "blue"|"purple"|"green"|"orange"|"red"|"pink";

export type ViewMode = "grid" | "list";

export type SortOption = "name" | "date" | "tasks";

export interface Project {
  id: string;
  name: string;
  description: string;
  color: ProjectColor;
  taskCount: number;
  lastUpdated: string;
  createdAt: string;
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export interface ProjectFormValues {
  name: string;
  description?: string;
  color: ProjectColor;
}

// ─── Components ───────────────────────────────────────────────────────────────

export interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => void;
  loading?: boolean;
  initialValues?: Partial<Project>;
}

export interface ProjectColorPickerProps {
  value?: ProjectColor;
  onChange?: (color: ProjectColor) => void;
}
