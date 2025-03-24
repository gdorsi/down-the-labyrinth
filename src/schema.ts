import { Account, CoMap, co, ImageDefinition, Group } from "jazz-tools"

export class Stats extends CoMap {
  health = co.number
  attack = co.number
  defense = co.number
  movement = co.number
}

export class Ability extends CoMap {
  name = co.string
  description = co.string
  type = co.literal("active", "passive")
  image = co.optional.ref(ImageDefinition)
}

export class AbilitiesMap extends CoMap.Record(co.ref(Ability)) {}

export class BaseCharacter extends CoMap {
  name = co.string
  description = co.string
  stats = co.ref(Stats)
  image = co.optional.ref(ImageDefinition)
}

export class CharactersMap extends CoMap.Record(co.ref(BaseCharacter)) {}

export class Equipment extends CoMap {
  name = co.string
  description = co.string
  abilities = co.ref(AbilitiesMap)
  stats = co.ref(Stats)
  type = co.literal("weapon", "armor", "artifact")
  image = co.optional.ref(ImageDefinition)
}

export class EquipmentMap extends CoMap.Record(co.ref(Equipment)) {}

export class Monster extends CoMap {
  name = co.string
  description = co.string
  abilities = co.ref(AbilitiesMap)
  stats = co.ref(Stats)
  type = co.literal("boss", "minion")
  essence = co.ref(MonsterEssence)
  drop = co.ref(EquipmentDropMap)
  moneyDrop = co.number
  image = co.optional.ref(ImageDefinition)
}

export class MonstersMap extends CoMap.Record(co.ref(Monster)) {}

export class MonsterEssence extends CoMap {
  color = co.literal("red", "blue", "green", "yellow", "purple", "orange", "black", "white")
  description = co.string
  stats = co.ref(Stats)
  abilities = co.ref(AbilitiesMap)
  dropRate = co.number
}

export class EquipmentDrop extends CoMap {
  equipment = co.ref(Equipment)
  dropRate = co.number
}

export class EquipmentDropMap extends CoMap.Record(co.ref(EquipmentDrop)) {}

export class RuleBook extends CoMap {
  content = co.string
}

export class Game extends CoMap {
  name = co.string
  abilities = co.ref(AbilitiesMap)
  characters = co.ref(CharactersMap)
  equipment = co.ref(EquipmentMap)
  monsters = co.ref(MonstersMap)
  ruleBook = co.ref(RuleBook)
}

/** The account root is an app-specific per-user private `CoMap`
 *  where you can store top-level objects for that user */
export class AccountRoot extends CoMap {
  game = co.ref(Game)
}

export class JazzAccount extends Account {
  root = co.ref(AccountRoot)

  /** The account migration is run on account creation and on every log-in.
   *  You can use it to set up the account root and any other initial CoValues you need.
   */
  async migrate(this: JazzAccount) {
    if (this.root === undefined) {
      const gameGroup = Group.create()

      this.root = AccountRoot.create({
        game: Game.create(
          {
            name: "Default Game",
            abilities: AbilitiesMap.create({}, gameGroup),
            characters: CharactersMap.create({}, gameGroup),
            equipment: EquipmentMap.create({}, gameGroup),
            monsters: MonstersMap.create({}, gameGroup),
            ruleBook: RuleBook.create({ content: "Default Rule Book" }, gameGroup),
          },
          gameGroup,
        ),
      })
    }
  }
}

