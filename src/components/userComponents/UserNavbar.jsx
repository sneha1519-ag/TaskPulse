"use client"

import React, { useState } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
import {
  User,
  LogOut,
  Settings,
  Star,
  ChevronDown,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from "next-themes";

const UserNavbar = ({ user }) => {
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const { resolvedTheme } = useTheme();

  return (
      <header className="sticky top-0 z-50 w-full border-b border-primary bg-background/80 backdrop-blur-md supports-backdrop-blur:bg-background/60 transition-all duration-300 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
          <motion.div
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="flex-shrink-0 h-full flex items-center"
          >
              <div className="overflow-hidden rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Link href={"/"} className='p-2 flex items-start'>
                  <Image
                      src={resolvedTheme === 'dark' ? "/dark-logo.png" : "/light-logo.png"}
                      alt="TaskPulse"
                      width={150}
                      height={0}
                      className="p-1"
                  />
                </Link>
              </div>
          </motion.div>

          <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-5 ml-auto"
          >
            <TooltipProvider>
              <motion.div variants={itemVariants} className="hidden md:flex">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm transition-all hover:shadow-md"
                    >
                      <Star className={`h-4 w-4 ${resolvedTheme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
                      <span className="font-medium text-sm">{user?.points || 0} points</span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Earn more points by completing tasks</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </TooltipProvider>

            <motion.div variants={itemVariants} className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="relative p-2 rounded-full bg-background border border-border hover:border-primary/30 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-accent"
                    >
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">2</Badge>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <AnimatePresence>
                {isNotificationOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute right-0 mt-2 w-72 rounded-2xl bg-background border shadow-lg p-3 z-50"
                    >
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm px-2">Recent Notifications</h4>
                        <div className="space-y-2">
                          <div className="rounded-xl p-3 hover:bg-accent transition-colors cursor-pointer">
                            <p className="text-sm font-medium">New task assigned</p>
                            <p className="text-xs text-muted-foreground">2 minutes ago</p>
                          </div>
                          <div className="rounded-xl p-3 hover:bg-accent transition-colors cursor-pointer">
                            <p className="text-sm font-medium">Project deadline updated</p>
                            <p className="text-xs text-muted-foreground">1 hour ago</p>
                          </div>
                          <div className="rounded-xl p-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                            <p className="text-sm">View all notifications</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants} className="transition-transform">
              <ModeToggle />
            </motion.div>

            <motion.div variants={itemVariants}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                  >
                    <Button
                        variant="ghost"
                        className="relative h-10 pl-3 pr-2 rounded-full overflow-hidden border border-border transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:bg-accent flex items-center gap-2"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback className={`${resolvedTheme === 'dark' ? 'bg-primary/20' : 'bg-primary/10'} text-primary`}>
                          {getInitials(`${user?.firstName} ${user?.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden sm:inline-block">
                      {user?.firstName || 'User'}
                    </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-64 mr-2 rounded-2xl overflow-hidden border border-border shadow-lg"
                    align="end"
                    forceMount
                    sideOffset={15}
                >
                  <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                  >
                    <DropdownMenuLabel className="font-normal p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                          <AvatarImage src={user?.profileImage} />
                          <AvatarFallback className={`${resolvedTheme === 'dark' ? 'bg-primary/20' : 'bg-primary/10'} text-primary`}>
                            {getInitials(`${user?.firstName} ${user?.lastName}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user?.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <div className="p-2">
                      <DropdownMenuItem className="p-3 rounded-xl cursor-pointer focus:bg-accent hover:bg-accent/80 transition-colors">
                        <User className="mr-3 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-3 rounded-xl cursor-pointer focus:bg-accent hover:bg-accent/80 transition-colors">
                        <Settings className="mr-3 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <DropdownMenuItem
                          onClick={handleLogout}
                          className="p-3 rounded-xl cursor-pointer text-red-500 hover:text-red-600 focus:bg-red-50 hover:bg-red-50 dark:focus:bg-red-950/50 dark:hover:bg-red-950/50 transition-colors"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </div>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </motion.div>
        </div>
      </header>
  )
}

export default UserNavbar