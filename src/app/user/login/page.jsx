'use client';

import { useState } from 'react';
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
      
      // Try direct API login first
      const loginResponse = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      let userData = null;
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('Login successful, user data:', loginData);
        userData = loginData.user;
      } else {
        // Fallback to nextauth credentials
        console.log('Direct API login failed, trying NextAuth...');
        const result = await signIn("credentials", {
          email,
          password,
          role: "user",
          redirect: false,
        });

        if (result?.error) {
          console.error('NextAuth login error:', result.error);
          setError(result.error);
          setLoading(false);
          return;
        }

        // Fetch user data after successful NextAuth login
        const userRes = await fetch(`/api/user/me`);
        if (userRes.ok) {
          const userDataResponse = await userRes.json();
          console.log('User data fetched after login:', userDataResponse);
          userData = userDataResponse.user;
        } else {
          console.error('Failed to fetch user data after login');
          const errorData = await userRes.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch user data');
        }
      }
      
      if (!userData || !userData._id) {
        console.error('No valid user data received');
        throw new Error('Invalid user data received');
      }
      
      // Store user data in sessionStorage
      console.log('Storing user data in sessionStorage:', userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      
      // If login is successful, redirect to the user page
      console.log('Login and user data storage successful, redirecting to /user');
      router.push("/user");
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