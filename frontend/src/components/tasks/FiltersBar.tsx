'use client';

import { useCallback } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { TaskFilters, TaskStatus, Priority } from '@/types';
import { cn } from '@/lib/utils';

interface FiltersBarProps {
  filters: TaskFilters;
  onChange: (updates: Partial<TaskFilters>) => void;
}

const STATUS_OPTIONS: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const PRIORITY_OPTIONS: { value: Priority | ''; label: string }[] = [
  { value: '', label: 'All priorities' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date created' },
  { value: 'updatedAt', label: 'Last updated' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'title', label: 'Title' },
  { value: 'priority', label: 'Priority' },
];

export default function FiltersBar({ filters, onChange }: FiltersBarProps) {
  const hasActiveFilters =
    !!filters.search || !!filters.status || !!filters.priority;

  const clearFilters = useCallback(() => {
    onChange({ search: '', status: '', priority: '' });
  }, [onChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="search"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search tasks…"
          className="input pl-9 pr-8"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ search: '' })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        value={filters.status ?? ''}
        onChange={(e) => onChange({ status: e.target.value as TaskStatus | '' })}
        className={cn(
          'input w-full sm:w-40',
          filters.status && 'border-sky-500/50 text-sky-300'
        )}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Priority filter */}
      <select
        value={filters.priority ?? ''}
        onChange={(e) => onChange({ priority: e.target.value as Priority | '' })}
        className={cn(
          'input w-full sm:w-40',
          filters.priority && 'border-sky-500/50 text-sky-300'
        )}
      >
        {PRIORITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Sort */}
      <div className="flex items-center gap-1.5">
        <select
          value={filters.sortBy ?? 'createdAt'}
          onChange={(e) => onChange({ sortBy: e.target.value })}
          className="input w-full sm:w-40"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          title="Toggle sort order"
          onClick={() => onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
          className={cn(
            'btn-ghost px-2 py-2 border border-slate-700 rounded-lg',
            filters.sortOrder === 'asc' && 'text-sky-400'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button onClick={clearFilters} className="btn-ghost text-xs whitespace-nowrap flex items-center gap-1.5">
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}