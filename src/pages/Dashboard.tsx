import { useAccount } from "jazz-react"
import { Link } from "@tanstack/react-router"

export function Dashboard() {
  const { me } = useAccount({
    root: {
      game: {
        monsters: {},
        equipment: {},
        abilities: {},
        characters: {},
      },
    },
  })

  if (!me?.root?.game) {
    return <div>Loading...</div>
  }

  const game = me.root.game
  const monsterCount = Object.keys(game.monsters).length
  const equipmentCount = Object.keys(game.equipment).length
  const abilitiesCount = Object.keys(game.abilities).length
  const charactersCount = Object.keys(game.characters).length

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Game Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Monsters"
          count={monsterCount}
          linkTo="/monsters"
          color="bg-red-100"
          textColor="text-red-800"
        />
        <DashboardCard
          title="Equipment"
          count={equipmentCount}
          linkTo="/equipment"
          color="bg-blue-100"
          textColor="text-blue-800"
        />
        <DashboardCard
          title="Abilities"
          count={abilitiesCount}
          linkTo="/abilities"
          color="bg-green-100"
          textColor="text-green-800"
        />
        <DashboardCard
          title="Characters"
          count={charactersCount}
          linkTo="/characters"
          color="bg-purple-100"
          textColor="text-purple-800"
        />
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  count,
  linkTo,
  color,
  textColor,
}: {
  title: string
  count: number
  linkTo: string
  color: string
  textColor: string
}) {
  return (
    <Link to={linkTo} className={`block p-6 rounded-lg shadow-sm ${color} hover:shadow-md transition-shadow`}>
      <h2 className={`text-xl font-semibold ${textColor}`}>{title}</h2>
      <p className="text-3xl font-bold mt-2">{count}</p>
      <p className="mt-2 text-gray-600">View all {title.toLowerCase()}</p>
    </Link>
  )
}

