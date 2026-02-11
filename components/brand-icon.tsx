import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface BrandIconProps {
    name: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const COLORS = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-400',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
];

export function BrandIcon({ name, className, size = 'md' }: BrandIconProps) {
    // Simple hash function to pick color
    const colorClass = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % COLORS.length;
        return COLORS[index];
    }, [name]);

    const initial = name.charAt(0).toUpperCase();

    const sizeClasses = {
        sm: 'w-10 h-10 text-sm',
        md: 'w-12 h-12 text-lg',
        lg: 'w-16 h-16 text-2xl',
    };

    const borderRadius = {
        sm: '10px',
        md: '14px',
        lg: '20px',
    };

    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center font-bold text-white shadow-sm transition-transform hover:scale-105',
                colorClass,
                sizeClasses[size],
                className
            )}
            style={{
                borderRadius: borderRadius[size], // Precise iOS-like rounding (squircle approximation)
            }}
        >
            {initial}
        </div>
    );
}
