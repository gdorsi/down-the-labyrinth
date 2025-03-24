"use client"

import { useAccount } from "jazz-react"
import { useParams, useNavigate } from "@tanstack/react-router"
import { StatsForm } from "../../components/StatsForm"
import { ImageUploader } from "../../components/ImageUploader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function CharacterDetail() {
  const { characterId } = useParams({ from: "/characters/$characterId" })
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const { me } = useAccount({
    root: {
      game: {
        characters: [
          {
            stats: {},
          },
        ],
      },
    },
  })

  useEffect(() => {
    // When characterId changes, open the drawer
    setIsOpen(true)
  }, [characterId])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      navigate({ to: "/characters" })
    }, 300) // Wait for drawer animation to complete
  }

  if (!me?.root?.game) {
    return <div>Loading...</div>
  }

  const character = me.root.game.characters[characterId]

  if (!character) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Character not found</h2>
        <Button onClick={() => navigate({ to: "/characters" })} className="mt-4">
          Back to Characters
        </Button>
      </div>
    )
  }

  const handleDeleteCharacter = () => {
    if (confirm("Are you sure you want to delete this character?")) {
      delete me.root.game.characters[characterId]
      handleClose()
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} onClose={handleClose}>
      <DrawerContent className="h-[90vh] max-h-[90vh] sm:max-h-[85vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl sm:text-2xl">Edit Character</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription className="hidden sm:block">Make changes to your character here.</DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto p-3 sm:p-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={character.name} onChange={(e) => (character.name = e.target.value)} />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={character.description}
                        onChange={(e) => (character.description = e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ImageUploader
                image={character.image}
                onImageChange={(image) => (character.image = image)}
                owner={character._owner}
              />
            </div>

            <div>
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Stats</h3>
                  <StatsForm stats={character.stats} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-2 sm:gap-0">
            <Button variant="destructive" onClick={handleDeleteCharacter} className="order-2 sm:order-1">
              Delete Character
            </Button>
            <div className="flex gap-2 order-1 sm:order-2">
              <DrawerClose asChild>
                <Button variant="outline" onClick={handleClose} className="flex-1 sm:flex-none">
                  Cancel
                </Button>
              </DrawerClose>
              <Button onClick={handleClose} className="flex-1 sm:flex-none">
                Save Changes
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

