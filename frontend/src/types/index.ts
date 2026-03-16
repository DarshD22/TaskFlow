export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedTasks {
  items: Task[];
  pagination: Pagination;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface TaskFilters {
  status?: TaskStatus | '';
  priority?: Priority | '';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}