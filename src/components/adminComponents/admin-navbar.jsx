import { ModeToggle } from '@/components/dashboardNavbar/mode-toggle'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation.js";
import {useEffect, useState} from "react";

const AdminNavbar = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (status === 'unauthenticated' && !isRedirecting) {
            setIsRedirecting(true);
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'admin' && !isRedirecting) {
            setIsRedirecting(true);
            router.push('/dashboard');
        }
    }, [status, session, router, isRedirecting]);


    // Show loading state
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Don't render anything if not authenticated or not admin
    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
        return null;
    }

    return (
        <nav className='fixed top-0 left-0 right-0 h-16 flex items-center px-2 pr-5 z-50 border-b border-gray-100 dark:border-zinc-800 bg-background'>
            <div className='flex items-center gap-4 w-full'>
                {/* Logo */}
                <div className='flex items-start flex-shrink-0'>
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

                {/* Theme Toggler */}
                <div className='flex-shrink-0 flex ml-auto items-center gap-4'>
                    <ModeToggle/>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="h-8 w-8 cursor-pointer">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {session?.user?.firstName?.[0]}{session?.user?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {session?.user?.firstName} {session?.user?.lastName}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
        </nav>
    );
};

export default AdminNavbar;