import { useAccount } from "jazz-react"
import { useState } from "react"
import { CardEffectsMap, Equipment } from "../schema"

export default function EquipmentManager() {
  const { me } = useAccount({
    root: {
      game: {
        equipment: {},
        effects: {},
      },
    },
  })

  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [characteristics, setCharacteristics] = useState("")
  const [type, setType] = useState<"weapon" | "armor" | "artifact">("weapon")
  const [isTreasure, setIsTreasure] = useState(false)
  const [selectedEffects, setSelectedEffects] = useState<string[]>([])

  const equipmentMap = me?.root?.game?.equipment
  const effectsMap = me?.root?.game?.effects

  const equipment = equipmentMap
    ? Object.entries(equipmentMap).map(([id, item]) => ({
        id,
        ...item,
      }))
    : []

  const effects = effectsMap
    ? Object.entries(effectsMap).map(([id, effect]) => ({
        id,
        ...effect,
      }))
    : []

  const resetForm = () => {
    setName("")
    setCharacteristics("")
    setType("weapon")
    setIsTreasure(false)
    setSelectedEffects([])
    setIsCreating(false)
    setIsEditing(null)
  }

  const handleCreate = () => {
    if (!equipmentMap || !effectsMap) return

    // Create effects map
    const itemEffects = CardEffectsMap.create({}, equipmentMap._owner)

    // Add selected effects
    selectedEffects.forEach((effectId) => {
      if (effectsMap[effectId]) {
        itemEffects[effectId] = effectsMap[effectId]
      }
    })

    // Create equipment
    const item = Equipment.create(
      {
        name,
        characteristics,
        effects: itemEffects,
        type,
        isTreasure,
      },
      equipmentMap._owner,
    )

    equipmentMap[item.id] = item
    resetForm()
  }

  const handleUpdate = () => {
    if (!equipmentMap || !effectsMap || !isEditing) return

    const item = equipmentMap[isEditing]
    if (item) {
      item.name = name
      item.characteristics = characteristics
      item.type = type
      item.isTreasure = isTreasure

      // Update effects
      const itemEffects = item.effects

      // Clear existing effects
      Object.keys(itemEffects).forEach((key) => {
        delete itemEffects[key]
      })

      // Add selected effects
      selectedEffects.forEach((effectId) => {
        if (effectsMap[effectId]) {
          itemEffects[effectId] = effectsMap[effectId]
        }
      })

      resetForm()
    }
  }

  const handleDelete = (id: string) => {
    if (!equipmentMap) return

    delete equipmentMap[id]
  }

  const startEditing = (id: string) => {
    if (!equipmentMap) return

    const item = equipmentMap[id]
    if (item) {
      setName(item.name)
      setCharacteristics(item.characteristics)
      setType(item.type)
      setIsTreasure(item.isTreasure)

      // Get selected effects
      const itemEffects = item.effects ? Object.keys(item.effects) : []
      setSelectedEffects(itemEffects)

      setIsEditing(id)
      setIsCreating(false)
    }
  }

  const handleEffectToggle = (effectId: string) => {
    setSelectedEffects((prev) => (prev.includes(effectId) ? prev.filter((id) => id !== effectId) : [...prev, effectId]))
  }

  if (!equipmentMap || !effectsMap) {
    return <div>Loading equipment data...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Equipment Manager</h1>

      {/* Equipment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {isCreating ? "Create Equipment" : isEditing ? "Edit Equipment" : "Equipment"}
        </h2>

        {isCreating || isEditing ? (
          <form className="space-y-4">
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
              <label htmlFor="characteristics" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Characteristics
              </label>
              <textarea
                id="characteristics"
                value={characteristics}
                onChange={(e) => setCharacteristics(e.target.value)}
                rows={4}
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
                onChange={(e) => setType(e.target.value as "weapon" | "armor" | "artifact")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="weapon">Weapon</option>
                <option value="armor">Armor</option>
                <option value="artifact">Artifact</option>
                <option value="spell">Spell</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="isTreasure"
                type="checkbox"
                checked={isTreasure}
                onChange={(e) => setIsTreasure(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isTreasure" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Is Treasure
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Effects</label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                {effects.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No effects available. Create some first.</p>
                ) : (
                  effects.map((effect) => (
                    <div key={effect.id} className="flex items-center mb-2">
                      <input
                        id={`effect-${effect.id}`}
                        type="checkbox"
                        checked={selectedEffects.includes(effect.id)}
                        onChange={() => handleEffectToggle(effect.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`effect-${effect.id}`}
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        {effect.name}
                      </label>
                    </div>
                  ))
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
            Create New Equipment
          </button>
        )}
      </div>

      {/* Equipment List */}
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
                Treasure
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {equipment.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No equipment found. Create one to get started.
                </td>
              </tr>
            ) : (
              equipment.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white capitalize">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {item.isTreasure ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => startEditing(item.id)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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

