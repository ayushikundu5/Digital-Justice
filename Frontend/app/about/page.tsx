"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Gavel, BookOpen } from "lucide-react"

export default function AboutPage() {
  return (
    <LayoutWrapper>
      <div className="p-4 md:p-8">
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">About AI Court</h1>
          <p className="text-sm md:text-lg text-muted-foreground">
            Revolutionary legal simulation platform powered by artificial intelligence
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-8 md:mb-12">
          <Card className="bg-card border-border">
            <CardHeader>
              <Brain className="w-6 h-6 md:w-8 md:h-8 text-accent mb-2" />
              <CardTitle className="text-base md:text-lg text-foreground">AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-xs md:text-sm text-muted-foreground">
              Advanced machine learning algorithms analyze legal arguments and render verdicts based on legal precedent
              and logical reasoning.
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <Gavel className="w-6 h-6 md:w-8 md:h-8 text-accent mb-2" />
              <CardTitle className="text-base md:text-lg text-foreground">Legal Simulation</CardTitle>
            </CardHeader>
            <CardContent className="text-xs md:text-sm text-muted-foreground">
              Practice courtroom scenarios in a safe, simulated environment. Perfect for legal education and case
              preparation.
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-accent mb-2" />
              <CardTitle className="text-base md:text-lg text-foreground">Evidence-Based</CardTitle>
            </CardHeader>
            <CardContent className="text-xs md:text-sm text-muted-foreground">
              Submit evidence and statements from both sides for comprehensive analysis and fair judgment.
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border mb-6 md:mb-8">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-foreground">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm md:text-base">1. Create a Case</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Start by creating a new case with a title, case number, and detailed description of the legal matter.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm md:text-base">2. Plaintiff Presents Case</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                The plaintiff submits their statement, arguments, and any supporting evidence to present their side.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm md:text-base">3. Defendant Responds</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                The defendant provides their statement, defense, and counter-arguments with supporting evidence.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm md:text-base">4. AI Judge Renders Verdict</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                The AI Judge analyzes all arguments and evidence, applying legal reasoning to render a fair verdict.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-foreground">About the AI Judge</CardTitle>
          </CardHeader>
          <CardContent className="text-xs md:text-sm text-muted-foreground space-y-4">
            <p>
              The AI Judge is built on state-of-the-art language models trained on legal precedent, case law, and
              judicial reasoning patterns. It provides:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Objective analysis of legal arguments from both parties</li>
              <li>Logical reasoning based on presented evidence</li>
              <li>Fair and impartial judgment</li>
              <li>Detailed explanations of verdicts</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  )
}
