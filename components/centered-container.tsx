"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CenteredContainerProps {
    children: ReactNode;
    className?: string;
    maxWidth?: 'default' | 'narrow' | 'wide';
}

export function CenteredContainer({
    children,
    className,
    maxWidth = 'default'
}: CenteredContainerProps) {
    const maxWidthClasses = {
        narrow: 'max-w-4xl',
        default: 'max-w-6xl',
        wide: 'max-w-7xl'
    };

    return (
        <div className={cn(
            'mx-auto px-4 sm:px-6 lg:px-8',
            maxWidthClasses[maxWidth],
            className
        )}>
            {children}
        </div>
    );
}
