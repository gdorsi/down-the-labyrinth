import { useAccount, ProgressiveImg } from "jazz-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { BaseCharacter, Stats } from "../../schema"
import type { Group } from "jazz-tools"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Outlet } from "@tanstack/react-router"

export function CharactersList() {
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

  const navigate = useNavigate()

  if (!me?.root?.game) {
    return <div>Loading...</div>
  }

  const characters = me.root.game.characters
  const characterEntries = Object.entries(characters)

  const handleCreateCharacter = () => {
    const gameGroup = me.root.game._owner as Group

    // Create new character with default values
    const newCharacter = BaseCharacter.create(
      {
        name: "New Character",
        description: "Character description",
        stats: Stats.create(
          {
            health: 20,
            attack: 10,
            defense: 10,
            movement: 5,
          },
          gameGroup,
        ),
        image: null,
      },
      gameGroup,
    )

    // Add to characters map using the Jazz-generated ID
    me.root.game.characters[newCharacter.id] = newCharacter

    // Navigate to the new character
    navigate({ to: `/characters/${newCharacter.id}` })
  }

  return (
    <div className="h-full overflow-auto">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Characters</h1>
        <Button onClick={handleCreateCharacter} size="sm" className="sm:h-10 sm:px-4 sm:py-2">
          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Create Character</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {characterEntries.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No characters created yet.</p>
          <Button onClick={handleCreateCharacter} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Character
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {characterEntries.map(([id, character]) => (
            <Link
              key={id}
              to={`/characters/${id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
              activeProps={{ className: "ring-2 ring-primary" }}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-md overflow-hidden mr-3 sm:mr-4">
                  {character.image ? (
                    <ProgressiveImg image={character.image} maxWidth={64}>
                      {({ src }) => (
                        <img
                          src={src || "/placeholder.svg"}
                          alt={character.name}
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
                  <h2 className="text-base sm:text-lg font-semibold">{character.name}</h2>
                </div>
              </div>
              <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-500">HP:</span> {character.stats.health}
                </div>
                <div>
                  <span className="text-gray-500">ATK:</span> {character.stats.attack}
                </div>
                <div>
                  <span className="text-gray-500">DEF:</span> {character.stats.defense}
                </div>
                <div>
                  <span className="text-gray-500">MOV:</span> {character.stats.movement}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Outlet />
    </div>
  )
}

