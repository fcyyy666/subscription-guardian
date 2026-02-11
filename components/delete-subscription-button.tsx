'use client';

import { useTransition } from 'react';
import { deleteSubscription } from '@/actions/subscriptions';
import { Button } from '@/components/ui/button';

interface DeleteSubscriptionButtonProps {
    subscriptionId: string;
}

/**
 * Client component wrapper for the delete subscription server action.
 * Uses useTransition for optimistic UI feedback.
 */
export default function DeleteSubscriptionButton({ subscriptionId }: DeleteSubscriptionButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm('确定要删除这个订阅吗？')) return;

        startTransition(async () => {
            const result = await deleteSubscription(subscriptionId);
            if (result?.error) {
                alert(result.error);
            }
        });
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-500 hover:bg-red-50 hover:text-red-700"
        >
            {isPending ? '删除中...' : '删除'}
        </Button>
    );
}
