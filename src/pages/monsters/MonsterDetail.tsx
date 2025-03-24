import { useAccount } from "jazz-react"
import { useParams, useNavigate } from "@tanstack/react-router"
import type { Ability } from "../../schema"
import { StatsForm } from "../../components/StatsForm"
import { ImageUploader } from "../../components/ImageUploader"
import { AbilitySelector } from "../../components/AbilitySelector"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export function MonsterDetail() {
  const { monsterId } = useParams({ from: "/monsters/$monsterId" })
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const { me } = useAccount({
    root: {
      game: {
        monsters: [
          {
            abilities: [{}],
            drop: [{}],
            essence: {
              stats: {},
            },
            stats: {},
          },
        ],
      },
    },
  })

  useEffect(() => {
    // When monsterId changes, open the drawer
    setIsOpen(true)
  }, [monsterId])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      navigate({ to: "/monsters" })
    }, 300) // Wait for drawer animation to complete
  }

  if (!me?.root?.game) {
    return <div>Loading...</div>
  }

  const monster = me.root.game.monsters[monsterId]

  if (!monster) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Monster not found</h2>
        <Button onClick={() => navigate({ to: "/monsters" })} className="mt-4">
          Back to Monsters
        </Button>
      </div>
    )
  }

  const handleDeleteMonster = () => {
    if (confirm("Are you sure you want to delete this monster?")) {
      delete me.root.game.monsters[monsterId]
      handleClose()
    }
  }

  const handleAddAbility = (ability: Ability) => {
    monster.abilities[ability.id] = ability
  }

  const handleRemoveAbility = (abilityId: string) => {
    delete monster.abilities[abilityId]
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} onClose={handleClose}>
      <DrawerContent className="h-[90vh] max-h-[90vh] sm:max-h-[85vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl sm:text-2xl">Edit Monster</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription className="hidden sm:block">Make changes to your monster here.</DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto p-3 sm:p-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={monster.name} onChange={(e) => (monster.name = e.target.value)} />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={monster.description}
                        onChange={(e) => (monster.description = e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={monster.type}
                        onValueChange={(value) => (monster.type = value as "boss" | "minion")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="boss">Boss</SelectItem>
                          <SelectItem value="minion">Minion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="moneyDrop">Money Drop</Label>
                      <Input
                        id="moneyDrop"
                        type="number"
                        value={monster.moneyDrop}
                        onChange={(e) => (monster.moneyDrop = Number(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ImageUploader
                image={monster.image}
                onImageChange={(image) => (monster.image = image)}
                owner={monster._owner}
              />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Stats</h3>
                  <StatsForm stats={monster.stats} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Essence</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-sm font-medium">Essence Stats</h4>
                    <StatsForm stats={monster.essence.stats} />

                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="essence-dropRate">Drop Rate</Label>
                      <Input
                        id="essence-dropRate"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={monster.essence.dropRate}
                        onChange={(e) => (monster.essence.dropRate = Number(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-4 sm:mt-6">
            <CardContent className="pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Abilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(monster.abilities).map((ability) => (
                  <Card key={ability.id} className="bg-secondary/20">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm sm:text-base">{ability.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAbility(ability.id)}
                          className="h-7 w-7 p-0 sm:h-8 sm:w-8 sm:p-0 text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{ability.description}</p>
                      <div className="text-xs text-muted-foreground mt-2">Type: {ability.type}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <AbilitySelector
                currentAbilityIds={Object.values(monster.abilities).map((ability) => ability.id)}
                onAddAbility={handleAddAbility}
              />
            </CardContent>
          </Card>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-2 sm:gap-0">
            <Button variant="destructive" onClick={handleDeleteMonster} className="order-2 sm:order-1">
              Delete Monster
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

