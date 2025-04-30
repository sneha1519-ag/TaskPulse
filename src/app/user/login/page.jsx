'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { email, role: 'user' });
      
      // Use NextAuth signIn first - more reliable for session management
      const result = await signIn("credentials", {
        email,
        password,
        role: "user",
        redirect: false,
      });

      if (result?.error) {
        console.error('NextAuth login error:', result.error);
        
        // Try direct API login as fallback
        const loginResponse = await fetch('/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        if (!loginResponse.ok) {
          const errorData = await loginResponse.json().catch(() => ({}));
          throw new Error(errorData.error || "Login failed");
        }
        
        const loginData = await loginResponse.json();
        console.log('API Login successful, user data:', loginData);
        
        // Store user data in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(loginData.user));
        
        // Sign in with NextAuth again to establish session
        await signIn("credentials", {
          email,
          password,
          role: "user",
          redirect: false,
        });
      }
      
      // Fetch user data to confirm login status and get user details
      const userRes = await fetch(`/api/user/me`);
      if (userRes.ok) {
        const userDataResponse = await userRes.json();
        console.log('User data fetched after login:', userDataResponse);
        
        // Store user data in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(userDataResponse.user));
        
        // Redirect to user dashboard
        console.log('Login successful, redirecting to /user');
        
        // Use replace instead of push to avoid history issues
        window.location.href = "/user";
        return;
      }
      
      throw new Error('Failed to fetch user data after login');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || "An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">User Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Login as User
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 