"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Scale, User, Shield, AlertCircle, CheckCircle, RefreshCw, Clock, Zap } from "lucide-react"
import { toast } from "sonner"
import { submitCase, generateReasoning } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Configurable timeout (1 minute for dev, can be changed for production)
const DEBATE_TIMEOUT_MS = 60 * 1000 // 1 minute in milliseconds
const DEBATE_TIMEOUT_DISPLAY = "1 minute" // For display purposes

interface ChatMessage {
  id: string
  role: "plaintiff" | "defendant"
  message: string
  timestamp: number
}

interface DebateRoom {
  roomCode: string
  caseTitle: string
  caseDescription: string
  creatorRole: "plaintiff" | "defendant"
  status: string
  plaintiff: string | null
  defendant: string | null
  plaintiffSubmitted: boolean
  defendantSubmitted: boolean
  chat: ChatMessage[]
  startTime?: number
  verdict?: any
}

export default function DebateRoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomCode = params.roomCode as string
  const chatEndRef = useRef<HTMLDivElement>(null)

  const [room, setRoom] = useState<DebateRoom | null>(null)
  const [userRole, setUserRole] = useState<"plaintiff" | "defendant" | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(DEBATE_TIMEOUT_MS)
  const [debateStarted, setDebateStarted] = useState(false)

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [room?.chat])

  // Timer countdown
  useEffect(() => {
    if (!debateStarted || isProcessing || (room?.status === "completed")) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1000
        if (newTime <= 0) {
          handleTimeUp()
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [debateStarted, isProcessing, room?.status])

  // Polling to check for updates from other user
  useEffect(() => {
    const loadRoom = () => {
      const debateRooms = JSON.parse(localStorage.getItem("debateRooms") || "[]")
      const foundRoom = debateRooms.find((r: any) => r.roomCode === roomCode)

      if (!foundRoom) {
        const sharedRoom = localStorage.getItem(`shared_debate_${roomCode}`)
        if (sharedRoom) {
          try {
            const parsedRoom = JSON.parse(sharedRoom)
            if (!parsedRoom.chat) parsedRoom.chat = []
            setRoom(parsedRoom)
            
            if (!debateRooms.find((r: any) => r.roomCode === roomCode)) {
              debateRooms.push(parsedRoom)
              localStorage.setItem("debateRooms", JSON.stringify(debateRooms))
            }
            return
          } catch (e) {
            console.error("Error parsing shared room:", e)
          }
        }
        
        toast.error("Room not found")
        router.push("/debate")
        return
      }

      if (!foundRoom.chat) foundRoom.chat = []
      if (!foundRoom.plaintiffSubmitted) foundRoom.plaintiffSubmitted = false
      if (!foundRoom.defendantSubmitted) foundRoom.defendantSubmitted = false

      setRoom(foundRoom)
      localStorage.setItem(`shared_debate_${roomCode}`, JSON.stringify(foundRoom))

      // Check if both players have joined (chat has messages from both)
      if (!debateStarted && foundRoom.chat && foundRoom.chat.length > 0) {
        const hasPlaintiff = foundRoom.chat.some((m: ChatMessage) => m.role === "plaintiff")
        const hasDefendant = foundRoom.chat.some((m: ChatMessage) => m.role === "defendant")
        
        if (hasPlaintiff && hasDefendant && !foundRoom.startTime) {
          // Start the timer
          foundRoom.startTime = Date.now()
          updateRoomData(foundRoom)
          setDebateStarted(true)
          toast.success("Debate started! Timer begins now.")
        } else if (foundRoom.startTime) {
          setDebateStarted(true)
          const elapsed = Date.now() - foundRoom.startTime
          setTimeLeft(Math.max(0, DEBATE_TIMEOUT_MS - elapsed))
        }
      }
    }

    loadRoom()
    const interval = setInterval(loadRoom, 2000)
    return () => clearInterval(interval)
  }, [roomCode, router, debateStarted])

  useEffect(() => {
    const storedRole = localStorage.getItem(`debate_${roomCode}_role`)
    if (storedRole) {
      setUserRole(storedRole as "plaintiff" | "defendant")
    }
  }, [roomCode])

  const updateRoomData = (updatedRoom: DebateRoom) => {
    const debateRooms = JSON.parse(localStorage.getItem("debateRooms") || "[]")
    let roomIndex = debateRooms.findIndex((r: any) => r.roomCode === roomCode)

    if (roomIndex === -1) {
      debateRooms.push(updatedRoom)
      roomIndex = debateRooms.length - 1
    } else {
      debateRooms[roomIndex] = updatedRoom
    }

    localStorage.setItem("debateRooms", JSON.stringify(debateRooms))
    localStorage.setItem(`shared_debate_${roomCode}`, JSON.stringify(updatedRoom))
    setRoom(updatedRoom)
  }

  const handleRoleSelection = (role: "plaintiff" | "defendant") => {
    setUserRole(role)
    localStorage.setItem(`debate_${roomCode}_role`, role)
    toast.success(`You are now the ${role === "plaintiff" ? "Plaintiff" : "Defendant"}`)
    
    // Send initial join message
    if (room) {
      const joinMessage: ChatMessage = {
        id: `${Date.now()}_${Math.random()}`,
        role: role,
        message: `${role === "plaintiff" ? "Plaintiff" : "Defendant"} has joined the debate.`,
        timestamp: Date.now()
      }
      
      const updatedRoom = {
        ...room,
        chat: [...(room.chat || []), joinMessage]
      }
      
      updateRoomData(updatedRoom)
    }
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !room || !userRole) return

    const newMessage: ChatMessage = {
      id: `${Date.now()}_${Math.random()}`,
      role: userRole,
      message: chatMessage.trim(),
      timestamp: Date.now()
    }

    const updatedRoom = {
      ...room,
      chat: [...(room.chat || []), newMessage]
    }

    updateRoomData(updatedRoom)
    setChatMessage("")
  }

  const handleTimeUp = async () => {
    if (isProcessing || room?.status === "completed") return
    
    toast.info("Time's up! Submitting to AI for judgment...")
    await handleGenerateVerdict()
  }

  const handleManualSubmit = async () => {
    if (!room) return
    
    if (!window.confirm("Are you sure you want to submit to AI now? This will end the debate.")) {
      return
    }
    
    await handleGenerateVerdict()
  }

  const handleGenerateVerdict = async () => {
    if (!room) return
    
    setIsProcessing(true)
    toast.info("Generating AI verdict from debate conversation...")

    try {
      // Compile all messages into arguments
      const plaintiffMessages = room.chat
        ?.filter((m: ChatMessage) => m.role === "plaintiff")
        .map((m: ChatMessage) => m.message)
        .join("\n\n") || "No arguments provided"

      const defendantMessages = room.chat
        ?.filter((m: ChatMessage) => m.role === "defendant")
        .map((m: ChatMessage) => m.message)
        .join("\n\n") || "No arguments provided"

      // Step 1: Get verdict
      const verdictResponse = await submitCase({
        plaintiff: plaintiffMessages,
        defendant: defendantMessages,
        evidence: room.caseDescription,
      })

      // Step 2: Generate reasoning
      const reasoningResponse = await generateReasoning({
        plaintiff: plaintiffMessages,
        defendant: defendantMessages,
        evidence: room.caseDescription,
        verdict: verdictResponse.winner,
      })

      // Step 3: Save verdict
      const updatedRoom = {
        ...room,
        verdict: {
          winner: verdictResponse.winner,
          reasoning: reasoningResponse.reasoning,
          confidence: verdictResponse.confidence,
          model: verdictResponse.model,
          plaintiff_score: verdictResponse.plaintiff_score,
          defendant_score: verdictResponse.defendant_score,
        },
        status: "completed",
        plaintiffSubmitted: true,
        defendantSubmitted: true,
      }

      updateRoomData(updatedRoom)
      toast.success("Verdict generated!")
    } catch (error) {
      toast.error("Failed to generate verdict. Please ensure backend is running.")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimeProgress = () => {
    return ((DEBATE_TIMEOUT_MS - timeLeft) / DEBATE_TIMEOUT_MS) * 100
  }

  if (!room) {
    return (
      <LayoutWrapper>
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading room...</p>
        </div>
      </LayoutWrapper>
    )
  }

  if (!userRole) {
    return (
      <LayoutWrapper>
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground">Choose Your Role</CardTitle>
                <CardDescription>Select which side you'll argue for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Case:</p>
                  <p className="text-base text-foreground">{room.caseTitle}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleRoleSelection("plaintiff")}
                    className="p-6 rounded-lg border-2 border-blue-500 hover:bg-blue-500/10 transition-all"
                  >
                    <User className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                    <p className="font-semibold">Plaintiff</p>
                    <p className="text-xs text-muted-foreground">Bringing the claim</p>
                  </button>
                  <button
                    onClick={() => handleRoleSelection("defendant")}
                    className="p-6 rounded-lg border-2 border-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Shield className="w-12 h-12 mx-auto mb-2 text-red-500" />
                    <p className="font-semibold">Defendant</p>
                    <p className="text-xs text-muted-foreground">Defending</p>
                  </button>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  💡 Choose the opposite role of your opponent
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  // Show verdict if debate is completed
  if (room.status === "completed" && room.verdict) {
    return (
      <LayoutWrapper>
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-2 border-primary">
              <CardHeader className="text-center">
                <Scale className="w-12 h-12 mx-auto mb-2 text-primary" />
                <CardTitle className="text-2xl">AI Verdict</CardTitle>
                <CardDescription>{room.caseTitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge className={room.verdict.winner === "Plaintiff" ? "bg-blue-600 text-white" : room.verdict.winner === "Defendant" ? "bg-red-600 text-white" : "bg-gray-600 text-white"}>
                    Winner: {room.verdict.winner}
                  </Badge>
                  <Badge className={room.verdict.confidence === "high" ? "bg-green-600" : "bg-yellow-600"}>
                    {room.verdict.confidence} confidence
                  </Badge>
                </div>

                {room.verdict.plaintiff_score !== undefined && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <p className="text-sm text-muted-foreground mb-1">Plaintiff Score</p>
                      <p className="text-3xl font-bold text-blue-600">{room.verdict.plaintiff_score}</p>
                    </div>
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-sm text-muted-foreground mb-1">Defendant Score</p>
                      <p className="text-3xl font-bold text-red-600">{room.verdict.defendant_score}</p>
                    </div>
                  </div>
                )}

                <div className="bg-muted p-4 rounded-lg border border-border">
                  <p className="font-semibold mb-2 text-lg">Detailed Reasoning:</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{room.verdict.reasoning}</p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => router.push("/debate")} className="flex-1" variant="outline">
                    Back to Debate Home
                  </Button>
                  <Button onClick={() => router.push("/cases")} className="flex-1">
                    View All Cases
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Case Info & Timer */}
            <div className="lg:col-span-1 space-y-6">
              {/* Case Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{room.caseTitle}</CardTitle>
                  <CardDescription>
                    Code: <span className="font-mono font-bold text-primary">{roomCode}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="mb-3">
                    {userRole === "plaintiff" ? "👤 Plaintiff" : "🛡️ Defendant"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{room.caseDescription}</p>
                </CardContent>
              </Card>

              {/* Timer */}
              {debateStarted && !isProcessing && (
                <Card className={`border-2 ${timeLeft <= 10000 ? 'border-red-500 animate-pulse' : 'border-primary'}`}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <CardTitle className="text-base">Time Remaining</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <p className={`text-4xl font-bold font-mono ${timeLeft <= 10000 ? 'text-red-600' : 'text-primary'}`}>
                        {formatTime(timeLeft)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Auto-submit at 0:00
                      </p>
                    </div>
                    <Progress value={getTimeProgress()} className="h-2" />
                    <Button
                      onClick={handleManualSubmit}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={isProcessing}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Submit to AI Now
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Info */}
              <Alert className="bg-primary/10">
                <MessageSquare className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>💬 Chat freely!</strong><br />
                  Debate will auto-submit to AI after {DEBATE_TIMEOUT_DISPLAY}.
                </AlertDescription>
              </Alert>
            </div>

            {/* Right Column - Chat */}
            <div className="lg:col-span-2">
              <Card className="h-[calc(100vh-12rem)]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">Live Debate Chat</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {room.chat?.length || 0} messages
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-[calc(100%-5rem)]">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                    {room.chat && room.chat.length > 0 ? (
                      room.chat.map((msg: ChatMessage) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === userRole ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.role === userRole
                                ? 'bg-primary text-primary-foreground'
                                : msg.role === 'plaintiff'
                                ? 'bg-blue-500/20 text-foreground border border-blue-500/30'
                                : 'bg-red-500/20 text-foreground border border-red-500/30'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {msg.role === 'plaintiff' ? (
                                <User className="w-3 h-3" />
                              ) : (
                                <Shield className="w-3 h-3" />
                              )}
                              <span className="text-xs font-semibold">
                                {msg.role === 'plaintiff' ? 'Plaintiff' : 'Defendant'}
                              </span>
                              <span className="text-xs opacity-70">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm break-words">{msg.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                        <div>
                          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No messages yet. Start the debate!</p>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message Input */}
                  {!isProcessing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your argument..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        className="flex-1"
                        disabled={isProcessing}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!chatMessage.trim() || isProcessing}
                        size="icon"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {isProcessing && (
                    <Alert className="bg-primary/10 border-primary">
                      <Scale className="h-4 w-4 animate-spin" />
                      <AlertDescription>
                        AI is analyzing your debate... This may take up to 30 seconds.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
