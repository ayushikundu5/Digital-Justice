"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Plus } from "lucide-react"

interface Case {
  id: string
  title: string
  caseNumber: string
  status: "pending" | "completed"
  createdAt: string
}

export default function CasesPage() {
  const router = useRouter()
  const [cases, setCases] = useState<Case[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const loadCases = () => {
    const storedCases = JSON.parse(localStorage.getItem("cases") || "[]")
    setCases(storedCases.sort((a: Case, b: Case) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  useEffect(() => {
    loadCases()

    window.addEventListener("storage", loadCases)

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadCases()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("storage", loadCases)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">All Cases</h1>
          <p className="text-sm md:text-base text-muted-foreground">Browse and manage all legal cases</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search cases by title or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-input border-border text-foreground text-sm"
          />
          <Link href="/cases/new">
            <Button className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-primary flex gap-2 justify-center">
              <Plus className="w-4 h-4" />
              New Case
            </Button>
          </Link>
        </div>

        {filteredCases.length > 0 ? (
          <div className="grid gap-4">
            {filteredCases.map((caseItem) => (
              <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                <Card className="bg-card border-border hover:border-accent transition-all cursor-pointer group">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex gap-3 min-w-0">
                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-accent mt-1 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground text-sm md:text-lg group-hover:text-accent transition-colors break-words">
                            {caseItem.title}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground">Case #{caseItem.caseNumber}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(caseItem.createdAt).toLocaleDateString()}
                          </p>
                        </div>
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
            <CardContent className="p-6 md:p-12 text-center">
              <FileText className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm md:text-base text-muted-foreground">
                {searchTerm ? "No cases match your search." : "No cases yet."}
              </p>
              <Link href="/cases/new" className="mt-4 inline-block">
                <Button className="bg-accent text-accent-foreground hover:bg-primary text-sm md:text-base">
                  Create Your First Case
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </LayoutWrapper>
  )
}
