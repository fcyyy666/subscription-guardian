'use client';

import { useState, useEffect } from 'react';
import { getExchangeRate } from '@/actions/exchange';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { subscriptionFormSchema, type SubscriptionFormValues } from '@/lib/validations';
import { calculateNextPaymentDate } from '@/lib/calculations';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SubscriptionFormProps {
    /** Pre-fill for edit mode */
    defaultValues?: Partial<SubscriptionFormValues>;
    /** Server action to call on submit */
    action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
    /** Card heading */
    title: string;
    /** Card description */
    description: string;
}

/**
 * Shared subscription form component used by both Add and Edit pages.
 * Uses react-hook-form + Zod for client-side validation, and includes
 * a live preview of the calculated next payment date.
 */
export default function SubscriptionForm({
    defaultValues,
    action,
    title,
    description,
}: SubscriptionFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SubscriptionFormValues>({
        resolver: zodResolver(subscriptionFormSchema),
        defaultValues: {
            name: '',
            amount: '',
            currency: 'CNY',
            billingCycle: 'monthly',
            startDate: '',
            category: 'Tools',
            ...defaultValues,
        },
    });


    // ... existing imports ...

    // Inside component:
    const [conversion, setConversion] = useState<{ total: string; rate: number } | null>(null);

    const watchStartDate = watch('startDate');
    const watchBillingCycle = watch('billingCycle');
    const watchAmount = watch('amount');
    const watchCurrency = watch('currency');

    useEffect(() => {
        if (!watchAmount || !watchCurrency || watchCurrency === 'CNY') {
            setConversion(null);
            return;
        }

        const timer = setTimeout(async () => {
            const numAmount = parseFloat(watchAmount);
            if (isNaN(numAmount)) return;

            const rate = await getExchangeRate(watchCurrency, 'CNY');
            if (rate) {
                setConversion({
                    total: (numAmount * rate).toFixed(2),
                    rate,
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [watchAmount, watchCurrency]);

    /** Live preview of the next payment date */
    const nextPaymentPreview = useMemo(() => {
        if (!watchStartDate || isNaN(Date.parse(watchStartDate))) return null;
        return calculateNextPaymentDate(watchStartDate, watchBillingCycle);
    }, [watchStartDate, watchBillingCycle]);

    const router = useRouter();

    const onSubmit = async (data: SubscriptionFormValues) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Optimistic UI handled by isSubmitting
        const result = await action(formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success('订阅已保存');
            router.push('/dashboard');
        }
    };

    const currencyOptions = [
        { value: 'CNY', label: '¥ 人民币 (CNY)' },
        { value: 'USD', label: '$ 美元 (USD)' },
        { value: 'EUR', label: '€ 欧元 (EUR)' },
        { value: 'JPY', label: '¥ 日元 (JPY)' },
    ];

    const cycleOptions = [
        { value: 'weekly', label: '每周' },
        { value: 'monthly', label: '每月' },
        { value: 'yearly', label: '每年' },
    ];

    const categoryOptions = [
        { value: 'Entertainment', label: '🎬 娱乐' },
        { value: 'Tools', label: '🛠️ 工具' },
        { value: 'Utilities', label: '⚡ 生活服务' },
        { value: 'Health', label: '💊 健康' },
    ];

    return (
        <Card className="mx-auto max-w-2xl">
            <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">订阅名称</Label>
                        <Input
                            id="name"
                            placeholder="例如：Netflix, Spotify, 健身房..."
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Amount + Currency Row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="amount">金额</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...register('amount')}
                            />
                            {errors.amount && (
                                <p className="text-sm text-red-500">{errors.amount.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>币种</Label>
                            <Select
                                defaultValue={defaultValues?.currency ?? 'CNY'}
                                onValueChange={(val) =>
                                    setValue('currency', val as SubscriptionFormValues['currency'])
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="选择币种" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencyOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.currency && (
                                <p className="text-sm text-red-500">{errors.currency.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Billing Cycle + Category Row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>计费周期</Label>
                            <Select
                                defaultValue={defaultValues?.billingCycle ?? 'monthly'}
                                onValueChange={(val) =>
                                    setValue('billingCycle', val as SubscriptionFormValues['billingCycle'])
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="选择周期" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cycleOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.billingCycle && (
                                <p className="text-sm text-red-500">{errors.billingCycle.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>分类</Label>
                            <Select
                                defaultValue={defaultValues?.category ?? 'Tools'}
                                onValueChange={(val) =>
                                    setValue('category', val as SubscriptionFormValues['category'])
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="选择分类" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                        <Label htmlFor="startDate">首次扣款日期</Label>
                        <Input
                            id="startDate"
                            type="date"
                            {...register('startDate')}
                        />
                        {errors.startDate && (
                            <p className="text-sm text-red-500">{errors.startDate.message}</p>
                        )}
                    </div>

                    {/* Next Payment Date Preview */}
                    {nextPaymentPreview && (
                        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-sm font-medium text-zinc-700">
                                📅 下次扣款日期预览
                            </p>
                            <p className="mt-1 text-lg font-semibold text-zinc-900">
                                {nextPaymentPreview}
                            </p>
                        </div>
                    )}

                    {/* Exchange Rate Display */}
                    {conversion && (
                        <div className="mt-2 text-xs text-zinc-500 ml-1">
                            ≈ ¥{conversion.total} CNY <span className="text-zinc-400">(实时汇率: 1 {watchCurrency} = {conversion.rate.toFixed(4)} CNY)</span>
                        </div>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-zinc-900 text-white shadow-sm transition-all hover:bg-zinc-800 hover:scale-[1.01]"
                    >
                        {isSubmitting ? '提交中...' : '保存订阅'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
