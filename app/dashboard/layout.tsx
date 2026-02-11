import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="relative min-h-screen bg-slate-50/50">
            {/* 2. Magic Touch: Tweak the glow position and color */}
            <div className="absolute top-0 left-1/2 -ml-[40rem] -mt-10 h-[30rem] w-[80rem] -translate-x-1/2 rounded-full bg-zinc-500/10 blur-3xl opacity-50" />

            {/* Top Navigation Bar - with updated Logo */}
            <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* 1. Logo Upgrade - Unified Black */}
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm transition-transform group-hover:scale-105">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-zinc-900 transition-colors">
                            订阅卫士
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden items-center gap-6 sm:flex">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                        >
                            概览
                        </Link>
                        <Link
                            href="/dashboard/add"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                        >
                            添加订阅
                        </Link>
                    </nav>

                    {/* User Area */}
                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-slate-500/80 sm:inline">
                            {user.email}
                        </span>
                        <form action={async () => { 'use server'; await logout(); }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                            >
                                退出
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* 3. Layout Constraints: max-w-6xl */}
            <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
