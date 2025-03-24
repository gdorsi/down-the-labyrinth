"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "./AuthModal"
import { useAccount, useIsAuthenticated } from "jazz-react"
import { Shield, LogOut } from "lucide-react"
import { wordlist } from "../auth/wordlist"

export function AuthButton() {
  const [open, setOpen] = useState(false)
  const { logOut } = useAccount()
  const isAuthenticated = useIsAuthenticated()

  const handleLogout = () => {
    logOut()
  }

  return (
    <>
      {isAuthenticated ? (
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      ) : (
        <Button variant="default" size="sm" onClick={() => setOpen(true)} className="flex items-center gap-1">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Button>
      )}
      <AuthModal open={open} onOpenChange={setOpen} />
    </>
  )
}

