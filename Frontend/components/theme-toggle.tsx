"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThemeToggleProps {
  theme: "light" | "dark"
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <Button
      onClick={onToggle}
      variant="ghost"
      className="w-full justify-start gap-3 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-5 h-5 text-yellow-400" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-slate-600" />
          <span>Dark Mode</span>
        </>
      )}
    </Button>
  )
}
