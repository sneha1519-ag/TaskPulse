'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

export default function HeroSection() {
    const { resolvedTheme } = useTheme()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    }

    const imageVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.6
            }
        }
    }

    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: resolvedTheme === 'dark'
                ? '0 0 15px 2px rgba(169, 181, 223, 0.3)'
                : '0 0 15px 2px rgba(45, 51, 107, 0.2)',
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        },
        tap: {
            scale: 0.95
        }
    }

    return (
        <section className="overflow-hidden">
            <motion.div
                className="relative pt-20 md:pt-24"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="mx-auto max-w-7xl px-6">
                    <motion.div
                        className="max-w-3xl text-center sm:mx-auto lg:mr-auto lg:mt-0 lg:w-4/5"
                        variants={containerVariants}
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="mt-6 text-balance text-4xl font-bold tracking-tight md:text-5xl xl:text-6xl xl:[line-height:1.125]"
                            style={{
                                color: resolvedTheme === 'dark' ? '#A9B5DF' : '#2D336B',
                            }}
                        >
                            Making Your Day Productive
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="mx-auto mt-6 hidden max-w-2xl text-wrap text-lg text-muted-foreground sm:block"
                        >
                            You can assign your task here, and we will remind you about it. The AI will prioritize your task, making your work easier.
                        </motion.p>

                        <motion.p
                            variants={itemVariants}
                            className="mx-auto mt-4 max-w-2xl text-wrap text-muted-foreground sm:hidden"
                        >
                            Highly customizable components for building modern websites and applications, with your personal spark.
                        </motion.p>

                        <motion.div
                            className="mt-8"
                            variants={itemVariants}
                        >
                            <motion.div
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="inline-block"
                            >
                                <Button
                                    size="lg"
                                    asChild
                                    className="rounded-2xl px-6 transition-all"
                                    style={{
                                        backgroundColor: resolvedTheme === 'dark' ? '#A9B5DF' : '#2D336B',
                                        color: resolvedTheme === 'dark' ? '#0F172A' : 'white'
                                    }}
                                >
                                    <Link href="/login" className="flex items-center gap-2">
                                        <Rocket className="relative size-4" />
                                        <span className="text-nowrap font-medium">Get Started</span>
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                ease: "easeInOut",
                                                repeatDelay: 1
                                            }}
                                        >
                                            <ArrowRight className="ml-1 size-4" />
                                        </motion.div>
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                <div className="relative mt-16">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent to-background to-35% z-10"
                        aria-hidden
                    />

                    <motion.div
                        className="relative mx-auto max-w-6xl overflow-hidden px-4"
                        variants={imageVariants}
                    >
                        <motion.div
                            whileHover={{
                                y: -5,
                                boxShadow: resolvedTheme === 'dark'
                                    ? '0 20px 25px -5px rgba(169, 181, 223, 0.15), 0 10px 10px -5px rgba(169, 181, 223, 0.1)'
                                    : '0 20px 25px -5px rgba(45, 51, 107, 0.15), 0 10px 10px -5px rgba(45, 51, 107, 0.1)'
                            }}
                            transition={{ type: "spring", stiffness: 150, damping: 15 }}
                            className="rounded-2xl border border-border/25 overflow-hidden transition-all duration-300"
                        >
                            <Image
                                className="relative w-full h-auto dark:block hidden"
                                src="/ss.png"
                                alt="app screen"
                                width={2796}
                                height={2008}
                            />
                            <Image
                                className="relative w-full h-auto dark:hidden"
                                src="/ss.png"
                                alt="app screen"
                                width={2796}
                                height={2008}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}