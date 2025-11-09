"use client"

import type React from "react"

import { Analytics } from "@vercel/analytics/next"
import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider>
      {mounted && (
        <>
          {children}
          <Analytics />
        </>
      )}
      {!mounted && <div className="min-h-screen bg-background" />}
    </ThemeProvider>
  )
}
