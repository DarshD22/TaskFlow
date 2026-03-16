'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { CheckSquare, LayoutDashboard, LogOut, User } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-56 lg:w-64 bg-slate-900/80 border-b md:border-b-0 md:border-r border-slate-800 flex md:flex-col shrink-0">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-5 py-4 md:py-5 border-b border-slate-800"
        >
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-md shadow-sky-500/30">
            <CheckSquare className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white tracking-tight">TaskFlow</span>
        </Link>

        {/* Nav */}
        <nav className="flex md:flex-col gap-1 p-3 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium
                       text-sky-400 bg-sky-500/10 hover:bg-sky-500/15 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
        </nav>

        {/* User */}
        <div className="hidden md:block border-t border-slate-800 p-3">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                       text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-1"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}