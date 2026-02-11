import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Sparkles, CreditCard } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CURRENCY_SYMBOLS } from '@/lib/constants';

interface OverviewCardsProps {
    monthlyTotal: number;
    activeCount: number;
    nextPayment: {
        name: string;
        amount: string;
        currency: string;
        nextPaymentDate: string;
    } | null;
}

export function OverviewCards({ monthlyTotal, activeCount, nextPayment }: OverviewCardsProps) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Monthly Total */}
            <Card className="relative overflow-hidden border border-zinc-100 bg-white shadow-sm transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-zinc-500">月度总支出 (CNY)</CardTitle>
                    <div className="rounded-full bg-blue-50 p-2">
                        <Wallet className="h-4 w-4 text-blue-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold tracking-tight text-zinc-900">
                        ¥{monthlyTotal.toFixed(2)}
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">基于当前汇率估算</p>
                </CardContent>
            </Card>

            {/* Active Subscriptions */}
            <Card className="relative overflow-hidden border border-zinc-100 bg-white shadow-sm transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-zinc-500">活跃订阅</CardTitle>
                    <div className="rounded-full bg-emerald-50 p-2">
                        <Sparkles className="h-4 w-4 text-emerald-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-extrabold tracking-tight text-zinc-900">
                        {activeCount}
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">正在生效的服务</p>
                </CardContent>
            </Card>

            {/* Next Payment */}
            <Card className="relative overflow-hidden border border-zinc-100 bg-white shadow-sm transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-zinc-500">下一笔扣款</CardTitle>
                    <div className="rounded-full bg-rose-50 p-2">
                        <CreditCard className="h-4 w-4 text-rose-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    {nextPayment ? (
                        <div>
                            <div className="text-3xl font-extrabold tracking-tight text-zinc-900 truncate">
                                {CURRENCY_SYMBOLS[nextPayment.currency] ?? nextPayment.currency}{nextPayment.amount}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-600">
                                <span className="truncate max-w-[100px]">{nextPayment.name}</span>
                                <span className="text-zinc-300">•</span>
                                <span className="text-rose-600">
                                    {formatDistanceToNow(parseISO(nextPayment.nextPaymentDate), { addSuffix: true, locale: zhCN })}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-xl font-medium text-zinc-400 py-2">暂无待付 🎉</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
