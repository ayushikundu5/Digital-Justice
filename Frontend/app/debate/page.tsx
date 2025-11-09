"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, LogIn, Users, Zap } from "lucide-react"

export default function DebatePage() {
  const router = useRouter()

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              <h1 className="text-3xl md:text-5xl font-bold text-foreground">Live Debate</h1>
            </div>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Engage in real-time legal debates with another user. Present your arguments, counter each other's claims, and let AI judge the outcome.
            </p>
          </div>

          {/* Features Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <Users className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">2-Player Mode</p>
                <p className="text-xs text-muted-foreground">Real-time interaction</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <Zap className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">AI Judgment</p>
                <p className="text-xs text-muted-foreground">Unbiased verdict</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <MessageSquare className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Structured Debate</p>
                <p className="text-xs text-muted-foreground">Turn-based arguments</p>
              </div>
            </div>
          </div>

          {/* Main Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Debate */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl md:text-2xl text-foreground">Start a Debate</CardTitle>
                <CardDescription className="text-sm">
                  Create a new debate room and invite an opponent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => router.push("/debate/start")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Debate Room
                </Button>
                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <p>• Choose your case topic</p>
                  <p>• Get a unique room code</p>
                  <p>• Share with your opponent</p>
                  <p>• Argue as Plaintiff or Defendant</p>
                </div>
              </CardContent>
            </Card>

            {/* Join Debate */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-all">
                  <LogIn className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl md:text-2xl text-foreground">Join a Debate</CardTitle>
                <CardDescription className="text-sm">
                  Enter a room code to join an existing debate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => router.push("/debate/join")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                  size="lg"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Join Debate Room
                </Button>
                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <p>• Receive code from debate creator</p>
                  <p>• Enter the 6-digit room code</p>
                  <p>• Join as opposing party</p>
                  <p>• Present your arguments</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="mt-8 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-foreground">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Create or Join</p>
                    <p className="text-xs text-muted-foreground">Start a debate room or join using a 6-digit code</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Present Arguments</p>
                    <p className="text-xs text-muted-foreground">Both parties present their case: Plaintiff vs. Defendant</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Submit to AI</p>
                    <p className="text-xs text-muted-foreground">Once both parties submit, AI analyzes and renders verdict</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-sm">View Results</p>
                    <p className="text-xs text-muted-foreground">Get comprehensive AI judgment with detailed reasoning</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}
