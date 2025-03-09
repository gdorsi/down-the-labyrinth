"use client"

import { useAccount } from "jazz-react"
import { useState } from "react"
import { CardEffectsMap, EquipmentDrop, Monster, MonsterEssence } from "../schema"

export default function MonstersManager() {
  const { me } = useAccount({
    root: {
      game: {
        monsters: {},
        equipment: {},
        effects: {},
      },
    },
  })

  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [characteristics, setCharacteristics] = useState("")
  const [type, setType] = useState<"boss" | "minion">("minion")
  const [moneyDrop, setMoneyDrop] = useState(0)
  const [selectedEffects, setSelectedEffects] = useState<string[]>([])

  // Essence fields
  const [essenceName, setEssenceName] = useState("")
  const [essenceCharacteristics, setEssenceCharacteristics] = useState("")
  const [essenceDropRate, setEssenceDropRate] = useState(0)
  const [essenceEffects, setEssenceEffects] = useState<string[]>([])

  // Equipment drop fields
  const [hasEquipmentDrop, setHasEquipmentDrop] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  const [equipmentDropRate, setEquipmentDropRate] = useState(0)

  const monstersMap = me?.root?.game?.monsters
  const effectsMap = me?.root?.game?.effects
  const equipmentMap = me?.root?.game?.equipment

  const monsters = monstersMap
    ? Object.entries(monstersMap).map(([id, monster]) => ({
        id,
        ...monster,
      }))
    : []

  const effects = effectsMap
    ? Object.entries(effectsMap).map(([id, effect]) => ({
        id,
        ...effect,
      }))
    : []

  const equipment = equipmentMap
    ? Object.entries(equipmentMap).map(([id, item]) => ({
        id,
        ...item,
      }))
    : []

  const resetForm = () => {
    setName("")
    setCharacteristics("")
    setType("minion")
    setMoneyDrop(0)
    setSelectedEffects([])

    setEssenceName("")
    setEssenceCharacteristics("")
    setEssenceDropRate(0)
    setEssenceEffects([])

    setHasEquipmentDrop(false)
    setSelectedEquipment(null)
    setEquipmentDropRate(0)

    setIsCreating(false)
    setIsEditing(null)
  }

  const handleCreate = () => {
    if (!monstersMap || !effectsMap || !equipmentMap) return

    // Create monster effects map
    const monsterEffects = CardEffectsMap.create({}, monstersMap._owner)

    // Add selected effects
    selectedEffects.forEach((effectId) => {
      if (effectsMap[effectId]) {
        monsterEffects[effectId] = effectsMap[effectId]
      }
    })

    // Create essence effects map
    const essenceEffectsMap = CardEffectsMap.create({}, monstersMap._owner)

    // Add selected essence effects
    essenceEffects.forEach((effectId) => {
      if (effectsMap[effectId]) {
        essenceEffectsMap[effectId] = effectsMap[effectId]
      }
    })

    // Create monster essence
    const essence = MonsterEssence.create(
      {
        name: essenceName,
        characteristics: essenceCharacteristics,
        effects: essenceEffectsMap,
        dropRate: essenceDropRate,
      },
      monstersMap._owner,
    )

    // Create equipment drop if needed
    let drop = null
    if (hasEquipmentDrop && selectedEquipment && equipmentMap[selectedEquipment]) {
      drop = EquipmentDrop.create(
        {
          equipment: equipmentMap[selectedEquipment],
          dropRate: equipmentDropRate,
        },
        monstersMap._owner,
      )
    }

    // Create monster
    const monster = Monster.create(
      {
        name,
        characteristics,
        effects: monsterEffects,
        type,
        essence,
        drop,
        moneyDrop,
      },
      monstersMap._owner,
    )

    monstersMap[monster.id] = monster
    resetForm()
  }

  const handleUpdate = () => {
    if (!monstersMap || !effectsMap || !equipmentMap || !isEditing) return

    const monster = monstersMap[isEditing]
    if (monster) {
      monster.name = name
      monster.characteristics = characteristics
      monster.type = type
      monster.moneyDrop = moneyDrop

      // Update monster effects
      const monsterEffects = monster.effects

      // Clear existing effects
      Object.keys(monsterEffects).forEach((key) => {
        delete monsterEffects[key]
      })

      // Add selected effects
      selectedEffects.forEach((effectId) => {
        if (effectsMap[effectId]) {
          monsterEffects[effectId] = effectsMap[effectId]
        }
      })

      // Update essence
      const essence = monster.essence
      essence.name = essenceName
      essence.characteristics = essenceCharacteristics
      essence.dropRate = essenceDropRate

      // Update essence effects
      const essenceEffectsMap = essence.effects

      // Clear existing essence effects
      Object.keys(essenceEffectsMap).forEach((key) => {
        delete essenceEffectsMap[key]
      })

      // Add selected essence effects
      essenceEffects.forEach((effectId) => {
        if (effectsMap[effectId]) {
          essenceEffectsMap[effectId] = effectsMap[effectId]
        }
      })

      // Update equipment drop
      if (hasEquipmentDrop && selectedEquipment && equipmentMap[selectedEquipment]) {
        if (monster.drop) {
          monster.drop.equipment = equipmentMap[selectedEquipment]
          monster.drop.dropRate = equipmentDropRate
        } else {
          monster.drop = EquipmentDrop.create(
            {
              equipment: equipmentMap[selectedEquipment],
              dropRate: equipmentDropRate,
            },
            monstersMap._owner,
          )
        }
      } else {
        monster.drop = null
      }

      resetForm()
    }
  }

  const handleDelete = (id: string) => {
    if (!monstersMap) return

    delete monstersMap[id]
  }

  const startEditing = (id: string) => {
    if (!monstersMap) return

    const monster = monstersMap[id]
    if (monster) {
      setName(monster.name)
      setCharacteristics(monster.characteristics)
      setType(monster.type)
      setMoneyDrop(monster.moneyDrop)

      // Get selected effects
      const monsterEffects = monster.effects ? Object.keys(monster.effects) : []
      setSelectedEffects(monsterEffects)

      // Get essence data
      const essence = monster.essence
      if (essence) {
        setEssenceName(essence.name)
        setEssenceCharacteristics(essence.characteristics)
        setEssenceDropRate(essence.dropRate)

        // Get selected essence effects
        const essenceEffectsIds = essence.effects ? Object.keys(essence.effects) : []
        setEssenceEffects(essenceEffectsIds)
      }

      // Get equipment drop data
      const drop = monster.drop
      if (drop && drop.equipment) {
        setHasEquipmentDrop(true)
        setSelectedEquipment(drop.equipment.id)
        setEquipmentDropRate(drop.dropRate)
      } else {
        setHasEquipmentDrop(false)
        setSelectedEquipment(null)
        setEquipmentDropRate(0)
      }

      setIsEditing(id)
      setIsCreating(false)
    }
  }

  const handleEffectToggle = (effectId: string, target: "monster" | "essence") => {
    if (target === "monster") {
      setSelectedEffects((prev) =>
        prev.includes(effectId) ? prev.filter((id) => id !== effectId) : [...prev, effectId],
      )
    } else {
      setEssenceEffects((prev) =>
        prev.includes(effectId) ? prev.filter((id) => id !== effectId) : [...prev, effectId],
      )
    }
  }

  if (!monstersMap || !effectsMap || !equipmentMap) {
    return <div>Loading monsters data...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Monsters Manager</h1>

      {/* Monster Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {isCreating ? "Create Monster" : isEditing ? "Edit Monster" : "Monsters"}
        </h2>

        {isCreating || isEditing ? (
          <form className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="characteristics"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Characteristics
                  </label>
                  <textarea
                    id="characteristics"
                    value={characteristics}
                    onChange={(e) => setCharacteristics(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as "boss" | "minion")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="minion">Minion</option>
                    <option value="boss">Boss</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="moneyDrop" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Money Drop
                  </label>
                  <input
                    id="moneyDrop"
                    type="number"
                    min="0"
                    value={moneyDrop}
                    onChange={(e) => setMoneyDrop(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monster Effects
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                    {effects.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400">No effects available. Create some first.</p>
                    ) : (
                      effects.map((effect) => (
                        <div key={effect.id} className="flex items-center mb-2">
                          <input
                            id={`monster-effect-${effect.id}`}
                            type="checkbox"
                            checked={selectedEffects.includes(effect.id)}
                            onChange={() => handleEffectToggle(effect.id, "monster")}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`monster-effect-${effect.id}`}
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                          >
                            {effect.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monster Essence</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="essenceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Essence Name
                  </label>
                  <input
                    id="essenceName"
                    type="text"
                    value={essenceName}
                    onChange={(e) => setEssenceName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="essenceCharacteristics"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Essence Characteristics
                  </label>
                  <textarea
                    id="essenceCharacteristics"
                    value={essenceCharacteristics}
                    onChange={(e) => setEssenceCharacteristics(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="essenceDropRate"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Essence Drop Rate
                  </label>
                  <input
                    id="essenceDropRate"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={essenceDropRate}
                    onChange={(e) => setEssenceDropRate(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Essence Effects
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                    {effects.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400">No effects available. Create some first.</p>
                    ) : (
                      effects.map((effect) => (
                        <div key={effect.id} className="flex items-center mb-2">
                          <input
                            id={`essence-effect-${effect.id}`}
                            type="checkbox"
                            checked={essenceEffects.includes(effect.id)}
                            onChange={() => handleEffectToggle(effect.id, "essence")}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`essence-effect-${effect.id}`}
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                          >
                            {effect.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Equipment Drop</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="hasEquipmentDrop"
                    type="checkbox"
                    checked={hasEquipmentDrop}
                    onChange={(e) => setHasEquipmentDrop(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasEquipmentDrop" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Has Equipment Drop
                  </label>
                </div>

                {hasEquipmentDrop && (
                  <>
                    <div>
                      <label
                        htmlFor="selectedEquipment"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Equipment
                      </label>
                      <select
                        id="selectedEquipment"
                        value={selectedEquipment || ""}
                        onChange={(e) => setSelectedEquipment(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="">Select Equipment</option>
                        {equipment.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="equipmentDropRate"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Equipment Drop Rate
                      </label>
                      <input
                        id="equipmentDropRate"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={equipmentDropRate}
                        onChange={(e) => setEquipmentDropRate(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={isEditing ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {isEditing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create New Monster
          </button>
        )}
      </div>

      {/* Monsters List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Essence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Money Drop
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {monsters.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No monsters found. Create one to get started.
                </td>
              </tr>
            ) : (
              monsters.map((monster) => (
                <tr key={monster.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{monster.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white capitalize">
                    {monster.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{monster.essence?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{monster.moneyDrop}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => startEditing(monster.id)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(monster.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

