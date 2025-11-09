"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Copy, Check, Plus, Users } from "lucide-react"
import { toast } from "sonner"

export default function StartDebatePage() {
  const router = useRouter()
  const [step, setStep] = useState<"setup" | "waiting">("setup")
  const [caseTitle, setCaseTitle] = useState("")
  const [caseDescription, setCaseDescription] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [role, setRole] = useState<"plaintiff" | "defendant">("plaintiff")

  const generateRoomCode = () => {
    // Generate 6-digit random code
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleCreateRoom = () => {
    if (!caseTitle.trim()) {
      toast.error("Please enter a case title")
      return
    }
    if (!caseDescription.trim()) {
      toast.error("Please enter a case description")
      return
    }

    const code = generateRoomCode()
    setRoomCode(code)

    // Save debate room to localStorage
    const debateRoom = {
      roomCode: code,
      caseTitle: caseTitle.trim(),
      caseDescription: caseDescription.trim(),
      creatorRole: role,
      createdAt: new Date().toISOString(),
      status: "waiting",
      plaintiff: null,
      defendant: null,
    }

    const existingRooms = JSON.parse(localStorage.getItem("debateRooms") || "[]")
    existingRooms.push(debateRoom)
    localStorage.setItem("debateRooms", JSON.stringify(existingRooms))
    
    // IMPORTANT: Save to shared storage so other windows/incognito can access
    localStorage.setItem(`shared_debate_${code}`, JSON.stringify(debateRoom))

    setStep("waiting")
    toast.success("Debate room created!")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    toast.success("Room code copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEnterRoom = () => {
    router.push(`/debate/room/${roomCode}`)
  }

  if (step === "waiting") {
    return (
      <LayoutWrapper>
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-primary">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center animate-pulse">
                  <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl md:text-3xl text-foreground">Room Created!</CardTitle>
                <CardDescription>Share this code with your opponent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Code Display */}
                <div className="bg-muted p-6 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Room Code</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-primary">
                      {roomCode}
                    </p>
                    <Button
                      onClick={copyToClipboard}
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Case Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Case Title</p>
                    <p className="text-base text-foreground">{caseTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Your Role</p>
                    <p className="text-base text-foreground capitalize">
                      {role === "plaintiff" ? "👤 Plaintiff" : "🛡️ Defendant"}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm font-semibold mb-2">📋 Next Steps:</p>
                  <ol className="text-xs space-y-1 text-muted-foreground list-decimal list-inside">
                    <li>Share the room code with your opponent</li>
                    <li>They should click "Join Debate" and enter this code</li>
                    <li>Once they join, you can both enter the debate room</li>
                    <li>Present your arguments and submit to AI for judgment</li>
                  </ol>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={handleEnterRoom}
                    className="w-full bg-primary hover:bg-primary/90 h-12"
                    size="lg"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Enter Debate Room
                  </Button>
                  <Button
                    onClick={() => router.push("/debate")}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Debate Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Plus className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl md:text-3xl text-foreground">Start a Debate</CardTitle>
              </div>
              <CardDescription>
                Set up your case topic and get a room code to share
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Case Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Case Title <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g., Contract Breach Dispute, Property Rights Case..."
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="bg-input border-border text-foreground"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  Give your debate a clear, descriptive title
                </p>
              </div>

              {/* Case Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Case Description <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Provide background and context for the case. What is the main dispute about? This will help frame the debate..."
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  className="bg-input border-border text-foreground min-h-32"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  Describe the case context and main points of dispute
                </p>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Your Role <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRole("plaintiff")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === "plaintiff"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-border hover:border-blue-500/50"
                    }`}
                  >
                    <div className="text-3xl mb-2">👤</div>
                    <p className="font-semibold text-sm">Plaintiff</p>
                    <p className="text-xs text-muted-foreground">Bringing the claim</p>
                  </button>
                  <button
                    onClick={() => setRole("defendant")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === "defendant"
                        ? "border-red-500 bg-red-500/10"
                        : "border-border hover:border-red-500/50"
                    }`}
                  >
                    <div className="text-3xl mb-2">🛡️</div>
                    <p className="font-semibold text-sm">Defendant</p>
                    <p className="text-xs text-muted-foreground">Defending the claim</p>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your opponent will automatically be assigned the opposite role
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  onClick={handleCreateRoom}
                  className="w-full bg-primary hover:bg-primary/90 h-12"
                  size="lg"
                  disabled={!caseTitle.trim() || !caseDescription.trim()}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Debate Room
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}
