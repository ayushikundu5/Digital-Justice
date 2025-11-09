"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogIn, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function JoinDebatePage() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState("")
  const [error, setError] = useState("")
  const [isJoining, setIsJoining] = useState(false)

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setRoomCode(value)
    setError("")
  }

  const handleJoinRoom = () => {
    if (roomCode.length !== 6) {
      setError("Please enter a valid 6-digit room code")
      toast.error("Invalid room code")
      return
    }

    setIsJoining(true)

    // Check if room exists in localStorage
    const debateRooms = JSON.parse(localStorage.getItem("debateRooms") || "[]")
    const room = debateRooms.find((r: any) => r.roomCode === roomCode)

    if (!room) {
      setError("Room not found. Please check the code and try again.")
      toast.error("Room not found")
      setIsJoining(false)
      return
    }

    if (room.status === "completed") {
      setError("This debate has already been completed.")
      toast.error("Debate already completed")
      setIsJoining(false)
      return
    }

    // Successfully found room
    toast.success("Room found! Joining...")
    setTimeout(() => {
      router.push(`/debate/room/${roomCode}`)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && roomCode.length === 6) {
      handleJoinRoom()
    }
  }

  return (
    <LayoutWrapper>
      <div className="p-4 md:p-8">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <LogIn className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl md:text-3xl text-foreground">Join a Debate</CardTitle>
              <CardDescription>
                Enter the 6-digit room code shared by your opponent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert className="bg-destructive/10 border-destructive">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Room Code Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground text-center block">
                  Room Code
                </label>
                <div className="flex justify-center">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={roomCode}
                    onChange={handleCodeChange}
                    onKeyPress={handleKeyPress}
                    placeholder="000000"
                    className="text-center text-4xl md:text-5xl font-mono font-bold tracking-wider h-20 w-full max-w-xs"
                    maxLength={6}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {roomCode.length}/6 digits entered
                </p>
              </div>

              {/* Join Button */}
              <div className="pt-4">
                <Button
                  onClick={handleJoinRoom}
                  disabled={roomCode.length !== 6 || isJoining}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                  size="lg"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {isJoining ? "Joining..." : "Join Debate Room"}
                </Button>
              </div>

              {/* Info Box */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">💡 How to Join:</p>
                <ol className="text-xs space-y-1 text-muted-foreground list-decimal list-inside">
                  <li>Get the 6-digit room code from the debate creator</li>
                  <li>Enter the code above</li>
                  <li>Click "Join Debate Room"</li>
                  <li>You'll be assigned the opposing role automatically</li>
                </ol>
              </div>

              {/* Back Button */}
              <Button
                onClick={() => router.push("/debate")}
                variant="outline"
                className="w-full"
              >
                Back to Debate Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}
