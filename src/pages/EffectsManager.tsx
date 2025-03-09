import { useAccount } from "jazz-react"
import { useState } from "react"
import { CardEffect } from "../schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EffectsManager() {
  const { me } = useAccount({
    root: {
      game: {
        effects: {},
      },
    },
  })

  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const effectsMap = me?.root?.game?.effects
  const effects = effectsMap
    ? Object.entries(effectsMap).map(([id, effect]) => ({
        id,
        ...effect,
      }))
    : []

  const resetForm = () => {
    setName("")
    setDescription("")
    setIsCreating(false)
    setIsEditing(null)
  }

  const handleCreate = () => {
    if (!effectsMap) return

    const effect = CardEffect.create(
      {
        name,
        description,
      },
      effectsMap._owner,
    )

    effectsMap[effect.id] = effect
    resetForm()
  }

  const handleUpdate = () => {
    if (!effectsMap || !isEditing) return

    const effect = effectsMap[isEditing]
    if (effect) {
      effect.name = name
      effect.description = description
      resetForm()
    }
  }

  const handleDelete = (id: string) => {
    if (!effectsMap) return

    delete effectsMap[id]
  }

  const startEditing = (id: string) => {
    if (!effectsMap) return

    const effect = effectsMap[id]
    if (effect) {
      setName(effect.name)
      setDescription(effect.description)
      setIsEditing(id)
      setIsCreating(false)
    }
  }

  if (!effectsMap) {
    return <div>Loading effects data...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Effects Manager</h1>

      {/* Effect Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{isCreating ? "Create Effect" : isEditing ? "Edit Effect" : "Effects"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isCreating || isEditing ? (
            <form className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <Button type="button" onClick={isEditing ? handleUpdate : handleCreate}>
                  {isEditing ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setIsCreating(true)}>Create New Effect</Button>
          )}
        </CardContent>
      </Card>

      {/* Effects List */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {effects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No effects found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                effects.map((effect) => (
                  <TableRow key={effect.id}>
                    <TableCell>{effect.name}</TableCell>
                    <TableCell>
                      {effect.description.length > 100
                        ? `${effect.description.substring(0, 100)}...`
                        : effect.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => startEditing(effect.id)} className="mr-2">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(effect.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

