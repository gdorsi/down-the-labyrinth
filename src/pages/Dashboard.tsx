import { useAccount } from "jazz-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { me } = useAccount({
    root: {
      game: {
        characters: {},
        equipment: {},
        monsters: {},
        effects: {},
      },
    },
  })

  const game = me?.root?.game

  // Count entities
  const characterCount = game ? Object.keys(game.characters).length : 0
  const equipmentCount = game ? Object.keys(game.equipment).length : 0
  const monsterCount = game ? Object.keys(game.monsters).length : 0
  const effectCount = game ? Object.keys(game.effects).length : 0

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Game Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Characters"
          count={characterCount}
          link="/characters"
          color="bg-blue-100 dark:bg-blue-900"
        />
        <DashboardCard
          title="Equipment"
          count={equipmentCount}
          link="/equipment"
          color="bg-green-100 dark:bg-green-900"
        />
        <DashboardCard title="Monsters" count={monsterCount} link="/monsters" color="bg-red-100 dark:bg-red-900" />
        <DashboardCard title="Effects" count={effectCount} link="/effects" color="bg-purple-100 dark:bg-purple-900" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game: {game?.name || "Loading..."}</CardTitle>
          <CardDescription>Manage your game settings and rulebook</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-start gap-4">
          <Button asChild>
            <Link to="/game">Edit Game</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/rulebook">Edit Rulebook</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  count: number
  link: string
  color: string
}

function DashboardCard({ title, count, link, color }: DashboardCardProps) {
  return (
    <Link to={link} className="block">
      <Card className={`${color} hover:shadow-lg transition-shadow`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{count}</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm">Manage →</p>
        </CardFooter>
      </Card>
    </Link>
  )
}

