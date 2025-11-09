"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scale, FileText, User, Shield, AlertCircle, ArrowLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface CaseData {
  id: string
  title: string
  plaintiff: string
  defendant: string
  evidence?: string
  verdict?: {
    winner: string
    reasoning: string
    confidence: string
    model: string
    plaintiff_score?: number
    defendant_score?: number
    reasoning_model?: string
  }
  status: string
  createdAt: string
}

export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [caseData, setCaseData] = useState<CaseData | null>(null)

  useEffect(() => {
    const cases = JSON.parse(localStorage.getItem("cases") || "[]")
    const foundCase = cases.find((c: CaseData) => c.id === params.id)
    if (foundCase) {
      setCaseData(foundCase)
    }
  }, [params.id])

  if (!caseData) {
    return (
      <LayoutWrapper>
        <div className="p-4 md:p-8">
          <p className="text-muted-foreground text-sm md:text-base">Loading case...</p>
        </div>
      </LayoutWrapper>
    )
  }

  const getWinnerBadgeColor = (winner: string) => {
    if (winner.toLowerCase() === "plaintiff") return "bg-blue-600 text-white"
    if (winner.toLowerCase() === "defendant") return "bg-red-600 text-white"
    return "bg-gray-600 text-white"
  }

  const getConfidenceBadgeColor = (confidence: string) => {
    if (confidence.toLowerCase() === "high") return "bg-green-600 text-white"
    if (confidence.toLowerCase() === "medium") return "bg-yellow-600 text-white"
    return "bg-orange-600 text-white"
  }

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/cases")}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cases
            </Button>
            
            <div className="flex items-start gap-4">
              <Scale className="w-10 h-10 text-primary flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 break-words">{caseData.title}</h1>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="outline" className="text-xs">
                    Case ID: {caseData.id}
                  </Badge>
                  <Badge className={caseData.status === "resolved" ? "bg-green-600" : "bg-yellow-600"}>
                    {caseData.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Filed: {new Date(caseData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Plaintiff Statement */}
          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-lg md:text-xl text-foreground">Plaintiff Statement</CardTitle>
              </div>
              <CardDescription className="text-xs md:text-sm">Claims and arguments presented</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {caseData.plaintiff}
              </p>
            </CardContent>
          </Card>

          {/* Defendant Statement */}
          <Card className="mb-6 border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                <CardTitle className="text-lg md:text-xl text-foreground">Defendant Statement</CardTitle>
              </div>
              <CardDescription className="text-xs md:text-sm">Defense and counter-arguments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {caseData.defendant}
              </p>
            </CardContent>
          </Card>

          {/* Evidence (if provided) */}
          {caseData.evidence && caseData.evidence.trim() !== "" && (
            <Card className="mb-6 border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <CardTitle className="text-lg md:text-xl text-foreground">Additional Evidence</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                  Supporting documents and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {caseData.evidence}
                </p>
              </CardContent>
            </Card>
          )}

          {/* AI Verdict */}
          {caseData.verdict ? (
            <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-br from-card to-accent/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="w-6 h-6 text-yellow-500" />
                  <CardTitle className="text-xl md:text-2xl text-foreground">AI Judge Verdict</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                  Analysis and legal judgment by artificial intelligence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Winner and Confidence */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-xs text-muted-foreground mb-2">Winner</p>
                    <Badge className={`${getWinnerBadgeColor(caseData.verdict.winner)} text-sm px-3 py-1`}>
                      {caseData.verdict.winner}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-xs text-muted-foreground mb-2">Confidence</p>
                    <Badge className={`${getConfidenceBadgeColor(caseData.verdict.confidence)} text-sm px-3 py-1`}>
                      {caseData.verdict.confidence}
                    </Badge>
                  </div>
                </div>

                {/* Scores */}
                {(caseData.verdict.plaintiff_score !== undefined || caseData.verdict.defendant_score !== undefined) && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-3">Analysis Scores</p>
                    <div className="grid grid-cols-2 gap-4">
                      {caseData.verdict.plaintiff_score !== undefined && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                          <p className="text-xs text-muted-foreground mb-1">Plaintiff Score</p>
                          <p className="text-2xl font-bold text-blue-600">{caseData.verdict.plaintiff_score}</p>
                        </div>
                      )}
                      {caseData.verdict.defendant_score !== undefined && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                          <p className="text-xs text-muted-foreground mb-1">Defendant Score</p>
                          <p className="text-2xl font-bold text-red-600">{caseData.verdict.defendant_score}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Reasoning */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 text-base md:text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Legal Reasoning
                  </h3>
                  <div className="p-4 bg-background/50 border border-border rounded-lg">
                    <p className="text-foreground text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                      {caseData.verdict.reasoning}
                    </p>
                  </div>
                </div>

                {/* AI Model Info */}
                <div className="pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Verdict Model:</span>{" "}
                      <span className="font-mono">{caseData.verdict.model}</span>
                    </div>
                    {caseData.verdict.reasoning_model && (
                      <div>
                        <span className="font-medium">Reasoning Model:</span>{" "}
                        <span className="font-mono">{caseData.verdict.reasoning_model}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-l-4 border-l-gray-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-lg md:text-xl text-foreground">No Verdict Available</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  This case does not have a verdict yet. The case may still be in progress.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}
