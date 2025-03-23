"use client";

import { useAccount, useCoState, ProgressiveImg } from "jazz-react";
import { useState } from "react";
import { createImage } from "jazz-browser-media-images";
import {
	CardEffectsMap,
	type Equipment,
	EquipmentDrop,
	EquipmentDropMap,
	Monster,
	MonsterEssence,
} from "../schema";
import type { ID } from "jazz-tools";

export default function MonstersManager() {
	const { me } = useAccount({
		root: {
			game: {
				monsters: [
					{
						effects: [{}],
						essence: {
							effects: [{}],
						},
					},
				],
				equipment: [
					{
						effects: [{}],
					},
				],
				effects: [{}],
			},
		},
	});

	const [isCreating, setIsCreating] = useState(false);
	const [isEditing, setIsEditing] = useState<string | null>(null);
	const monstersMap = me?.root?.game?.monsters;
	const effectsMap = me?.root?.game?.effects;
	const equipmentMap = me?.root?.game?.equipment;

	const resetForm = () => {
		setIsCreating(false);
		setIsEditing(null);
	};

	const startEditing = (id: string) => {
		setIsEditing(id);
		setIsCreating(false);
	};

	const handleCreateMonster = () => {
		if (!monstersMap || !effectsMap || !equipmentMap) return;

		const monster = Monster.create(
			{
				name: "",
				characteristics: "",
				effects: CardEffectsMap.create({}, monstersMap._owner),
				type: "minion",
				moneyDrop: 0,
				essence: MonsterEssence.create({
					name: "",
					characteristics: "",
					effects: CardEffectsMap.create({}, monstersMap._owner),
					dropRate: 0,
				}),
				drop: EquipmentDropMap.create({}, monstersMap._owner),
			},
			monstersMap._owner,
		);

		setIsEditing(monster.id);
		setIsCreating(true);
	};

	const handleSubmit = (monster: Monster) => {
		if (!monstersMap || !effectsMap || !equipmentMap) return;

		// @ts-expect-error TODO: fix this
		monstersMap[monster.id] = monster;
	};

	if (!monstersMap || !effectsMap || !equipmentMap) {
		return <div>Loading monsters data...</div>;
	}

	return (
		<div>
			<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
				Monsters Manager
			</h1>

			{/* Monster Form */}
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
					{isCreating
						? "Create Monster"
						: isEditing
							? "Edit Monster"
							: "Monsters"}
				</h2>

				{isCreating || isEditing ? (
					<MonsterForm
						monsterId={isEditing as ID<Monster>}
						onSubmit={handleSubmit}
						isEditing={!isCreating}
						onCancel={resetForm}
					/>
				) : (
					<button
						type="button"
						onClick={handleCreateMonster}
						className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
					>
						Create New Monster
					</button>
				)}
			</div>

			<MonstersList onEdit={startEditing} />
		</div>
	);
}

