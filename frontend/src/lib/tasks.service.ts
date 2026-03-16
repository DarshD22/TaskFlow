import api from './api';
import { Task, PaginatedTasks, TaskFilters, CreateTaskData, UpdateTaskData } from '@/types';

export const tasksService = {
  async getTasks(filters: TaskFilters = {}): Promise<PaginatedTasks> {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.page) params.page = String(filters.page);
    if (filters.limit) params.limit = String(filters.limit);
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    const res = await api.get('/tasks', { params });
    return res.data.data as PaginatedTasks;
  },

  async getTask(id: string): Promise<Task> {
    const res = await api.get(`/tasks/${id}`);
    return res.data.data as Task;
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const res = await api.post('/tasks', data);
    return res.data.data as Task;
  },

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    const res = await api.patch(`/tasks/${id}`, data);
    return res.data.data as Task;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggleTask(id: string): Promise<Task> {
    const res = await api.post(`/tasks/${id}/toggle`);
    return res.data.data as Task;
  },
};