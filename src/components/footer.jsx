'use client';
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Twitter, Linkedin, Instagram } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const links = [
    {
        title: 'Features',
        href: '#features',
    },
    {
        title: 'Solution',
        href: '#solution',
    },
    {
        title: 'Pricing',
        href: '#pricing',
    },
    {
        title: 'About',
        href: '#',
    },
    {
        title: 'Blog',
        href: '#',
    },
    {
        title: 'Contact',
        href: '#',
    },
]

const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
]

export default function FooterSection() {
    const footerYear = new Date().getFullYear()

    return (
        <footer className="border-t bg-white py-16 dark:bg-transparent">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <h3 className="text-xl font-semibold text-primary dark:text-primary">Task Pulse</h3>
                            <p className="text-muted-foreground">Your all-in-one productivity tool designed to streamline task management and improve efficiency.</p>

                            <div className="pt-2">
                                <p className="text-sm font-medium mb-2">Subscribe to our newsletter</p>
                                <div className="flex gap-2 max-w-sm">
                                    <Input
                                        placeholder="Enter your email"
                                        className="rounded-xl"
                                    />
                                    <Button size="sm" className="rounded-xl">
                                        <ArrowRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h4 className="text-sm font-semibold">Navigation</h4>
                        <nav className="flex flex-col space-y-3">
                            {links.map((link, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ x: 3 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary dark:hover:text-primary text-sm transition-colors duration-200"
                                    >
                                        {link.title}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-4"
                    >
                        <h4 className="text-sm font-semibold">Connect</h4>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="p-2 rounded-full bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Icon className="size-4 text-primary dark:text-primary" />
                                    </motion.a>
                                )
                            })}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <span className="text-muted-foreground text-sm">© {footerYear} Task Pulse. All rights reserved.</span>
                    <div className="flex gap-6 text-xs text-muted-foreground">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}