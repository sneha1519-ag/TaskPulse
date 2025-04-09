'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid invitation link - No token provided');
      setLoading(false);
      return;
    }

    const verifyAndAcceptInvitation = async () => {
      try {
        console.log('Verifying token:', token);
        // First verify the token
        const verifyResponse = await fetch(`/api/invitation/verify?token=${token}`);
        const verifyData = await verifyResponse.json();
        
        if (!verifyResponse.ok) {
          console.error('Verification failed:', verifyData);
          throw new Error(verifyData.error || 'Invalid invitation token');
        }

        console.log('Token verified successfully:', verifyData);

        // If verification successful, accept the invitation
        const acceptResponse = await fetch('/api/invitation/accept', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const acceptData = await acceptResponse.json();
        
        if (!acceptResponse.ok) {
          console.error('Acceptance failed:', acceptData);
          const errorMessage = acceptData.error || 'Failed to accept invitation';
          const errorDetails = acceptData.details ? `\nDetails: ${acceptData.details}` : '';
          throw new Error(`${errorMessage}${errorDetails}`);
        }

        console.log('Invitation accepted successfully:', acceptData);
        setSuccess(true);
        
        // Redirect to user page after a short delay
        setTimeout(() => {
          router.push('/user');
        }, 2000);
      } catch (err) {
        console.error('Error in invitation process:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    verifyAndAcceptInvitation();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline whitespace-pre-line">{error}</span>
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">Invitation accepted successfully. Redirecting...</span>
        </div>
      </div>
    );
  }

  return null;
} 