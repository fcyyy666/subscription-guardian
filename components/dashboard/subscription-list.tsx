'use client';

import Link from 'next/link';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { SubscriptionIcon } from '@/components/ui/subscription-icon';
import DeleteSubscriptionButton from '@/components/delete-subscription-button';
import { Sparkles, PauseCircle, PlayCircle } from 'lucide-react';
import { CURRENCY_SYMBOLS, CATEGORY_LABELS } from '@/lib/constants';
import { toggleSubscriptionStatus } from '@/actions/subscriptions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export interface SubscriptionItemType {
    id: string;
    name: string;
    amount: string;
    currency: string;
    billingCycle: string;
    category: string;
    nextPaymentDate: string;
    status: 'active' | 'paused' | 'cancelled';
    exchangeRate: string;
}

interface Props {
    subscriptions: SubscriptionItemType[];
}

function getMonthlyEquivalentDisplay(amount: string, currency: string, cycle: string) {
    if (cycle === 'monthly') return null;

    const raw = parseFloat(amount);
    let monthlyRaw = 0;
    switch (cycle) {
        case 'weekly': monthlyRaw = raw * (52 / 12); break;
        case 'yearly': monthlyRaw = raw / 12; break;
    }

    return `${CURRENCY_SYMBOLS[currency] ?? ''}${monthlyRaw.toFixed(2)}/月`;
}

/**
 * Calculates the CNY equivalent based on stored exchange rate.
 */
function getCNYEquivalent(amount: string, rate: string, currency: string) {
    if (currency === 'CNY') return null;
    const rawAmount = parseFloat(amount);
    const rawRate = parseFloat(rate);
    const cnyTotal = rawAmount * rawRate;
    return `¥${cnyTotal.toFixed(2)}`;
}

export function SubscriptionList({ subscriptions }: Props) {
    const todayStr = new Date().toISOString().split('T')[0];
    const router = useRouter();

    const handleToggleStatus = async (id: string, currentStatus: 'active' | 'paused' | 'cancelled') => {
        const result = await toggleSubscriptionStatus(id, currentStatus);
        if (result.error) {
            toast.error('❌ 操作失败', { description: '请重试，或检查网络连接。' });
        } else {
            if (currentStatus === 'active') {
                toast.success('⏸️ 已暂停', { description: '该项目暂时不再计入本月总支出。' });
            } else {
                toast.success('▶️ 已恢复', { description: '该项目将重新计入计算。' });
            }
            router.refresh();
        }
    };

    return (
        <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden overflow-x-auto">
            <div className="px-6 py-5 border-b border-zinc-50 flex justify-between items-center min-w-[600px] sm:min-w-0">
                <h3 className="text-lg font-semibold text-zinc-900">订阅列表</h3>
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">全部 {subscriptions.length} 项</span>
            </div>

            {subscriptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="rounded-full bg-zinc-50 p-6 mb-4 shadow-sm border border-zinc-100">
                        <Sparkles className="h-10 w-10 text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">开始你的订阅管理</h3>
                    <p className="mt-2 text-sm text-zinc-500 max-w-xs mx-auto mb-6">
                        添加第一个订阅，让消费更加透明。
                    </p>
                    <Link href="/dashboard/add">
                        <Button className="rounded-full bg-zinc-900 px-6 shadow-md hover:bg-zinc-800 transition-all">
                            添加订阅
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="divide-y divide-zinc-100 min-w-[600px] sm:min-w-0">
                    {subscriptions.map((sub) => {
                        const monthlyEquiv = getMonthlyEquivalentDisplay(sub.amount, sub.currency, sub.billingCycle);
                        const cnyDisplay = getCNYEquivalent(sub.amount, sub.exchangeRate, sub.currency);
                        const isPaused = sub.status === 'paused';
                        const isCancelled = sub.status === 'cancelled';

                        return (
                            <div
                                key={sub.id}
                                className={`group flex items-center justify-between p-5 transition-colors hover:bg-zinc-50/50 ${isPaused ? 'opacity-50 grayscale' : ''}`}
                            >
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="opacity-100">
                                        <SubscriptionIcon category={sub.category} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className="text-base font-bold text-zinc-900 truncate">{sub.name}</h4>
                                            <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                                                {CATEGORY_LABELS[sub.category] ?? sub.category}
                                            </span>
                                            {isPaused && (
                                                <span className="inline-flex items-center rounded-md bg-zinc-200 px-2 py-0.5 text-xs font-bold text-zinc-600">
                                                    已暂停
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                                            <span>
                                                下次扣款: {format(parseISO(sub.nextPaymentDate), 'yyyy-MM-dd')}
                                            </span>
                                            {!isPaused && !isCancelled && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                                                    <span className={sub.nextPaymentDate <= todayStr ? 'text-rose-500 font-medium' : ''}>
                                                        {formatDistanceToNow(parseISO(sub.nextPaymentDate), { addSuffix: true, locale: zhCN })}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 pl-4">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-zinc-900">
                                            {cnyDisplay ? (
                                                <span>{cnyDisplay}</span>
                                            ) : (
                                                <span>{CURRENCY_SYMBOLS[sub.currency] ?? ''}{sub.amount}</span>
                                            )}
                                            <span className="text-xs font-normal text-zinc-400 ml-1">
                                                /{sub.billingCycle === 'monthly' ? '月' : (sub.billingCycle === 'yearly' ? '年' : '周')}
                                            </span>
                                        </div>

                                        {cnyDisplay && sub.currency !== 'CNY' && (
                                            <div className="text-xs font-medium text-zinc-400">
                                                {sub.currency} {sub.amount}
                                            </div>
                                        )}

                                        {monthlyEquiv && !cnyDisplay && (
                                            <div className="text-xs font-medium text-emerald-600/80">
                                                ≈ {monthlyEquiv}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleToggleStatus(sub.id, sub.status)}
                                            className="h-8 w-8 text-zinc-400 hover:text-zinc-900"
                                            title={isPaused ? "恢复订阅" : "暂停订阅"}
                                        >
                                            {isPaused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                                        </Button>

                                        <Link href={`/dashboard/edit/${sub.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                                                <span className="sr-only">编辑</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                            </Button>
                                        </Link>
                                        <DeleteSubscriptionButton subscriptionId={sub.id} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
