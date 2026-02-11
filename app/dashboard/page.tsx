import Link from 'next/link';
import { redirect } from 'next/navigation';
import { eq, and } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { SubscriptionList } from '@/components/dashboard/subscription-list';
import { toMonthlyCNY } from '@/lib/calculations';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch ALL subscriptions (active + paused) for the list
    const userSubscriptions = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id));

    // --- Stats Calculations ---
    // Only count ACTIVE subscriptions for totals/count
    const activeSubs = userSubscriptions.filter(sub => sub.status === 'active');

    const activeCount = activeSubs.length;
    const monthlyTotal = activeSubs.reduce(
        (sum, sub) => sum + toMonthlyCNY(sub.amount, sub.currency, sub.billingCycle, sub.exchangeRate),
        0
    );

    // 1. Find nearest upcoming payment (from active subs only)
    const todayStr = new Date().toISOString().split('T')[0];
    const futurePayments = activeSubs
        .filter(sub => sub.nextPaymentDate >= todayStr)
        .sort((a, b) => a.nextPaymentDate.localeCompare(b.nextPaymentDate));

    // Transform for component if needed, or pass full object
    // OverviewCards expects specific shape
    const nextPayment = futurePayments[0] ? {
        name: futurePayments[0].name,
        amount: futurePayments[0].amount,
        currency: futurePayments[0].currency,
        nextPaymentDate: futurePayments[0].nextPaymentDate,
    } : null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
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

            <OverviewCards
                monthlyTotal={monthlyTotal}
                activeCount={activeCount}
                nextPayment={nextPayment}
            />

            <SubscriptionList subscriptions={userSubscriptions} />
        </div>
    );
}
