'use client';

import React, { useEffect } from 'react';
import AdminNavbar from "@/components/adminComponents/admin-navbar.jsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/user');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user?.role === 'admin') {
    return (
      <div className="w-full">
        <AdminNavbar/>
        <div className="flex min-h-screen pt-[4rem]">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return null;
} 