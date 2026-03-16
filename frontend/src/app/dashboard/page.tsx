'use client';

import { useState } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Task, CreateTaskData } from '@/types';
import TaskCard from '@/components/tasks/TaskCard';
import TaskModal from '@/components/tasks/TaskModal';
import ConfirmDelete from '@/components/tasks/ConfirmDelete';
import FiltersBar from '@/components/tasks/FiltersBar';
import PaginationBar from '@/components/tasks/PaginationBar';
import TaskSkeleton from '@/components/tasks/TaskSkeleton';
import StatsCards from '@/components/tasks/StatsCards';

export default function DashboardPage() {
  const { user } = useAuth();

  const {
    tasks,
    pagination,
    isLoading,
    filters,
    updateFilters,
    setPage,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = useTasks({ limit: 10, sortOrder: 'desc' });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = async (data: CreateTaskData) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
  };

  const handleDelete = async () => {
    if (deletingTask) {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {pagination
              ? `You have ${pagination.total} task${pagination.total !== 1 ? 's' : ''} in total`
              : 'Loading your tasks…'}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New task</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Stats */}
      {pagination && (
        <StatsCards tasks={tasks} total={pagination.total} />
      )}

      {/* Filters */}
      <FiltersBar filters={filters} onChange={updateFilters} />

      {/* Task list */}
      <div>
        {isLoading ? (
          <TaskSkeleton />
        ) : tasks.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-700/60 flex items-center justify-center mb-4">
              <ClipboardList className="w-7 h-7 text-slate-500" />
            </div>
            <h3 className="font-semibold text-slate-300 mb-1">
              {filters.search || filters.status || filters.priority
                ? 'No tasks match your filters'
                : 'No tasks yet'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {filters.search || filters.status || filters.priority
                ? 'Try adjusting your search or filters'
                : 'Create your first task to get started'}
            </p>
            {!filters.search && !filters.status && !filters.priority && (
              <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5 animate-fade-in">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={(id) => {
                  const t = tasks.find((t) => t.id === id);
                  if (t) setDeletingTask(t);
                }}
                onToggle={toggleTask}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && !isLoading && tasks.length > 0 && (
          <div className="mt-4">
            <PaginationBar pagination={pagination} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modals */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {deletingTask && (
        <ConfirmDelete
          taskTitle={deletingTask.title}
          onConfirm={handleDelete}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
}