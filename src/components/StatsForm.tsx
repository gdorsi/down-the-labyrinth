import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Stats } from "../schema"

interface StatsFormProps {
  stats: Stats
}

export function StatsForm({ stats }: StatsFormProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="health">Health</Label>
        <Input
          id="health"
          type="number"
          value={stats.health}
          onChange={(e) => (stats.health = Number(e.target.value))}
          className="h-9 sm:h-10"
        />
      </div>
      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="attack">Attack</Label>
        <Input
          id="attack"
          type="number"
          value={stats.attack}
          onChange={(e) => (stats.attack = Number(e.target.value))}
          className="h-9 sm:h-10"
        />
      </div>
      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="defense">Defense</Label>
        <Input
          id="defense"
          type="number"
          value={stats.defense}
          onChange={(e) => (stats.defense = Number(e.target.value))}
          className="h-9 sm:h-10"
        />
      </div>
      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="movement">Movement</Label>
        <Input
          id="movement"
          type="number"
          value={stats.movement}
          onChange={(e) => (stats.movement = Number(e.target.value))}
          className="h-9 sm:h-10"
        />
      </div>
    </div>
  )
}

