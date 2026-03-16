'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, PaginatedTasks, TaskFilters } from '@/types';
import { tasksService } from '@/lib/tasks.service';
import toast from 'react-hot-toast';

export function useTasks(initialFilters: TaskFilters = {}) {
  const [data, setData] = useState<PaginatedTasks | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 10, ...initialFilters });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetch = useCallback(async (f: TaskFilters) => {
    setIsLoading(true);
    try {
      const result = await tasksService.getTasks(f);
      setData(result);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(filters);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, fetch]);

  const updateFilters = useCallback((updates: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const createTask = useCallback(
    async (taskData: Parameters<typeof tasksService.createTask>[0]) => {
      const task = await tasksService.createTask(taskData);
      toast.success('Task created!');
      fetch(filters);
      return task;
    },
    [fetch, filters]
  );

  const updateTask = useCallback(
    async (id: string, taskData: Parameters<typeof tasksService.updateTask>[1]) => {
      const task = await tasksService.updateTask(id, taskData);
      toast.success('Task updated!');
      setData((prev) =>
        prev
          ? { ...prev, items: prev.items.map((t) => (t.id === id ? task : t)) }
          : prev
      );
      return task;
    },
    []
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await tasksService.deleteTask(id);
      toast.success('Task deleted');
      fetch(filters);
    },
    [fetch, filters]
  );

  const toggleTask = useCallback(async (id: string) => {
    const task = await tasksService.toggleTask(id);
    toast.success(`Marked as ${task.status.toLowerCase().replace('_', ' ')}`);
    setData((prev) =>
      prev
        ? { ...prev, items: prev.items.map((t) => (t.id === id ? task : t)) }
        : prev
    );
    return task;
  }, []);

  return {
    tasks: data?.items ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    filters,
    updateFilters,
    setPage,
    refetch: () => fetch(filters),
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}