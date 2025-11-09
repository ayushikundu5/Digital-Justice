"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "./navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/"
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-sidebar border border-sidebar-border"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 w-64 bg-sidebar border-r border-sidebar-border min-h-screen transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Navigation onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 bg-background w-full md:w-auto">
        {/* Padding adjustment for mobile menu button */}
        <div className="pt-16 md:pt-0">{children}</div>
      </main>
    </div>
  )
}
