import React from 'react';
import { cn } from '@/lib/utils';

export const GlowingCard = ({
                                className,
                                children,
                                containerClassName,
                                glowClassName,
                                ...props
                            }) => {
    return (
        <div
            className={cn(
                "relative group",
                containerClassName
            )}
        >
            <div
                className={cn(
                    "absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200",
                    glowClassName
                )}
            />
            <div
                className={cn(
                    "relative bg-white dark:bg-gray-900 rounded-lg p-6",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>
    );
};