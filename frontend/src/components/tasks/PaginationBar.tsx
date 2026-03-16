'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination } from '@/types';
import { cn } from '@/lib/utils';

interface PaginationBarProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export default function PaginationBar({ pagination, onPageChange }: PaginationBarProps) {
  const { page, totalPages, total, limit, hasPrev, hasNext } = pagination;

  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Build page numbers to show
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
      <p className="text-xs text-slate-500">
        Showing {start}–{end} of {total} tasks
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="btn-ghost px-2 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-500 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                p === page
                  ? 'bg-sky-500 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="btn-ghost px-2 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}