function MonsterForm(props: {
	monsterId: ID<Monster>;
	onSubmit: (monster: Monster) => void;
	isEditing: boolean;
	onCancel: () => void;
}) {
	const { me } = useAccount({
		root: {
			game: {
				monsters: [
					{
						effects: [{}],
						essence: {
							effects: [{}],
						},
					},
				],
				equipment: [
					{
						effects: [{}],
					},
				],
				effects: [{}],
			},
		},
	});

	const monster = useCoState(Monster, props.monsterId, {
		effects: [{}],
		essence: {
			effects: [{}],
		},
		drop: [
			{
				equipment: {},
			},
		],
	});

	const effectsMap = me?.root?.game?.effects;
	const equipmentMap = me?.root?.game?.equipment;

	const effects = effectsMap ? Object.values(effectsMap) : [];

	const equipment = equipmentMap ? Object.values(equipmentMap) : [];

	if (!monster || !effectsMap || !equipmentMap) {
		return <div>Loading monster data...</div>;
	}

	return (
		<form
			className="space-y-6"
			onSubmit={(e) => {
				e.preventDefault();
				props.onSubmit(monster);
			}}
		>
			<div className="border-b border-gray-200 dark:border-gray-700 pb-4">
				<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
					Basic Information
				</h3>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Name
						</label>
						<input
							id="name"
							type="text"
							value={monster.name}
							onChange={(e) => {
								monster.name = e.target.value;
							}}
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
							value={monster.characteristics}
							onChange={(e) => {
								monster.characteristics = e.target.value;
							}}
							rows={3}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="type"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Type
						</label>
						<select
							id="type"
							value={monster.type}
							onChange={(e) => {
								monster.type = e.target.value as "boss" | "minion";
							}}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						>
							<option value="minion">Minion</option>
							<option value="boss">Boss</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="moneyDrop"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Money Drop
						</label>
						<input
							id="moneyDrop"
							type="number"
							min="0"
							value={monster.moneyDrop}
							onChange={(e) => {
								monster.moneyDrop = Number(e.target.value);
							}}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						/>
					</div>

					<div>
						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Monster Effects
						</label>
						<div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
							{effects.length === 0 ? (
								<p className="text-gray-500 dark:text-gray-400">
									No effects available. Create some first.
								</p>
							) : (
								effects.map((effect) => (
									<div key={effect.id} className="flex items-center mb-2">
										<input
											id={`monster-effect-${effect.id}`}
											type="checkbox"
											checked={monster.effects[effect.id] !== null}
											onChange={() => {
												if (monster.effects[effect.id] === null) {
													monster.effects[effect.id] = effect;
												} else {
													delete monster.effects[effect.id];
												}
											}}
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
				<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
					Monster Essence
				</h3>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="essenceName"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Essence Name
						</label>
						<input
							id="essenceName"
							type="text"
							value={monster.essence.name}
							onChange={(e) => {
								monster.essence.name = e.target.value;
							}}
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
							value={monster.essence.characteristics}
							onChange={(e) => {
								monster.essence.characteristics = e.target.value;
							}}
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
							value={monster.essence.dropRate}
							onChange={(e) => {
								monster.essence.dropRate = Number(e.target.value);
							}}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						/>
					</div>

					<div>
						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Essence Effects
						</label>
						<div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
							{effects.length === 0 ? (
								<p className="text-gray-500 dark:text-gray-400">
									No effects available. Create some first.
								</p>
							) : (
								effects.map((effect) => (
									<div key={effect.id} className="flex items-center mb-2">
										<input
											id={`essence-effect-${effect.id}`}
											type="checkbox"
											checked={monster.essence.effects[effect.id] !== null}
											onChange={() => {
												if (monster.essence.effects[effect.id] === null) {
													monster.essence.effects[effect.id] = effect;
												} else {
													delete monster.essence.effects[effect.id];
												}
											}}
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
				<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
					Equipment Drop
				</h3>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="selectedEquipment"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Equipment
						</label>
						<select
							id="selectedEquipment"
							onChange={(e) => {
								const id = e.target.value as ID<Equipment>;

								const entry = EquipmentDrop.create(
									{
										equipment: equipmentMap[id],
										dropRate: 1,
									},
									monster._owner,
								);

								// @ts-expect-error TODO: fix this
								monster.drop[entry.id] = entry;
							}}
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
					{Object.values(monster.drop).map((entry) => (
						<div key={entry.id}>
							<div>{entry.equipment.name}</div>
							<label
								htmlFor={`dropRate-${entry.id}`}
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Drop Rate
							</label>
							<input
								id={`dropRate-${entry.id}`}
								type="number"
								min="0"
								value={entry.dropRate}
								onChange={(e) => {
									entry.dropRate = Number(e.target.value);
								}}
							/>
							<button
								type="button"
								onClick={() => {
									delete monster.drop[entry.id];
								}}
							>
								Delete
							</button>
						</div>
					))}
				</div>
				<div className="my-4 flex justify-between">
					<div className="relative">
						<label
							htmlFor="image"
							className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 inline-block"
						>
							Upload Image
						</label>
						<input
							id="image"
							type="file"
							className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
							onChange={async (e) => {
								const file = e.target.files?.[0];
								if (!file) return;

								const image = await createImage(file);
								monster.image = image;
								e.target.value = "";
							}}
						/>
					</div>
					{monster.image && (
						<ProgressiveImg image={monster.image} maxWidth={800}>
							{({ src }) => (
								<img src={src} alt={monster.name} className="gallery-image" />
							)}
						</ProgressiveImg>
					)}
				</div>
			</div>
			<div className="flex space-x-4">
				{props.isEditing === false && (
					<button
						type="submit"
						className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
					>
						Create
					</button>
				)}
				<button
					type="button"
					onClick={props.onCancel}
					className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
				>
					Close
				</button>
			</div>
		</form>
	);
}

function MonstersList(props: { onEdit: (id: string) => void }) {
	const { me } = useAccount({
		root: {
			game: {
				monsters: [
					{
						effects: [{}],
						essence: {
							effects: [{}],
						},
					},
				],
			},
		},
	});

	const handleDelete = (id: string) => {
		if (!me) return;

		delete me.root.game.monsters[id];
	};

	if (!me) {
		return <div>Loading monsters data...</div>;
	}

	const monsters = Object.values(me.root.game.monsters);

	return (
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
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
							Image
						</th>
						<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
					{monsters.length === 0 ? (
						<tr>
							<td
								colSpan={5}
								className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
							>
								No monsters found. Create one to get started.
							</td>
						</tr>
					) : (
						monsters.map((monster) => (
							<tr key={monster.id}>
								<td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
									{monster.name}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white capitalize">
									{monster.type}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
									{monster.essence?.name}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
									{monster.moneyDrop}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
									<ProgressiveImg image={monster.image} maxWidth={256}>
										{({ src }) => (
											<img
												src={src}
												alt={monster.name}
												className="gallery-image"
												width={28}
											/>
										)}
									</ProgressiveImg>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button
										type="button"
										onClick={() => props.onEdit(monster.id)}
										className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
									>
										Edit
									</button>
									<button
										type="button"
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
	);
}
