"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gavel } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ email, id: Math.random().toString() }))
      router.push("/dashboard")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button onClick={toggleTheme} variant="ghost" size="icon" className="rounded-lg hover:bg-muted">
          {theme === "dark" ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a1 1 0 00-1.415 1.415l2.12 2.12a1 1 0 001.415-1.415zM2.05 6.464l2.12 2.12a1 1 0 101.415-1.415L3.464 5.05a1 1 0 10-1.415 1.415zm13.657-1.414l-2.121-2.121a1 1 0 00-1.414 1.414l2.12 2.121a1 1 0 001.415-1.415zM5.05 13.464l-2.12-2.12a1 1 0 00-1.415 1.415l2.12 2.12a1 1 0 001.415-1.415zM20 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM0 10.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8 gap-2">
          <Gavel className="w-8 h-8 text-accent" />
          <h1 className="text-3xl font-bold text-foreground">AI Court</h1>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to AI Court</CardTitle>
            <CardDescription className="text-center">Sign in to access the legal simulation platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input border-border text-foreground"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-semibold"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground mt-6 text-sm">Demo mode: Use any email/password to continue</p>
      </div>
    </div>
  )
}
