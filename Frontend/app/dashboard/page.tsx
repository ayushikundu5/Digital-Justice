"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Scale, Clock, CheckCircle } from "lucide-react"

interface CaseStats {
  total: number
  pending: number
  completed: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<CaseStats>({ total: 0, pending: 0, completed: 0 })
  const [recentCases, setRecentCases] = useState([])

  const loadStats = () => {
    const cases = JSON.parse(localStorage.getItem("cases") || "[]")
    setStats({
      total: cases.length,
      pending: cases.filter((c: any) => c.status === "pending").length,
      completed: cases.filter((c: any) => c.status === "completed").length,
    })
    setRecentCases(cases.slice(-3).reverse())
  }

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) router.push("/")

    loadStats()

    window.addEventListener("storage", loadStats)

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadStats()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("storage", loadStats)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [router])

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Welcome to AI Court - Manage your legal cases</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="bg-card border-border hover:border-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" />
                Total Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-accent">{stats.total}</div>
              <p className="text-xs md:text-sm text-muted-foreground">All cases in system</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-accent">{stats.pending}</div>
              <p className="text-xs md:text-sm text-muted-foreground">Awaiting verdict</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-accent">{stats.completed}</div>
              <p className="text-xs md:text-sm text-muted-foreground">Cases with verdict</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Cases */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Recent Cases</h2>
            <Link href="/cases/new">
              <Button className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-primary">New Case</Button>
            </Link>
          </div>

          {recentCases.length > 0 ? (
            <div className="space-y-3">
              {recentCases.map((caseItem: any) => (
                <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                  <Card className="bg-card border-border hover:border-accent transition-all cursor-pointer">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground text-sm md:text-base break-words">
                            {caseItem.title}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground">{caseItem.caseNumber}</p>
                        </div>
                        <span
                          className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            caseItem.status === "completed"
                              ? "bg-green-900 text-green-200"
                              : "bg-yellow-900 text-yellow-200"
                          }`}
                        >
                          {caseItem.status === "completed" ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-6 md:p-8 text-center">
                <Scale className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm md:text-base text-muted-foreground">
                  No cases yet. Create a new case to get started.
                </p>
                <Link href="/cases/new" className="mt-4 inline-block">
                  <Button className="bg-accent text-accent-foreground hover:bg-primary">Create First Case</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}
