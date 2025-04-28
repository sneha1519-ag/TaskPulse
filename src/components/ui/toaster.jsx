"use client"

import { ToastProvider } from "./toast"

export function Toaster({ children }) {
  return <ToastProvider>{children}</ToastProvider>
}
