"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signIn, useSession } from "next-auth/react";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function LoginPage() {
    const router = useRouter();
    const [useType, setUseType] = useState(null);
    const [professionalType, setProfessionalType] = useState(null);
    const [showAdminCreate, setShowAdminCreate] = useState(false);
    const [adminLoginData, setAdminLoginData] = useState({
        email: '',
        password: ''
    });
    const [adminCreateData, setAdminCreateData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUserTypeSelect = (type) => {
        setUseType(type);
        if (type === "professional") {
            setProfessionalType(null);
        }
    };

    const handleProfessionalTypeSelect = (type) => {
        setProfessionalType(type);
        if (type === "user") {
            router.push('/user/login');
        }
    };
    

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email: adminLoginData.email,
                password: adminLoginData.password,
                role: 'admin',
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            if (result?.ok) {
                router.push('/admin');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...adminCreateData,
                    role: 'admin'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Account creation failed');
            }

            setShowAdminCreate(false);
            setAdminCreateData({
                email: '',
                password: '',
                firstName: '',
                lastName: ''
            });
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (!useType) {
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center">Welcome to Task Manager</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                onClick={() => handleUserTypeSelect("personal")}
                                className="w-full h-24 text-lg"
                            >
                                Personal Use
                            </Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                onClick={() => handleUserTypeSelect("professional")}
                                className="w-full h-24 text-lg"
                            >
                                Professional Use
                            </Button>
                        </motion.div>
                    </div>
                </div>
            );
        }

        if (useType === "personal") {
            return (
                <section className="flex h-full bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent overflow-y-hidden">
                    <form action="" className="bg-card m-auto w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                        <div className="p-8 pb-6">
                            <div>
                                <Link href="/" aria-label="go home">
                                    Task pulse
                                </Link>
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
                        </div>

                        <div className="bg-muted rounded-(--radius) border p-3">
                            <p className="text-accent-foreground text-center text-sm">
                                Don't have an account ?
                                <Button asChild variant="link" className="px-2">
                                    <Link href="#">Create account</Link>
                                </Button>
                            </p>
                        </div>
                    </form>
                </section>
            );
        }

        if (useType === "professional" && !professionalType) {
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center">Select Professional Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                onClick={() => handleProfessionalTypeSelect("admin")}
                                className="w-full h-24 text-lg"
                            >
                                Admin
                            </Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                onClick={() => handleProfessionalTypeSelect("user")}
                                className="w-full h-24 text-lg"
                            >
                                User
                            </Button>
                        </motion.div>
                    </div>
                </div>
            );
        }

        if (useType === "professional" && professionalType === "admin") {
            return (
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Admin Login</CardTitle>
                        <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdminLogin} className="space-y-4">
                            {error && (
                                <div className="text-red-500 text-sm">{error}</div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={adminLoginData.email}
                                    onChange={(e) => setAdminLoginData({ ...adminLoginData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={adminLoginData.password}
                                    onChange={(e) => setAdminLoginData({ ...adminLoginData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button
                            variant="link"
                            onClick={() => setShowAdminCreate(true)}
                            className="text-sm"
                        >
                            Don't have an account? Create one
                        </Button>
                    </CardFooter>
                </Card>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {renderContent()}
            </motion.div>

            <Dialog open={showAdminCreate} onOpenChange={setShowAdminCreate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Admin Account</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAdminCreate} className="space-y-4">
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="create-email">Email</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={adminCreateData.email}
                                onChange={(e) => setAdminCreateData({ ...adminCreateData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-password">Password</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={adminCreateData.password}
                                onChange={(e) => setAdminCreateData({ ...adminCreateData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={adminCreateData.firstName}
                                onChange={(e) => setAdminCreateData({ ...adminCreateData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={adminCreateData.lastName}
                                onChange={(e) => setAdminCreateData({ ...adminCreateData, lastName: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}