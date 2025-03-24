import { useAccount, ProgressiveImg } from "jazz-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Equipment, Stats, AbilitiesMap } from "../../schema"
import type { Group } from "jazz-tools"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Outlet } from "@tanstack/react-router"

export function EquipmentList() {
  const { me } = useAccount({
    resolve: {
      root: {
        game: {
          equipment: {
            $each: {
              stats: true,
              abilities: { $each: true }
            }
          }
        }
      }
    }
  } as const)

  const navigate = useNavigate()

  if (!me?.root?.game) {
    return <div>Loading...</div>
  }

  const equipment = me.root.game.equipment
  const equipmentEntries = Object.entries(equipment)

  const handleCreateEquipment = () => {
    const gameGroup = me.root.game._owner as Group

    // Create new equipment with default values
    const newEquipment = Equipment.create(
      {
        name: "New Equipment",
        description: "Equipment description",
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
        type: "weapon",
        image: null,
      },
      gameGroup,
    )

    // Add to equipment map using the Jazz-generated ID
    me.root.game.equipment[newEquipment.id] = newEquipment as any

    // Navigate to the new equipment
    navigate({ to: `/equipment/${newEquipment.id}` })
  }

  return (
    <div className="h-full overflow-auto">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Equipment</h1>
        <Button onClick={handleCreateEquipment} size="sm" className="sm:h-10 sm:px-4 sm:py-2">
          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Create Equipment</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {equipmentEntries.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No equipment created yet.</p>
          <Button onClick={handleCreateEquipment} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Equipment
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {equipmentEntries.map(([id, item]) => (
            <Link
              key={id}
              to={`/equipment/${id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
              activeProps={{ className: "ring-2 ring-primary" }}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-md overflow-hidden mr-3 sm:mr-4">
                  {item.image ? (
                    <ProgressiveImg image={item.image} targetWidth={64}>
                      {({ src }) => (
                        <img src={src || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </ProgressiveImg>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-xs sm:text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">{item.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 capitalize">{item.type}</p>
                </div>
              </div>
              <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-500">HP:</span>{" "}
                  {item.stats.health > 0 ? `+${item.stats.health}` : item.stats.health}
                </div>
                <div>
                  <span className="text-gray-500">ATK:</span>{" "}
                  {item.stats.attack > 0 ? `+${item.stats.attack}` : item.stats.attack}
                </div>
                <div>
                  <span className="text-gray-500">DEF:</span>{" "}
                  {item.stats.defense > 0 ? `+${item.stats.defense}` : item.stats.defense}
                </div>
                <div>
                  <span className="text-gray-500">MOV:</span>{" "}
                  {item.stats.movement > 0 ? `+${item.stats.movement}` : item.stats.movement}
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

