import { z } from 'zod';

/**
 * Shared Zod schema for subscription form validation.
 * Used by both Server Actions (backend validation) and react-hook-form (client validation).
 */
export const subscriptionFormSchema = z.object({
    name: z
        .string()
        .min(1, '请填写订阅名称，例如 "Netflix"')
        .max(255, '名称太长啦，请精简一下'),
    amount: z
        .string()
        .min(1, '别忘了输入金额哦')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: '金额必须是大于 0 的数字',
        }),
    currency: z.enum(['CNY', 'USD', 'EUR', 'JPY'], {
        message: '请选择一个有效币种',
    }),
    billingCycle: z.enum(['monthly', 'yearly', 'weekly'], {
        message: '请选择扣款周期',
    }),
    startDate: z
        .string()
        .min(1, '请选择首次扣款日期')
        .refine((val) => !isNaN(Date.parse(val)), {
            message: '日期格式好像不对哦',
        }),
    category: z.enum(['Entertainment', 'Tools', 'Utilities', 'Health'], {
        message: '请选择一个分类',
    }),
});

/** TypeScript type inferred from the Zod schema */
export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;
