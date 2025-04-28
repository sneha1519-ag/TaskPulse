"use client"
import { useState, useEffect } from "react"
import { signIn, useSession, signOut } from "next-auth/react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [useType, setUseType] = useState(null) // null, "personal", "professional"
    const [professionalType, setProfessionalType] = useState(null) // null, "admin", "user"
    const [showAdminCreate, setShowAdminCreate] = useState(false)
    const router = useRouter()

    const handleUserTypeSelect = (type) => {
        console.log('handleUserTypeSelect called with:', type);
        // Use a callback to ensure we're working with the latest state
        setUseType((prevUseType) => {
            console.log('Previous useType:', prevUseType);
            console.log('Setting useType to:', type);
            return type;
        });
    }

    const handleProfessionalClick = () => {
        console.log('Professional button clicked');
        // Set both states in sequence
        setUseType("professional");
        // Use setTimeout to ensure the first state update is processed
        setTimeout(() => {
            setProfessionalType(null);
        }, 0);
    };

    const handleProfessionalTypeSelect = (type) => {
        console.log('handleProfessionalTypeSelect called with:', type);
        setProfessionalType((prevType) => {
            console.log('Previous professionalType:', prevType);
            console.log('Setting professionalType to:', type);
            return type;
        });
        if (type === "user") {
            router.push("/user/login");
        }
    }

    useEffect(() => {
        console.log('State changed:', { 
            useType, 
            professionalType, 
            showAdminCreate,
            timestamp: new Date().toISOString()
        });
    }, [useType, professionalType, showAdminCreate]);

    const renderUserTypeSelection = () => (
        <div className="space-y-6">
            <h2 className="text-lg font-medium text-center">Select your use type</h2>
            <div className="grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    className={`h-24 ${useType === "personal" ? "border-primary border-2" : ""}`}
                    onClick={() => {
                        console.log('Personal use button clicked');
                        handleUserTypeSelect("personal");
                    }}>
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Personal Use</span>
                    </div>
                </Button>
                <Button
                    variant="outline"
                    className={`h-24 ${useType === "professional" ? "border-primary border-2" : ""}`}
                    onClick={handleProfessionalClick}>
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>Professional Use</span>
                    </div>
                </Button>
            </div>

            {useType && (
                <Button
                    className="w-full"
                    onClick={() => useType === "professional" ? null : setUseType("personal-confirmed")}>
                    Continue
                </Button>
            )}
        </div>
    )

    const renderProfessionalTypeSelection = () => (
        <div className="space-y-6">
            <div className="flex items-center mb-4">
                <Button variant="ghost" onClick={() => setUseType(null)} className="p-0 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </Button>
                <h2 className="text-lg font-medium">Select user type</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    className={`h-24 ${professionalType === "admin" ? "border-primary border-2" : ""}`}
                    onClick={() => handleProfessionalTypeSelect("admin")}>
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>Admin</span>
                    </div>
                </Button>
                <Button
                    variant="outline"
                    className={`h-24 ${professionalType === "user" ? "border-primary border-2" : ""}`}
                    onClick={() => handleProfessionalTypeSelect("user")}>
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>User</span>
                    </div>
                </Button>
            </div>

            {professionalType === "admin" && (
                <div className="flex justify-between mt-4">
                    <Button
                        variant="outline"
                        className="flex-1 mr-2"
                        onClick={() => setShowAdminCreate(true)}>
                        Create Account
                    </Button>
                    <Button
                        className="flex-1 ml-2"
                        onClick={() => setShowAdminCreate(false)}>
                        Sign In
                    </Button>
                </div>
            )}
        </div>
    )

    const renderAdminCreate = () => (
        <div className="space-y-6">
            <div className="flex items-center mb-4">
                <Button variant="ghost" onClick={() => setShowAdminCreate(false)} className="p-0 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </Button>
                <h2 className="text-lg font-medium">Create Admin Account</h2>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="block text-sm">
                        Email
                    </Label>
                    <Input type="email" required name="email" id="email" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username" className="block text-sm">
                        Username
                    </Label>
                    <Input type="text" required name="username" id="username" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="block text-sm">
                        Password
                    </Label>
                    <Input type="password" required name="password" id="password" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="block text-sm">
                        Confirm Password
                    </Label>
                    <Input type="password" required name="confirmPassword" id="confirmPassword" />
                </div>

                <Button className="w-full">Create Account</Button>
            </div>
        </div>
    )

    const renderPersonalLogin = () => (
        <>
            <div>
                <div className="flex items-center mb-4">
                    <Button variant="ghost" onClick={() => setUseType(null)} className="p-0 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </Button>
                    <Link href="/" aria-label="go home">
                        Task pulse
                    </Link>
                </div>
                <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In to TaskPulse</h1>
                <p className="text-sm">Welcome back! Sign in to continue</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" onClick={() => signIn("google")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                        <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                        <path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                        <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                        <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                    </svg>
                    <span>Google</span>
                </Button>
                <Button type="button" variant="outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
                        <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z"></path>
                        <path fill="#80cc28" d="M256 121.666H134.335V0H256z"></path>
                        <path fill="#00adef" d="M121.663 256.002H0V134.336h121.663z"></path>
                        <path fill="#fbbc09" d="M256 256.002H134.335V134.336H256z"></path>
                    </svg>
                    <span>Microsoft</span>
                </Button>
            </div>

            <hr className="my-4 border-dashed" />

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="block text-sm">
                        Username
                    </Label>
                    <Input type="email" required name="email" id="email" />
                </div>

                <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="pwd" className="text-title text-sm">
                            Password
                        </Label>
                        <Button asChild variant="link" size="sm">
                            <Link href="#" className="link intent-info variant-ghost text-sm">
                                Forgot your Password ?
                            </Link>
                        </Button>
                    </div>
                    <Input type="password" required name="pwd" id="pwd" className="input sz-md variant-mixed" />
                </div>

                <Button className="w-full">Sign In</Button>
            </div>
        </>
    )

    const renderAdminLogin = () => (
        <>
            <div>
                <div className="flex items-center mb-4">
                    <Button variant="ghost" onClick={() => {
                        setProfessionalType(null);
                        setShowAdminCreate(false);
                    }} className="p-0 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </Button>
                    <Link href="/" aria-label="go home">
                        Task pulse
                    </Link>
                </div>
                <h1 className="mb-1 mt-4 text-xl font-semibold">Admin Sign In</h1>
                <p className="text-sm">Sign in to admin dashboard</p>
            </div>

            <div className="space-y-6 mt-6">
                <div className="space-y-2">
                    <Label htmlFor="admin-username" className="block text-sm">
                        Username
                    </Label>
                    <Input type="text" required name="admin-username" id="admin-username" />
                </div>

                <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="admin-pwd" className="text-title text-sm">
                            Password
                        </Label>
                        <Button asChild variant="link" size="sm">
                            <Link href="#" className="link intent-info variant-ghost text-sm">
                                Forgot your Password ?
                            </Link>
                        </Button>
                    </div>
                    <Input type="password" required name="admin-pwd" id="admin-pwd" />
                </div>

                <Button className="w-full">Sign In</Button>

                <div className="text-center">
                    <Button asChild variant="link" size="sm" onClick={() => setShowAdminCreate(true)}>
                        <Link href="#" className="link intent-info variant-ghost text-sm">
                            Create an admin account
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    )

    const renderContent = () => {
        console.log('Rendering content with state:', { 
            useType, 
            professionalType, 
            showAdminCreate,
            timestamp: new Date().toISOString()
        });
        
        if (!useType) {
            console.log('Rendering user type selection');
            return renderUserTypeSelection();
        }
        
        if (useType === "professional") {
            console.log('Professional use selected, professionalType:', professionalType);
            if (!professionalType) {
                console.log('Rendering professional type selection');
                return renderProfessionalTypeSelection();
            }
            if (professionalType === "admin") {
                console.log('Admin selected, showAdminCreate:', showAdminCreate);
                return showAdminCreate ? renderAdminCreate() : renderAdminLogin();
            }
        }
        
        if (useType === "personal") {
            console.log('Rendering personal login');
            return renderPersonalLogin();
        }
        
        console.log('No matching render condition');
        return null;
    }

    return (
        <section className="flex h-full bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent overflow-y-hidden">
            <form action="" className="bg-card m-auto w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pb-6">
                    {renderContent()}
                </div>

                {useType === "personal-confirmed" && (
                    <div className="bg-muted rounded-(--radius) border p-3">
                        <p className="text-accent-foreground text-center text-sm">
                            Don't have an account ?
                            <Button asChild variant="link" className="px-2">
                                <Link href="#">Create account</Link>
                            </Button>
                        </p>
                    </div>
                )}
            </form>
        </section>
    )
}