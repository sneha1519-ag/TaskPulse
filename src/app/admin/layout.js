'use client';

import React, { useEffect, useState } from 'react';
import AdminNavbar from "@/components/adminComponents/admin-navbar.jsx";

export default function AdminLayout({ children }) {

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