'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { subscriptionFormSchema } from '@/lib/validations';
import { getExchangeRate } from '@/actions/exchange';

import { calculateNextPaymentDate, EXCHANGE_RATES } from '@/lib/calculations';

/** Return type for action results with error handling */
type ActionResult = { error?: string; success?: boolean };

/**
 * Retrieves the authenticated user's ID or throws a redirect to login.
 */
async function getAuthenticatedUserId(): Promise<string> {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    return user.id;
}

// Helper to get rate
// Helper to get rate
async function determineExchangeRate(currency: string): Promise<number> {
    if (currency === 'CNY') return 1.0;

    // Try to fetch real-time rate
    const rate = await getExchangeRate(currency, 'CNY');
    if (rate) return rate;

    // Fallback to hardcoded constants if API fails
    console.warn(`Exchange rate API failed for ${currency}, using fallback.`);
    return EXCHANGE_RATES[currency] ?? 1.0;
}

// ... createSubscription ...
export async function createSubscription(formData: FormData): Promise<ActionResult> {
    const userId = await getAuthenticatedUserId();

    const rawData = {
        name: formData.get('name') as string,
        amount: formData.get('amount') as string,
        currency: formData.get('currency') as string,
        billingCycle: formData.get('billingCycle') as string,
        startDate: formData.get('startDate') as string,
        category: formData.get('category') as string,
    };

    const parsed = subscriptionFormSchema.safeParse(rawData);
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { name, amount, currency, billingCycle, startDate, category } = parsed.data;
    const nextPaymentDate = calculateNextPaymentDate(startDate, billingCycle);
    const exchangeRate = await determineExchangeRate(currency);

    try {
        await db.insert(subscriptions).values({
            userId,
            name,
            amount,
            currency,
            exchangeRate: exchangeRate.toString(), // DB expects decimal/numeric
            billingCycle,
            startDate,
            nextPaymentDate,
            category,
            status: 'active',
        });
    } catch (err) {
        console.error('Failed to create subscription:', err);
        return { error: '创建订阅失败，请稍后重试。' };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

// ... updateSubscription ...
export async function updateSubscription(
    subscriptionId: string,
    formData: FormData
): Promise<ActionResult> {
    const userId = await getAuthenticatedUserId();

    const rawData = {
        name: formData.get('name') as string,
        amount: formData.get('amount') as string,
        currency: formData.get('currency') as string,
        billingCycle: formData.get('billingCycle') as string,
        startDate: formData.get('startDate') as string,
        category: formData.get('category') as string,
    };

    const parsed = subscriptionFormSchema.safeParse(rawData);
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { name, amount, currency, billingCycle, startDate, category } = parsed.data;
    const nextPaymentDate = calculateNextPaymentDate(startDate, billingCycle);

    // Always refresh rate on update to ensure it's current, or at least if currency changed
    const exchangeRate = await determineExchangeRate(currency);

    try {
        const result = await db
            .update(subscriptions)
            .set({
                name,
                amount,
                currency,
                exchangeRate: exchangeRate.toString(),
                billingCycle,
                startDate,
                nextPaymentDate,
                category,
            })
            .where(
                and(
                    eq(subscriptions.id, subscriptionId),
                    eq(subscriptions.userId, userId)
                )
            )
            .returning({ updatedId: subscriptions.id });

        if (result.length === 0) {
            return { error: '未找到该订阅或无权修改。' };
        }
    } catch (err) {
        console.error('Failed to update subscription:', err);
        return { error: '更新订阅失败，请稍后重试。' };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

/**
 * Toggles subscription status between 'active' and 'paused'.
 */
export async function toggleSubscriptionStatus(
    subscriptionId: string,
    currentStatus: 'active' | 'paused' | 'cancelled'
): Promise<ActionResult> {
    const userId = await getAuthenticatedUserId();
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';

    try {
        const result = await db
            .update(subscriptions)
            .set({ status: newStatus })
            .where(
                and(
                    eq(subscriptions.id, subscriptionId),
                    eq(subscriptions.userId, userId)
                )
            )
            .returning({ updatedId: subscriptions.id });

        if (result.length === 0) {
            return { error: '未找到该订阅或无权修改。' };
        }
    } catch (err) {
        console.error('Failed to toggle status:', err);
        return { error: '操作失败，请稍后重试。' };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

/**
 * Deletes a subscription owned by the authenticated user (hard delete).
 */
export async function deleteSubscription(subscriptionId: string): Promise<ActionResult> {
    const userId = await getAuthenticatedUserId();

    try {
        await db
            .delete(subscriptions)
            .where(
                and(
                    eq(subscriptions.id, subscriptionId),
                    eq(subscriptions.userId, userId)
                )
            );
    } catch (err) {
        console.error('Failed to delete subscription:', err);
        return { error: '删除订阅失败，请稍后重试。' };
    }

    revalidatePath('/dashboard');
    return { success: true };
}
