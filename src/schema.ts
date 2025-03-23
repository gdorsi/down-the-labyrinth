/**
 * Learn about schemas here:
 * https://jazz.tools/docs/react/schemas/covalues
 */

import { Account, CoMap, co, ImageDefinition } from "jazz-tools";

export class CardEffect extends CoMap {
  name = co.string;
  description = co.string;
  type = co.literal("active", "pasive");
}

export class CardEffectsMap extends CoMap.Record(co.ref(CardEffect)) {}

export class BaseCharacter extends CoMap {
  name = co.string;
  characteristics = co.string
}

export class CharactersMap extends CoMap.Record(co.ref(BaseCharacter)) {}

export class Equipment extends CoMap {
  name = co.string;
  characteristics = co.string
  effects = co.ref(CardEffectsMap);
  type = co.literal("weapon", "armor", "artifact", "spell");
  isTreasure = co.boolean;
}

export class EquipmentMap extends CoMap.Record(co.ref(Equipment)) {}

export class Monster extends CoMap {
  name = co.string;
  characteristics = co.string
  effects = co.ref(CardEffectsMap);
  type = co.literal("boss", "minion");
  essence = co.ref(MonsterEssence);
  drop = co.optional.ref(EquipmentDrop);
  moneyDrop = co.number;
  image = co.optional.ref(ImageDefinition);
}

export class MonstersMap extends CoMap.Record(co.ref(Monster)) {}

export class MonsterEssence extends CoMap {
  name = co.string;
  characteristics = co.string
  effects = co.ref(CardEffectsMap);
  dropRate = co.number;
}

export class EquipmentDrop extends CoMap {
  equipment = co.ref(Equipment);
  dropRate = co.number;
}

export class RuleBook extends CoMap {
  content = co.string;
}

export class Game extends CoMap {
  name = co.string;
  effects = co.ref(CardEffectsMap);
  characters = co.ref(CharactersMap);
  equipment = co.ref(EquipmentMap);
  monsters = co.ref(MonstersMap);
  ruleBook = co.ref(RuleBook);
}

/** The account root is an app-specific per-user private `CoMap`
 *  where you can store top-level objects for that user */
export class AccountRoot extends CoMap {
  game = co.ref(Game);
}

export class JazzAccount extends Account {
  root = co.ref(AccountRoot);

  /** The account migration is run on account creation and on every log-in.
   *  You can use it to set up the account root and any other initial CoValues you need.
   */
  migrate(this: JazzAccount) {
    if (this.root === undefined) {
      this.root = AccountRoot.create(
        {
          game: Game.create({
            name: "Default Game",
            effects: CardEffectsMap.create({}),
            characters: CharactersMap.create({}),
            equipment: EquipmentMap.create({}),
            monsters: MonstersMap.create({}),
            ruleBook: RuleBook.create({ content: "Default Rule Book" }),
          }),
        },
      );
    }
  }
}
