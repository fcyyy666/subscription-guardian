import { cn } from '@/lib/utils';
import {
    Clapperboard,
    Sparkles,
    Dumbbell,
    Cpu,
    CreditCard,
    ShoppingBag,
    Briefcase,
    HeartPulse,
    Play
} from 'lucide-react';

interface SubscriptionIconProps {
    category: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function SubscriptionIcon({ category, className, size = 'md' }: SubscriptionIconProps) {
    // Map categories to styles and icons
    const getStyle = (cat: string) => {
        switch (cat) {
            case 'Entertainment':
                return {
                    bg: 'bg-purple-100',
                    text: 'text-purple-600',
                    Icon: Clapperboard // or Play
                };
            case 'Utilities': // Mapping 'Utilities' to 'Lifestyle' style as req
            case 'Lifestyle':
                return {
                    bg: 'bg-pink-100',
                    text: 'text-pink-600',
                    Icon: Sparkles // or ShoppingBag
                };
            case 'Health':
            case 'Sports':
                return {
                    bg: 'bg-emerald-100', // Green for health
                    text: 'text-emerald-600',
                    Icon: Dumbbell // or HeartPulse
                };
            case 'Tools':
                return {
                    bg: 'bg-blue-100',
                    text: 'text-blue-600',
                    Icon: Cpu // or Briefcase
                };
            default:
                return {
                    bg: 'bg-zinc-100',
                    text: 'text-zinc-600',
                    Icon: CreditCard
                };
        }
    };

    const style = getStyle(category);
    const IconComponent = style.Icon;

    // Size mappings
    const sizeClasses = {
        sm: 'w-8 h-8 p-1.5',
        md: 'w-12 h-12 p-3',
        lg: 'w-16 h-16 p-4',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    // Squircle border radius
    const borderRadius = {
        sm: '10px',
        md: '14px',
        lg: '20px',
    };

    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center transition-transform hover:scale-105 shadow-sm',
                style.bg,
                style.text,
                sizeClasses[size],
                className
            )}
            style={{
                borderRadius: borderRadius[size], // Precise iOS-like rounding
            }}
        >
            <IconComponent className={cn(iconSizes[size], "opacity-90")} strokeWidth={2.5} />
        </div>
    );
}
