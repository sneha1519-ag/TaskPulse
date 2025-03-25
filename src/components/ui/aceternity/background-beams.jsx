"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const container = containerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setMousePosition({ x, y });
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
            container.addEventListener("mouseenter", () => setIsHovered(true));
            container.addEventListener("mouseleave", () => setIsHovered(false));
            return () => {
                container.removeEventListener("mousemove", handleMouseMove);
                container.removeEventListener("mouseenter", () => setIsHovered(true));
                container.removeEventListener("mouseleave", () => setIsHovered(false));
            };
        }
    }, [containerRef]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "h-full w-full absolute top-0 left-0 overflow-hidden",
                className
            )}
        >
            {isHovered && (
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <motion.div
                        className="absolute h-32 w-32 rounded-full bg-gray-200"
                        style={{
                            top: mousePosition.y - 64,
                            left: mousePosition.x - 64,
                            filter: "blur(40px)",
                        }}
                        animate={{
                            opacity: [0, 0.6, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                        }}
                    />
                </motion.div>
            )}
        </div>
    );
};