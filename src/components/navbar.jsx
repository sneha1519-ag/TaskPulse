"use client"
import { ModeToggle } from './mode-toggle'
import React, { useState, useEffect } from 'react'
import { ArrowRight, Menu, Rocket, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Solution', href: '#solution' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#' },
]

const Navbar = () => {
    const [menuState, setMenuState] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navbarVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    // Only define these variants when mounted to prevent hydration mismatch
    const linkVariants = mounted ? {
        hover: {
            scale: 1.05,
            color: resolvedTheme === 'dark' ? '#A9B5DF' : '#2D336B',
            transition: { type: "spring", stiffness: 400, damping: 10 }
        }
    } : {};

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        open: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut",
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    }

    const mobileItemVariants = {
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 }
    }

    // Don't render client-specific content until mounted
    if (!mounted) {
        return <div className="fixed z-20 w-full bg-white/50 dark:bg-zinc-950/50 border-b border-dashed border-transparent">
            <div className="m-auto max-w-5xl px-6">
                <div className="flex items-center justify-between py-2 lg:py-3">
                    <div className="flex justify-between items-start">
                        <Link href={"/"} className='flex items-start'>
                            <Image
                                src="/light-logo.png"
                                alt="TaskPulse"
                                width={130}
                                height={0}
                                className="py-1"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    }

    return (
        <motion.header
            initial="initial"
            animate="animate"
            variants={navbarVariants}
        >
            <nav className={`fixed z-20 w-full backdrop-blur-md transition-all duration-300 ${
                scrolled ? 'bg-white/90 shadow-md dark:bg-zinc-950/90' : 'bg-white/50 dark:bg-zinc-950/50'
            } border-b border-dashed ${
                scrolled ? 'border-gray-200 dark:border-gray-800' : 'border-transparent'
            }`}>
                <div className="m-auto max-w-5xl px-6">
                    <div className="flex items-center justify-between py-2 lg:py-3">
                        <div className="flex justify-between items-start">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link href={"/"} className='flex items-start'>
                                    <Image
                                        src={resolvedTheme === 'dark' ? "/dark-logo.png" : "/light-logo.png"}
                                        alt="TaskPulse"
                                        width={130}
                                        height={0}
                                        className="py-1"
                                    />
                                </Link>
                            </motion.div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex lg:items-center lg:gap-6">
                            <div className="pr-4">
                                <ul className="flex gap-6 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <motion.div whileHover="hover" variants={linkVariants}>
                                                <Link
                                                    href={item.href}
                                                    className="text-muted-foreground hover:text-accent-foreground block relative"
                                                >
                                                    <span>{item.name}</span>
                                                    <motion.span
                                                        className="absolute bottom-0 left-0 h-0.5 bg-current"
                                                        initial={{ width: 0 }}
                                                        whileHover={{ width: '100%' }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                </Link>
                                            </motion.div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-center gap-3 border-l pl-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className={`rounded-xl border transition-all hover:shadow-md ${
                                            resolvedTheme === 'dark'
                                                ? 'hover:border-gray-700 hover:bg-zinc-900'
                                                : 'hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Link href="/login">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                </motion.div>
                                <ModeToggle />
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMenuState(!menuState)}
                            aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                            className="relative z-20 block cursor-pointer p-2 lg:hidden"
                        >
                            <motion.div
                                animate={{
                                    rotate: menuState ? 180 : 0,
                                    opacity: menuState ? 0 : 1,
                                    scale: menuState ? 0 : 1
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu className="size-5" />
                            </motion.div>
                            <motion.div
                                className="absolute inset-0 m-auto size-5"
                                animate={{
                                    rotate: menuState ? 0 : -180,
                                    opacity: menuState ? 1 : 0,
                                    scale: menuState ? 1 : 0
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="m-auto size-5" />
                            </motion.div>
                        </motion.button>

                        {/* Mobile Menu */}
                        <AnimatePresence>
                            {menuState && (
                                <motion.div
                                    variants={mobileMenuVariants}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    className="fixed inset-0 top-14 z-10 flex flex-col bg-white p-6 shadow-2xl dark:bg-zinc-950"
                                >
                                    <div className="flex flex-1 flex-col items-center justify-center">
                                        <ul className="space-y-6 text-center text-lg">
                                            {menuItems.map((item, index) => (
                                                <motion.li
                                                    key={index}
                                                    variants={mobileItemVariants}
                                                    className="transform transition duration-300 hover:scale-105"
                                                >
                                                    <Link
                                                        href={item.href}
                                                        className={`text-muted-foreground block py-2 transition-colors hover:text-accent-foreground ${
                                                            resolvedTheme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-800'
                                                        }`}
                                                        onClick={() => setMenuState(false)}
                                                    >
                                                        <span>{item.name}</span>
                                                    </Link>
                                                </motion.li>
                                            ))}
                                        </ul>

                                        <motion.div
                                            variants={mobileItemVariants}
                                            className="mt-12 flex w-full max-w-xs flex-col space-y-4"
                                        >
                                            <Button
                                                asChild
                                                className="w-full rounded-xl bg-primary hover:opacity-90 transition-all"
                                                style={{
                                                    backgroundColor: resolvedTheme === 'dark' ? '#A9B5DF' : '#2D336B',
                                                    color: resolvedTheme === 'dark' ? '#0F172A' : 'white'
                                                }}
                                            >
                                                <Link href="/login">
                                                    <span>Login</span>
                                                </Link>
                                            </Button>
                                            <div className="flex justify-center">
                                                <ModeToggle />
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>
        </motion.header>
    )
}

export default Navbar;