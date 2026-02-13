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
    // 4. Transform for component - Calculate Total in CNY for the nearest date
    let nextPayment = null;
    if (futurePayments.length > 0) {
        const nearestDate = futurePayments[0].nextPaymentDate;
        // Find all payments due on this same date
        const paymentsOnSameDay = futurePayments.filter(p => p.nextPaymentDate === nearestDate);
        
        // Sum their converted CNY amounts
        const totalCNY = paymentsOnSameDay.reduce((sum, p) => {
            const rate = p.exchangeRate ? parseFloat(p.exchangeRate) : 1; // Fallback to 1 if missing, though schema enforces it
            const amount = parseFloat(p.amount);
            return sum + (amount * rate);
        }, 0);

        // Determine display name
        const name = paymentsOnSameDay.length > 1 
            ? `${paymentsOnSameDay[0].name} 等 ${paymentsOnSameDay.length} 项`
            : paymentsOnSameDay[0].name;

        nextPayment = {
            name: name,
            amount: totalCNY.toFixed(2),
            currency: 'CNY', // Force CNY as requested
            nextPaymentDate: nearestDate,
        };
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">概览</h1>
                    <p className="mt-2 text-zinc-500 font-medium">欢迎回来，这是你的订阅全貌</p>
                </div>
                <Link href="/dashboard/add">
                    <Button className="w-full sm:w-auto h-10 rounded-full bg-zinc-900 px-6 font-semibold shadow-lg transition-transform hover:scale-105 hover:bg-zinc-800">
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
