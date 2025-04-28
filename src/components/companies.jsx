'use client';
import React from 'react';
import { motion } from 'framer-motion';

const Companies = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    // Company logos data
    const companyLogos = [
        { name: "Nvidia", height: "h-6", src: "https://html.tailus.io/blocks/customers/nvidia.svg" },
        { name: "Column", height: "h-5", src: "https://html.tailus.io/blocks/customers/column.svg" },
        { name: "GitHub", height: "h-5", src: "https://html.tailus.io/blocks/customers/github.svg" },
        { name: "Nike", height: "h-6", src: "https://html.tailus.io/blocks/customers/nike.svg" },
        { name: "Laravel", height: "h-5", src: "https://html.tailus.io/blocks/customers/laravel.svg" },
        { name: "Lilly", height: "h-8", src: "https://html.tailus.io/blocks/customers/lilly.svg" },
        { name: "Lemon Squeezy", height: "h-6", src: "https://html.tailus.io/blocks/customers/lemonsqueezy.svg" },
        { name: "OpenAI", height: "h-7", src: "https://html.tailus.io/blocks/customers/openai.svg" },
        { name: "Tailwind CSS", height: "h-5", src: "https://html.tailus.io/blocks/customers/tailwindcss.svg" },
        { name: "Vercel", height: "h-6", src: "https://html.tailus.io/blocks/customers/vercel.svg" },
        { name: "Zapier", height: "h-6", src: "https://html.tailus.io/blocks/customers/zapier.svg" }
    ];

    return (
        <section className="relative z-10 py-24 bg-muted dark:bg-muted">
            <div className="m-auto max-w-5xl px-6">
                {/* Section Header with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    {/* Animated Accent Line */}
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100px" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="h-0.5 bg-primary mx-auto mb-6"
                    />

                    <h2 className="text-2xl md:text-3xl font-medium text-foreground">
                        Your favorite companies are our partners
                    </h2>
                    <p className="mt-3 text-muted-foreground text-lg">
                        We collaborate with industry leaders to deliver excellence
                    </p>
                </motion.div>

                {/* Company Logos Grid with Staggered Animation */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mx-auto mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-12 gap-y-10 place-items-center"
                >
                    {companyLogos.map((company, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group"
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    transition: { type: "spring", stiffness: 300, damping: 10 }
                                }}
                                className="relative"
                            >
                                {/* Company Logo */}
                                <img
                                    className={`${company.height} w-fit opacity-75 group-hover:opacity-100 transition-opacity duration-300 dark:invert`}
                                    src={company.src}
                                    alt={`${company.name} Logo`}
                                    width="auto"
                                />

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 -m-2 rounded-2xl bg-primary/5 dark:bg-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default Companies;