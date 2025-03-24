import { useState } from "react"
import { usePassphraseAuth } from "jazz-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { wordlist } from "../auth/wordlist"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [loginPassphrase, setLoginPassphrase] = useState("")
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup")
  const auth = usePassphraseAuth({ wordlist })
  const isAuthenticated = auth.state === "signedIn"

  const handleSignUp = async () => {
    try {
      await auth.signUp()
      onOpenChange(false)
    } catch (err) {
      console.error("Sign up failed:", err)
    }
  }

  const handleLogIn = async () => {
    try {
      await auth.logIn(loginPassphrase)
      onOpenChange(false)
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  if (isAuthenticated) {
    onOpenChange(false)
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {activeTab === "signup" ? "Create Account" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription>
            {activeTab === "signup"
              ? "Sign up to enable sync across devices and share your content."
              : "Log in with your passphrase to access your content."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signup" | "login")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="login">Log In</TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Your Passphrase</h3>
              <Textarea readOnly value={auth.passphrase} className="h-24 font-mono text-sm" />
              <p className="text-xs text-muted-foreground">
                Save this passphrase somewhere safe. You'll need it to log in on other devices.
              </p>
            </div>

            {auth.error && (
              <Alert variant="destructive">
                <AlertDescription>{auth.error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleSignUp} className="w-full">
              I've Saved My Passphrase
            </Button>
          </TabsContent>

          <TabsContent value="login" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Enter Your Passphrase</h3>
              <Textarea
                value={loginPassphrase}
                onChange={(e) => setLoginPassphrase(e.target.value)}
                placeholder="Enter your passphrase here..."
                className="h-24 font-mono text-sm"
              />
            </div>

            {auth.error && (
              <Alert variant="destructive">
                <AlertDescription>{auth.error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleLogIn} className="w-full">
              Log In
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

