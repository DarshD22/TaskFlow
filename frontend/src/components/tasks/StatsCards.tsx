
'use client';

import { Task } from '@/types';
import { CheckCircle2, Clock, Loader, AlertCircle } from 'lucide-react';

interface StatsCardsProps {
  tasks: Task[];
  total: number;
}

export default function StatsCards({ tasks, total }: StatsCardsProps) {
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const high = tasks.filter((t) => t.priority === 'HIGH' && t.status !== 'COMPLETED').length;

  const stats = [
    {
      label: 'Total tasks',
      value: total,
      icon: Clock,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'In progress',
      value: inProgress,
      icon: Loader,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'High priority',
      value: high,
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">{s.label}</span>
            <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{s.value}</p>
        </div>
      ))}
    </div>
  );
}