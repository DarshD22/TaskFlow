'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { CheckCircle2, Circle, Clock, Edit2, Trash2, AlertCircle, Calendar } from 'lucide-react';
import { format, isValid, parseISO, isPast } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const PRIORITY_CONFIG = {
  HIGH:   { label: 'High',   className: 'bg-red-500/15 text-red-400 border-red-500/20' },
  MEDIUM: { label: 'Medium', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  LOW:    { label: 'Low',    className: 'bg-green-500/15 text-green-400 border-green-500/20' },
};

const STATUS_CONFIG = {
  PENDING:     { label: 'Pending',     className: 'bg-slate-500/20 text-slate-400' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-sky-500/20 text-sky-400' },
  COMPLETED:   { label: 'Completed',   className: 'bg-green-500/20 text-green-400' },
};

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isCompleted = task.status === 'COMPLETED';
  const priority = PRIORITY_CONFIG[task.priority];
  const status = STATUS_CONFIG[task.status];

  const dueDate = task.dueDate ? parseISO(task.dueDate) : null;
  const isOverdue = dueDate && isValid(dueDate) && isPast(dueDate) && !isCompleted;

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggle(task.id); } finally { setToggling(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await onDelete(task.id); } finally { setDeleting(false); }
  };

  return (
    <div
      className={cn(
        'card p-4 group transition-all duration-200 hover:border-slate-600/60 hover:shadow-lg hover:shadow-black/20',
        isCompleted && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Toggle button */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className="mt-0.5 shrink-0 text-slate-500 hover:text-sky-400 transition-colors disabled:opacity-50"
          title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : toggling ? (
            <Circle className="w-5 h-5 animate-pulse" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'font-medium text-slate-100 text-sm leading-snug',
                isCompleted && 'line-through text-slate-500'
              )}
            >
              {task.title}
            </h3>

            {/* Actions — appear on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="btn-ghost p-1.5 text-slate-400 hover:text-sky-400"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-ghost p-1.5 text-slate-400 hover:text-red-400 disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
          )}

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-2 mt-2.5">
            {/* Status */}
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', status.className)}>
              {status.label}
            </span>

            {/* Priority */}
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium border',
                priority.className
              )}
            >
              {priority.label}
            </span>

            {/* Due date */}
            {dueDate && isValid(dueDate) && (
              <span
                className={cn(
                  'text-xs flex items-center gap-1',
                  isOverdue ? 'text-red-400' : 'text-slate-500'
                )}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <Calendar className="w-3 h-3" />
                )}
                {format(dueDate, 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}