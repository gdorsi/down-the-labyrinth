"use client"

import { useAccount, ProgressiveImg } from "jazz-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Ability } from "../../schema"
import type { Group } from "jazz-tools"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Outlet } from "@tanstack/react-router"

export function AbilitiesList() {
  const { me } = useAccount({
    root: {
      game: {
        abilities: [{}],
      },
    },
  })

  const navigate = useNavigate()

  if (!me?.root?.game) {
    return <div>Loading...</div>
  }

  const abilities = me.root.game.abilities
  const abilityEntries = Object.entries(abilities)

  const handleCreateAbility = () => {
    const gameGroup = me.root.game._owner as Group

    // Create new ability with default values
    const newAbility = Ability.create(
      {
        name: "New Ability",
        description: "Ability description",
        type: "active",
        image: null,
      },
      gameGroup,
    )

    // Add to abilities map using the Jazz-generated ID
    me.root.game.abilities[newAbility.id] = newAbility

    // Navigate to the new ability
    navigate({ to: `/abilities/${newAbility.id}` })
  }

  return (
    <div className="h-full overflow-auto">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Abilities</h1>
        <Button onClick={handleCreateAbility} size="sm" className="sm:h-10 sm:px-4 sm:py-2">
          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Create Ability</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {abilityEntries.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No abilities created yet.</p>
          <Button onClick={handleCreateAbility} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Ability
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {abilityEntries.map(([id, ability]) => (
            <Link
              key={id}
              to={`/abilities/${id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
              activeProps={{ className: "ring-2 ring-primary" }}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-md overflow-hidden mr-3 sm:mr-4">
                  {ability.image ? (
                    <ProgressiveImg image={ability.image} maxWidth={64}>
                      {({ src }) => (
                        <img
                          src={src || "/placeholder.svg"}
                          alt={ability.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </ProgressiveImg>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-xs sm:text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">{ability.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 capitalize">{ability.type}</p>
                </div>
              </div>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 line-clamp-2">{ability.description}</p>
            </Link>
          ))}
        </div>
      )}
      <Outlet />
    </div>
  )
}

