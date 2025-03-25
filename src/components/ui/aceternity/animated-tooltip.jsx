import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export const AnimatedTooltip = ({
                                    items,
                                    className,
                                }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className={cn("flex flex-row items-center justify-center gap-2", className)}>
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="relative group"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <div className="cursor-pointer">
                        {item.icon}
                    </div>
                    {hoveredIndex === idx && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full mt-0 top-0 z-10">
                            <div className="bg-black text-white text-sm rounded-md px-3 py-1.5 min-w-max">
                                {item.text}
                            </div>
                            <div className="w-2 h-2 bg-black transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};