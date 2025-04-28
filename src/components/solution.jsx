'use client';
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ContentSection() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.section
            id='solution'
            className="py-20 md:py-36"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="mx-auto max-w-5xl px-6">
                <motion.div
                    className="grid gap-8 md:grid-cols-2 md:gap-16"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-medium tracking-tight"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        Task Pulse is your all-in-one productivity tool designed to streamline task management and improve efficiency.
                    </motion.h2>

                    <div className="space-y-6">
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            <p className="text-lg text-muted-foreground">
                                Task Pulse is an AI-powered task management platform that helps individuals and teams stay organized and productive. Our taskpulse lets you assign tasks, receive reminders, and leverage AI-based prioritization to focus on what matters most.
                            </p>

                            <motion.div
                                className="p-6 rounded-2xl border border-primary/10 bg-gradient-to-br from-background to-primary/5 dark:from-background dark:to-primary/10 transition-all duration-300"
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
                                    borderColor: "rgba(169, 181, 223, 0.3)"
                                }}
                            >
                                <p className="font-bold text-primary dark:text-primary tracking-wide">
                                    With Task Pulse, you can track your progress through an intuitive dashboard with insightful graphs and automatically schedule projects in the built-in calendar.
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Button asChild className="group mt-4 px-6" size="lg">
                                    <Link href="#features">
                                        Explore Features
                                        <motion.span
                                            initial={{ x: 0 }}
                                            animate={isHovered ? { x: 5 } : { x: 0 }}
                                            className="ml-2"
                                        >
                                            <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </motion.span>
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}