"use client";

import { useAccount } from "jazz-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function RuleBookEditor() {
	const { me } = useAccount({
		root: {
			game: {
				ruleBook: {},
			},
		},
	});

	const [content, setContent] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const navigate = useNavigate();

	const ruleBook = me?.root?.game?.ruleBook;

	useEffect(() => {
		if (ruleBook) {
			setContent(ruleBook.content || "");
		}
	}, [ruleBook]);

	const handleSave = () => {
		if (ruleBook) {
			setIsSaving(true);

			// Update rulebook content
			ruleBook.content = content;

			// Simulate a delay to show saving state
			setTimeout(() => {
				setIsSaving(false);
				setLastSaved(new Date());
			}, 500);
		}
	};

	if (!ruleBook) {
		return <div>Loading rulebook data...</div>;
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Rulebook Editor</h1>
				<div className="flex items-center space-x-4">
					<span className="text-sm text-muted-foreground">
						{lastSaved
							? `Last saved: ${lastSaved.toLocaleTimeString()}`
							: "Not saved yet"}
					</span>
					<Button onClick={handleSave} disabled={isSaving}>
						{isSaving ? "Saving..." : "Save"}
					</Button>
					<Button variant="outline" onClick={() => navigate("/")}>
						Back
					</Button>
				</div>
			</div>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Edit Rulebook</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground mb-4">
						This editor supports Markdown formatting. You can use # for
						headings, * for lists, etc.
					</p>
					<Textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="min-h-[300px] font-mono"
						placeholder="# Game Rules

## Introduction
Write your game rules here...

## Character Creation
...

## Combat
...

## Items and Equipment
..."
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Preview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="prose dark:prose-invert max-w-none">
						{content.split("\n").map((line, index) => {
							// Very basic markdown rendering for preview
							if (line.startsWith("# ")) {
								return (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<h1 key={index} className="text-2xl font-bold mb-4">
										{line.substring(2)}
									</h1>
								);
							}
							if (line.startsWith("## ")) {
								return (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<h2 key={index} className="text-xl font-bold mb-3">
										{line.substring(3)}
									</h2>
								);
							}
							if (line.startsWith("### ")) {
								return (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<h3 key={index} className="text-lg font-bold mb-2">
										{line.substring(4)}
									</h3>
								);
							}
							if (line.startsWith("- ")) {
								return (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<li key={index} className="ml-4">
										{line.substring(2)}
									</li>
								);
							}
							if (line === "") {
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								return <br key={index} />;
							}
							return (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<p key={index} className="mb-2">
									{line}
								</p>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
