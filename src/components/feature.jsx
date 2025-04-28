'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Settings2, Sparkles, Zap, Calendar, LayoutDashboard, Users } from 'lucide-react';

export default function Features() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
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

    // Feature data
    const featureItems = [
        {
            icon: <Calendar className="size-6" />,
            title: "Calendar",
            description: "The task you assign will be added to your calendar automatically."
        },
        {
            icon: <Settings2 className="size-6" />,
            title: "Kanban Board",
            description: "Track tasks in progress and completed tasks with visual clarity."
        },
        {
            icon: <Sparkles className="size-6" />,
            title: "AI Prioritization",
            description: "Our AI automatically prioritizes your most important tasks."
        },
        {
            icon: <Zap className="size-6" />,
            title: "Assign Tasks",
            description: "Assign tasks effortlessly and receive timely reminders."
        },
        {
            icon: <LayoutDashboard className="size-6" />,
            title: "Dashboard",
            description: "Monitor your progress with comprehensive visual analytics."
        },
        {
            icon: <Users className="size-6" />,
            title: "Team Meetings",
            description: "Seamlessly coordinate and conduct team meetings."
        }
    ];

    return (
        <section id="features" className="py-24 bg-background dark:bg-background">
            <div className="mx-auto max-w-6xl px-6">
                {/* Section Header with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    {/* Animated Accent Line */}
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "120px" }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="h-0.5 bg-gradient-to-r from-primary/40 to-primary/80 dark:from-primary/60 dark:to-primary mx-auto mb-6"
                    />

                    <h2 className="text-balance text-4xl font-semibold text-foreground lg:text-5xl">
                        Built to Cover Your Needs
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                        We provide you with a comprehensive suite of features designed to streamline
                        your workflow and enhance productivity.
                    </p>
                </motion.div>

                {/* Features Grid with Staggered Animation */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {featureItems.map((feature, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <FeatureCard
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

const FeatureCard = ({ icon, title, description }) => {
    return (
        <motion.div
            whileHover={{
                y: -8,
                transition: { type: 'spring', stiffness: 300, damping: 10 }
            }}
        >
            <Card className="group overflow-hidden border border-accent dark:border-accent rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 dark:bg-muted">
                <CardHeader className="relative pb-6">
                    <CardDecorator>{icon}</CardDecorator>
                    <h3 className="mt-16 font-semibold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                        {title}
                    </h3>
                </CardHeader>

                <CardContent>
                    <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                        {description}
                    </p>
                </CardContent>

                {/* Animated Border on Hover */}
                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-primary/70"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4 }}
                />
            </Card>
        </motion.div>
    );
};

const CardDecorator = ({ children }) => (
    <div className="relative mx-auto size-36 duration-300">
        {/* Grid Pattern Background */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,var(--accent)_1px,transparent_1px),linear-gradient(to_bottom,var(--accent)_1px,transparent_1px)]"
        />

        {/* Radial Gradient Overlay */}
        <motion.div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background dark:from-background dark:via-transparent dark:to-background"
        />

        {/* Icon Container */}
        <div className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-lg border border-accent dark:border-accent bg-background dark:bg-muted group-hover:bg-primary/5 dark:group-hover:bg-primary/20 group-hover:border-primary/30 dark:group-hover:border-primary/40 transition-all duration-300">
            <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="text-muted-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300"
            >
                {children}
            </motion.div>
        </div>
    </div>
);