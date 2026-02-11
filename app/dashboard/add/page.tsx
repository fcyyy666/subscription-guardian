import { createSubscription } from '@/actions/subscriptions';
import SubscriptionForm from '@/components/subscription-form';

export default function AddSubscriptionPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">添加订阅</h1>
                <p className="mt-1 text-sm text-slate-500">记录一个新的周期性订阅服务</p>
            </div>
            <SubscriptionForm
                action={createSubscription}
                title="新建订阅"
                description="填写你的订阅服务信息，系统将自动计算下次扣款日期。"
            />
        </div>
    );
}
