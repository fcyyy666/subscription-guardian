import { redirect, notFound } from 'next/navigation';
import { eq, and } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { updateSubscription } from '@/actions/subscriptions';
import SubscriptionForm from '@/components/subscription-form';

interface EditSubscriptionPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditSubscriptionPage({ params }: EditSubscriptionPageProps) {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch the subscription (with ownership check)
    const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(
            and(
                eq(subscriptions.id, id),
                eq(subscriptions.userId, user.id)
            )
        )
        .limit(1);

    if (!subscription) {
        notFound();
    }

    // Bind the subscription ID to the update action
    const updateAction = updateSubscription.bind(null, subscription.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">编辑订阅</h1>
                <p className="mt-1 text-sm text-slate-500">修改 {subscription.name} 的订阅信息</p>
            </div>
            <SubscriptionForm
                defaultValues={{
                    name: subscription.name,
                    amount: subscription.amount,
                    currency: subscription.currency,
                    billingCycle: subscription.billingCycle,
                    startDate: subscription.startDate,
                    category: subscription.category,
                }}
                action={updateAction}
                title="修改订阅"
                description="更新订阅信息后，系统将重新计算下次扣款日期。"
            />
        </div>
    );
}
