import { useAccount } from "jazz-react"
import type { Ability } from "../schema"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useMemo } from "react"
import { Plus } from "lucide-react"

interface AbilitySelectorProps {
  currentAbilityIds: string[]
  onAddAbility: (ability: Ability) => void
}

export function AbilitySelector({ currentAbilityIds, onAddAbility }: AbilitySelectorProps) {
  const { me } = useAccount({
    resolve: {
      root: {
        game: {
          abilities: {
            $each: true
          }
        }
      }
    }
  })

  // Get all available abilities from the game
  const gameAbilities = useMemo(() => {
    return me?.root?.game?.abilities
  }, [me?.root?.game?.abilities])

  // Filter out abilities that are already added
  const availableAbilities = useMemo(() => {
    if (!gameAbilities) return []

    return Object.entries(gameAbilities)
      .filter(([id]) => !currentAbilityIds.includes(id))
      .map(([id, ability]) => ({
        id,
        ability,
      }))
  }, [gameAbilities, currentAbilityIds])

  if (!me?.root?.game) {
    return <div>Loading abilities...</div>
  }

  if (availableAbilities.length === 0) {
    return (
      <div className="text-sm text-muted-foreground mt-4">No more abilities available. Create new abilities first.</div>
    )
  }

  return (
    <div className="mt-4 sm:mt-6">
      <Label className="block mb-2">Add Ability</Label>
      <div className="flex flex-wrap gap-2">
        {availableAbilities.map(({ id, ability }) => (
          <Button
            key={id}
            variant="outline"
            size="sm"
            onClick={() => onAddAbility(ability)}
            className="rounded-full h-8 text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            {ability.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

