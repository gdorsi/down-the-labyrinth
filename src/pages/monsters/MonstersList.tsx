"use client"

import { useAccount, ProgressiveImg } from "jazz-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Monster, Stats, MonsterEssence, AbilitiesMap, EquipmentDropMap } from "../../schema"
import type { Group } from "jazz-tools"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Outlet } from "@tanstack/react-router"

export function MonstersList() {
  const { me } = useAccount({
    root: {
      game: {
        monsters: [
          {
            abilities: [{}],
            drop: [{}],
            essence: {},
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

  const monsters = me.root.game.monsters
  const monsterValues = Object.values(monsters)

  const handleCreateMonster = () => {
    const gameGroup = me.root.game._owner as Group

    // Create new monster with default values
    const newMonster = Monster.create(
      {
        name: "New Monster",
        description: "Monster description",
        stats: Stats.create(
          {
            health: 10,
            attack: 5,
            defense: 5,
            movement: 3,
          },
          gameGroup,
        ),
        abilities: AbilitiesMap.create({}, gameGroup),
        type: "minion",
        essence: MonsterEssence.create(
          {
            color: "red",
            description: "Red essence",
            stats: Stats.create(
              {
                health: 0,
                attack: 0,
                defense: 0,
                movement: 0,
              },
              gameGroup,
            ),
            abilities: AbilitiesMap.create({}, gameGroup),
            dropRate: 0.5,
          },
          gameGroup,
        ),
        drop: EquipmentDropMap.create({}, gameGroup),
        moneyDrop: 10,
        image: null,
      },
      gameGroup,
    )

    // Add to monsters map using the Jazz-generated ID
    me.root.game.monsters[newMonster.id] = newMonster

    // Navigate to the new monster
    navigate({ to: `/monsters/${newMonster.id}` })
  }

  return (
    <div className="h-full overflow-auto">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Monsters</h1>
        <Button onClick={handleCreateMonster} size="sm" className="sm:h-10 sm:px-4 sm:py-2">
          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Create Monster</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {monsterValues.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No monsters created yet.</p>
          <Button onClick={handleCreateMonster} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Monster
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {monsterValues.map((monster) => (
            <Link
              key={monster.id}
              to={`/monsters/${monster.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
              activeProps={{ className: "ring-2 ring-primary" }}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-md overflow-hidden mr-3 sm:mr-4">
                  {monster.image ? (
                    <ProgressiveImg image={monster.image} maxWidth={256}>
                      {({ src }) => (
                        <img
                          src={src || "/placeholder.svg"}
                          alt={monster.name}
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
                  <h2 className="text-base sm:text-lg font-semibold">{monster.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 capitalize">{monster.type}</p>
                </div>
              </div>
              <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-500">HP:</span> {monster.stats.health}
                </div>
                <div>
                  <span className="text-gray-500">ATK:</span> {monster.stats.attack}
                </div>
                <div>
                  <span className="text-gray-500">DEF:</span> {monster.stats.defense}
                </div>
                <div>
                  <span className="text-gray-500">MOV:</span> {monster.stats.movement}
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

