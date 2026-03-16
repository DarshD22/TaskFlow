'use client';

import { Loader2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ConfirmDeleteProps {
  taskTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function ConfirmDelete({ taskTitle, onConfirm, onCancel }: ConfirmDeleteProps) {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      <div className="relative w-full max-w-sm card p-6 animate-slide-in shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Delete task?</h3>
            <p className="text-sm text-slate-400 mt-0.5">
              &ldquo;{taskTitle}&rdquo; will be permanently deleted.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={loading}
            className="btn-danger flex-1 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}