'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { Task, CreateTaskData } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(2000).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TaskModalProps {
  task?: Task | null;
  onClose: () => void;
  onSave: (data: CreateTaskData) => Promise<void>;
}

export default function TaskModal({ task, onClose, onSave }: TaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    } else {
      reset({ title: '', description: '', status: 'PENDING', priority: 'MEDIUM', dueDate: '' });
    }
  }, [task, reset]);

  const onSubmit = async (data: FormData) => {
    await onSave({
      ...data,
      dueDate: data.dueDate || undefined,
      description: data.description || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="relative w-full max-w-lg card p-6 animate-slide-in shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">
            {task ? 'Edit task' : 'New task'}
          </h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Title */}
          <div>
            <label className="label">Title <span className="text-red-400">*</span></label>
            <input {...register('title')} className="input" placeholder="What needs to be done?" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              {...register('description')}
              className="input resize-none"
              placeholder="Add more details…"
              rows={3}
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input">
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select {...register('priority')} className="input">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="label">Due date</label>
            <input {...register('dueDate')} type="date" className="input" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : task ? (
                'Save changes'
              ) : (
                'Create task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}