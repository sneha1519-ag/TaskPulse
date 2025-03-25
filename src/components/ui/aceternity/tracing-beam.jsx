"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useScroll, useVelocity, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
                                children,
                                className,
                            }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const contentRef = useRef(null);
    const [svgHeight, setSvgHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setSvgHeight(contentRef.current.offsetHeight);
        }
    }, []);

    const y1 = useSpring(
        useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
        {
            stiffness: 500,
            damping: 90,
        }
    );
    const y2 = useSpring(
        useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
        {
            stiffness: 500,
            damping: 90,
        }
    );

    return (
        <motion.div
            ref={ref}
            className={cn("relative w-full", className)}
        >
            <div className="absolute -left-4 md:-left-12 top-3">
                <motion.div
                    transition={{
                        duration: 0.2,
                        delay: 0.5,
                    }}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    className="relative h-full w-4 md:w-12"
                >
                    <svg
                        viewBox={`0 0 20 ${svgHeight}`}
                        width="20"
                        height={svgHeight}
                        className="block"
                        aria-hidden="true"
                    >
                        <motion.path
                            d={`M 1 0 V ${svgHeight}`}
                            fill="none"
                            stroke="#d4d4d8"
                            strokeOpacity="0.2"
                            strokeWidth="1"
                            transition={{ duration: 10 }}
                        ></motion.path>
                        <motion.path
                            d={`M 1 ${y1} L 1 ${y2}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gray-400"
                            transition={{ duration: 10 }}
                        ></motion.path>
                    </svg>
                    <div className="absolute left-0 top-0 h-2 w-2 rounded-full bg-gray-400" />
                </motion.div>
            </div>
            <div ref={contentRef} className="ml-4 md:ml-16">
                {children}
            </div>
        </motion.div>
    );
};