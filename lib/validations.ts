import { z } from 'zod';

/**
 * Shared Zod schema for subscription form validation.
 * Used by both Server Actions (backend validation) and react-hook-form (client validation).
 */
export const subscriptionFormSchema = z.object({
    name: z
        .string()
        .min(1, '订阅名称不能为空')
        .max(255, '订阅名称不能超过255个字符'),
    amount: z
        .string()
        .min(1, '金额不能为空')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: '请输入有效的正数金额',
        }),
    currency: z.enum(['CNY', 'USD', 'EUR', 'JPY'], {
        error: '请选择有效的币种',
    }),
    billingCycle: z.enum(['monthly', 'yearly', 'weekly'], {
        error: '请选择有效的计费周期',
    }),
    startDate: z
        .string()
        .min(1, '请选择开始日期')
        .refine((val) => !isNaN(Date.parse(val)), {
            message: '请输入有效的日期',
        }),
    category: z.enum(['Entertainment', 'Tools', 'Utilities', 'Health'], {
        error: '请选择有效的分类',
    }),
});

/** TypeScript type inferred from the Zod schema */
export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;
