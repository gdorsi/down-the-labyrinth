import { useAccount } from "jazz-react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"
import { useSearch } from "@tanstack/react-router"
import { LexicalEditor } from "@/components/LexicalEditor"

export function SettingsPage() {
  const { me } = useAccount({
    resolve: {
      root: {
        game: {
          ruleBook: true,
        },
      },
    },
  })

  const search = useSearch({ from: "/settings" })
  const defaultTab = search.tab || "general"

  const [gameTitle, setGameTitle] = useState("")
  const [ruleBookContent, setRuleBookContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [activeTab, setActiveTab] = useState(defaultTab)

  useEffect(() => {
    if (me?.root?.game) {
      setGameTitle(me.root.game.name)
      setRuleBookContent(me.root.game.ruleBook.content)
    }
  }, [me?.root?.game])

  useEffect(() => {
    if (search.tab) {
      setActiveTab(search.tab)
    }
  }, [search.tab])

  const handleSaveGameTitle = () => {
    if (!me?.root?.game) return

    setIsSaving(true)
    try {
      me.root.game.name = gameTitle
      setSaveMessage("Game title saved successfully!")
    } catch (error) {
      console.error("Error saving game title:", error)
      setSaveMessage("Error saving game title")
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  const handleSaveRuleBook = () => {
    if (!me?.root?.game?.ruleBook) return

    setIsSaving(true)
    try {
      me.root.game.ruleBook.content = ruleBookContent
      setSaveMessage("Rulebook saved successfully!")
    } catch (error) {
      console.error("Error saving rulebook:", error)
      setSaveMessage("Error saving rulebook")
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  if (!me?.root?.game?.ruleBook) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-full overflow-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Game Settings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="rulebook">Rulebook</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Game Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gameTitle">Game Title</Label>
                <Input
                  id="gameTitle"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="Enter game title"
                />
              </div>

              <Button onClick={handleSaveGameTitle} disabled={isSaving} className="mt-4">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rulebook">
          <Card>
            <CardHeader>
              <CardTitle>Rulebook Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="min-h-[400px]">
                <LexicalEditor
                  initialContent={me.root.game.ruleBook.content}
                  onChange={setRuleBookContent}
                  placeholder="Start writing your rulebook here..."
                />
              </div>

              <Button onClick={handleSaveRuleBook} disabled={isSaving} className="mt-4">
                <Save className="h-4 w-4 mr-2" />
                Save Rulebook
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {saveMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md">
          {saveMessage}
        </div>
      )}
    </div>
  )
}

