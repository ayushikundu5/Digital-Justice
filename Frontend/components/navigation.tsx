"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Gavel, Home, FileText, Archive, Info, User, LogOut, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "@/components/theme-provider"

interface NavigationProps {
  onNavigate?: () => void
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/cases/new", label: "New Case", icon: FileText },
  { href: "/debate", label: "Live Debate", icon: MessageSquare },
  { href: "/cases", label: "All Cases", icon: Archive },
  { href: "/about", label: "About", icon: Info },
  { href: "/account", label: "Account", icon: User },
]

export function Navigation({ onNavigate }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <nav className="w-full h-full bg-sidebar border-r border-sidebar-border p-6 flex flex-col">
      <Link href="/dashboard" className="flex items-center gap-2 mb-8" onClick={onNavigate}>
        <Gavel className="w-6 h-6 text-sidebar-accent flex-shrink-0" />
        <h1 className="text-xl font-bold text-sidebar-foreground">AI Court</h1>
      </Link>

      <div className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm md:text-base">{item.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="space-y-3 border-t border-sidebar-border pt-4">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />

        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm md:text-base">Logout</span>
        </Button>
      </div>
    </nav>
  )
}
