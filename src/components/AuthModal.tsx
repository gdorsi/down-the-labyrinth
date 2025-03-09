"use client"

import type React from "react"
import { useState } from "react"
import { usePasskeyAuth } from "jazz-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [username, setUsername] = useState("")
  const [isSignUp, setIsSignUp] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const auth = usePasskeyAuth({
    appName: "Game Manager",
  })

  const handleViewChange = () => {
    setIsSignUp(!isSignUp)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (isSignUp) {
        await auth.signUp(username)
      } else {
        await auth.logIn()
      }
      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create Account" : "Sign In"}</DialogTitle>
          <DialogDescription>
            {isSignUp ? "Create a new account with passkey authentication" : "Sign in to your account"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="my-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
            <Button type="submit" className="w-full">
              {isSignUp ? "Sign Up with Passkey" : "Sign In with Passkey"}
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-2">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <Button variant="link" type="button" onClick={handleViewChange} className="px-2 py-0 h-auto">
                {isSignUp ? "Sign In" : "Sign Up"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

