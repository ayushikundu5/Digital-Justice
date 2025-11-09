"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Scale, AlertCircle } from "lucide-react"
import { submitCase, generateReasoning } from "@/lib/api"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NewCasePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    plaintiff: "",
    defendant: "",
    evidence: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [backendError, setBackendError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setBackendError(false)

    try {
      // Step 1: Submit case to get verdict
      toast.info("Analyzing case with AI...")
      const verdictResponse = await submitCase({
        plaintiff: formData.plaintiff,
        defendant: formData.defendant,
        evidence: formData.evidence,
      })

      // Step 2: Generate detailed reasoning using GenAI
      toast.info("Generating detailed reasoning...")
      const reasoningResponse = await generateReasoning({
        plaintiff: formData.plaintiff,
        defendant: formData.defendant,
        evidence: formData.evidence,
        verdict: verdictResponse.winner,
      })

      // Step 3: Create case object with all data
      const caseData = {
        id: Date.now().toString(),
        title: formData.title,
        plaintiff: formData.plaintiff,
        defendant: formData.defendant,
        evidence: formData.evidence,
        verdict: {
          winner: verdictResponse.winner,
          reasoning: reasoningResponse.reasoning,
          confidence: verdictResponse.confidence,
          model: verdictResponse.model,
          plaintiff_score: verdictResponse.plaintiff_score,
          defendant_score: verdictResponse.defendant_score,
          reasoning_model: reasoningResponse.model,
        },
        status: "resolved",
        createdAt: new Date().toISOString(),
      }

      // Step 4: Save to localStorage
      const cases = JSON.parse(localStorage.getItem("cases") || "[]")
      cases.push(caseData)
      localStorage.setItem("cases", JSON.stringify(cases))

      toast.success("Case submitted and verdict generated!")
      
      // Step 5: Navigate to case details
      setTimeout(() => {
        router.push(`/cases/${caseData.id}`)
      }, 500)
    } catch (error) {
      console.error("Error submitting case:", error)
      setBackendError(true)
      toast.error("Failed to submit case. Please make sure the backend server is running.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">Create New Case</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
            Submit a legal case for AI-powered judgment and reasoning
          </p>

          {backendError && (
            <Alert className="mb-6 bg-destructive/10 border-destructive">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                Cannot connect to the backend server. Please ensure the Flask backend is running on{" "}
                <code className="font-mono bg-background/50 px-1 py-0.5 rounded">http://localhost:5000</code>
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl text-foreground">Case Information</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Provide the case title and statements from both parties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium text-foreground">
                    Case Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Smith vs. Johnson - Contract Dispute"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-input border-border text-foreground text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Give your case a descriptive title</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium text-foreground">
                    Plaintiff Statement <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Enter the plaintiff's arguments, claims, and perspective on the case..."
                    value={formData.plaintiff}
                    onChange={(e) => setFormData({ ...formData, plaintiff: e.target.value })}
                    required
                    className="bg-input border-border text-foreground min-h-32 text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe the plaintiff's position, claims, and supporting arguments
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium text-foreground">
                    Defendant Statement <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Enter the defendant's defense, counter-arguments, and perspective on the case..."
                    value={formData.defendant}
                    onChange={(e) => setFormData({ ...formData, defendant: e.target.value })}
                    required
                    className="bg-input border-border text-foreground min-h-32 text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe the defendant's position, defenses, and counter-arguments
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium text-foreground">
                    Additional Evidence (Optional)
                  </label>
                  <Textarea
                    placeholder="Enter any additional evidence, documents, witness statements, or relevant information..."
                    value={formData.evidence}
                    onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                    className="bg-input border-border text-foreground min-h-24 text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Include any supporting evidence, documents, or additional context
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 text-sm md:text-base h-11"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin">⚖️</span>
                        <span>Processing with AI...</span>
                      </>
                    ) : (
                      <>
                        <Scale className="w-4 h-4" />
                        <span>Submit Case for AI Judgment</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    The AI will analyze the case and generate a verdict with detailed reasoning
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}
