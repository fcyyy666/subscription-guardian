import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
    activeCount?: number;
}

export default function DashboardHeader({ activeCount }: DashboardHeaderProps) {
    return (
        <div className="flex items-end justify-between">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">概览</h1>
                <p className="mt-2 text-zinc-500 font-medium">欢迎回来，这是你的订阅全貌</p>
            </div>
            <Link href="/dashboard/add">
                <Button className="h-10 rounded-full bg-zinc-900 px-6 font-semibold shadow-lg transition-transform hover:scale-105 hover:bg-zinc-800">
                    <Plus className="mr-1 h-4 w-4" /> 新建订阅
                </Button>
            </Link>
        </div>
    );
}
