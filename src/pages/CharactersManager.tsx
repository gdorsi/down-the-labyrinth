"use client"

import { useAccount } from "jazz-react"
import { useState } from "react"
import { BaseCharacter } from "../schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CharactersManager() {
  const { me } = useAccount({
    root: {
      game: {
        characters: {},
      },
    },
  })

  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [characteristics, setCharacteristics] = useState("")

  const charactersMap = me?.root?.game?.characters
  const characters = charactersMap
    ? Object.entries(charactersMap).map(([id, character]) => ({
        id,
        ...character,
      }))
    : []

  const resetForm = () => {
    setName("")
    setCharacteristics("")
    setIsCreating(false)
    setIsEditing(null)
  }

  const handleCreate = () => {
    if (!charactersMap) return

    const character = BaseCharacter.create(
      {
        name,
        characteristics,
      },
      charactersMap._owner,
    )

    charactersMap[character.id] = character
    resetForm()
  }

  const handleUpdate = () => {
    if (!charactersMap || !isEditing) return

    const character = charactersMap[isEditing]
    if (character) {
      character.name = name
      character.characteristics = characteristics
      resetForm()
    }
  }

  const handleDelete = (id: string) => {
    if (!charactersMap) return

    delete charactersMap[id]
  }

  const startEditing = (id: string) => {
    if (!charactersMap) return

    const character = charactersMap[id]
    if (character) {
      setName(character.name)
      setCharacteristics(character.characteristics)
      setIsEditing(id)
      setIsCreating(false)
    }
  }

  if (!charactersMap) {
    return <div>Loading characters data...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Characters Manager</h1>

      {/* Character Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{isCreating ? "Create Character" : isEditing ? "Edit Character" : "Characters"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isCreating || isEditing ? (
            <form className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="characteristics">Characteristics</Label>
                <Textarea
                  id="characteristics"
                  value={characteristics}
                  onChange={(e) => setCharacteristics(e.target.value)}
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
            <Button onClick={() => setIsCreating(true)}>Create New Character</Button>
          )}
        </CardContent>
      </Card>

      {/* Characters List */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Characteristics</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {characters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No characters found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                characters.map((character) => (
                  <TableRow key={character.id}>
                    <TableCell>{character.name}</TableCell>
                    <TableCell>
                      {character.characteristics.length > 100
                        ? `${character.characteristics.substring(0, 100)}...`
                        : character.characteristics}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => startEditing(character.id)} className="mr-2">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(character.id)}
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

