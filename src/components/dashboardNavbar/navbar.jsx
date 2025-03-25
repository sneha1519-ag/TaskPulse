import { ModeToggle } from '@/components/dashboardNavbar/mode-toggle'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Image from 'next/image'
import Link from 'next/link'
import { SearchInput } from '@/components/dashboardNavbar/search-input'
import { Button } from '@/components/ui/button'

const Navbar = () => {
    return (
        <nav className='fixed top-0 left-0 right-0 h-16 flex items-center px-2 pr-5 z-50 border-b bg-background'>
            <div className='flex items-center gap-4 w-full'>

                {/* Logo */}
                <div className='flex items-center flex-shrink-0'>
                    <SidebarTrigger/>
                    <Link href={"/"} className='p-4 flex items-center gap-1'>
                        <Image src="/logo.svg" alt="TaskPulse" width={200} height={50} className="dark:invert"/>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
                    <SearchInput/>
                </div>

                {/* Theme Toggler */}
                <div className='flex-shrink-0 flex items-center gap-4'>
                    <Link href={"https://feebo.vercel.app/b/67b4af49aa64510c3f66c421"} target="_blank">
                        <Button variant={"link"} className='font-semibold text-muted-foreground'>
                            Feedback?
                        </Button>
                    </Link>
                    <ModeToggle/>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;