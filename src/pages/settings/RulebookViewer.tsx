"use client"

import { useAccount } from "jazz-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { Settings } from "lucide-react"
import Markdown from 'react-markdown'

export function RulebookViewer() {
  const { me } = useAccount({
    resolve: {
      root: {
        game: {
          ruleBook: true,
        },
      },
    },
  })

  if (!me?.root?.game) {
    return <div>Loading...</div>
  }

  const ruleBookContent = me.root.game.ruleBook.content

  return (
    <div className="h-full overflow-auto">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Rulebook</h1>
        <Link to="/settings?tab=rulebook">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Edit Rulebook
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{me.root.game.name} - Rulebook</CardTitle>
        </CardHeader>
        <CardContent>
          {ruleBookContent ? (
            <div className="prose max-w-none markdown">
              <Markdown>{ruleBookContent}</Markdown>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No rulebook content yet.</p>
              <Link to="/settings?tab=rulebook">
                <Button className="mt-4">Create Rulebook</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

