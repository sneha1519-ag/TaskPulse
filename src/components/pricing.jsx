'use client';
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Pricing() {
    return (
        <motion.section
            id='pricing'
            className="py-20 md:py-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="mx-auto max-w-5xl px-6">
                <motion.div
                    className="mx-auto max-w-2xl space-y-6 text-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-center text-4xl font-semibold lg:text-5xl tracking-tight">Pricing that Scales with You</h1>
                    <p className="text-lg text-muted-foreground">Choose the perfect plan for your productivity needs</p>
                </motion.div>

                <motion.div
                    className="mt-12 grid gap-8 md:mt-20 md:grid-cols-2"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <motion.div
                        whileHover={{ y: -5, boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)" }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="h-full overflow-hidden border rounded-2xl">
                            <CardHeader className="space-y-1 pb-8">
                                <CardTitle className="text-2xl font-medium">Free</CardTitle>
                                <div className="flex items-baseline space-x-1 mt-4">
                                    <span className="text-4xl font-bold">$0</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                                <CardDescription className="text-sm pt-2">Perfect for individuals starting out</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-8">
                                <ul className="space-y-4 text-sm">
                                    {['Basic Analytics Dashboard', '5GB Cloud Storage', 'Email and Chat Support'].map((item, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-center gap-3"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 * index }}
                                        >
                                            <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-1">
                                                <Check className="size-3 text-primary" />
                                            </div>
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="outline" className="w-full rounded-xl" size="lg">
                                    <Link href="/login">Get Started</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5, boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)" }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="h-full overflow-hidden border-2 border-primary/20 rounded-2xl relative">
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                                <Badge className="bg-primary hover:bg-primary text-white px-3 py-1 rounded-full">
                                    Popular
                                </Badge>
                            </div>
                            <CardHeader className="space-y-1 pb-8">
                                <CardTitle className="text-2xl font-medium">Pro</CardTitle>
                                <div className="flex items-baseline space-x-1 mt-4">
                                    <span className="text-4xl font-bold">$19</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                                <CardDescription className="text-sm pt-2">For professionals and small teams</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-8">
                                <div className="text-sm font-medium mb-4">Everything in free plus:</div>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                                    {[
                                        'Everything in Free Plan',
                                        '25GB Cloud Storage',
                                        'Priority Email and Chat Support',
                                        'Access to Community Forum',
                                        'Team Collaboration Features',
                                        'Access to All Templates',
                                        'Mobile App Access',
                                        'Unlimited Custom Reports',
                                        'Weekly Product Updates',
                                        'Advanced Security Features'
                                    ].map((item, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-center gap-3"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.05 * index }}
                                        >
                                            <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-1">
                                                <Check className="size-3 text-primary" />
                                            </div>
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full rounded-xl" size="lg">
                                    <Link href="/login">Get Started</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    )
}