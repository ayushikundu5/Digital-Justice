"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, User, LogOut } from "lucide-react"

interface UserData {
  email: string
  id: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return (
      <LayoutWrapper>
        <div className="p-4 md:p-8">
          <p className="text-muted-foreground text-sm md:text-base">Loading...</p>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Account Settings</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your AI Court account</p>
        </div>

        <div className="max-w-2xl space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-foreground">Profile Information</CardTitle>
              <CardDescription className="text-xs md:text-sm">Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-input border-border text-foreground text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User ID
                </label>
                <Input
                  type="text"
                  value={user.id}
                  disabled
                  className="bg-input border-border text-foreground text-xs break-all"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-foreground">Account Stats</CardTitle>
              <CardDescription className="text-xs md:text-sm">Your activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs md:text-sm text-muted-foreground">Total Cases Created</span>
                  <span className="font-semibold text-foreground text-sm md:text-base">
                    {JSON.parse(localStorage.getItem("cases") || "[]").length}
                  </span>
                </div>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs md:text-sm text-muted-foreground">Cases Completed</span>
                  <span className="font-semibold text-foreground text-sm md:text-base">
                    {
                      JSON.parse(localStorage.getItem("cases") || "[]").filter((c: any) => c.status === "completed")
                        .length
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive text-lg md:text-xl">Danger Zone</CardTitle>
              <CardDescription className="text-xs md:text-sm">Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground hover:bg-red-700 w-full flex gap-2 justify-center text-sm md:text-base"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}
