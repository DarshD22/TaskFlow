import { Request } from 'express';
import { TaskStatus, Priority } from '@prisma/client';

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateTaskBody {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
}

export interface UpdateTaskBody {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
}

export interface TaskQueryParams {
  page?: string;
  limit?: string;
  status?: TaskStatus;
  priority?: Priority;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}