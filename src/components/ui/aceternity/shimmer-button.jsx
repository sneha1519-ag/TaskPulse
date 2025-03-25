import React from 'react';
import { cn } from '@/lib/utils';

export const ShimmerButton = ({
                                  children,
                                  className,
                                  shimmerClassName,
                                  shimmerSize = "small",
                                  ...props
                              }) => {
    return (
        <button
            className={cn(
                "relative inline-flex h-10 overflow-hidden rounded-md px-6 py-2",
                "bg-slate-950 text-white",
                "border border-slate-800",
                "cursor-pointer items-center justify-center",
                "transition-all duration-300",
                "hover:bg-slate-900",
                className
            )}
            {...props}
        >
            <div className="relative z-10">{children}</div>
            <div
                className={cn(
                    "absolute inset-0 overflow-hidden rounded-md",
                    shimmerClassName
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 z-0",
                        shimmerSize === "small" ? "shimmering-small" : "shimmering-large"
                    )}
                />
            </div>
        </button>
    );
};