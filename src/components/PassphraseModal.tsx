"use client";

import { usePassphraseAuth } from "jazz-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { wordlist } from "@/components/wordlist";
import { Textarea } from "./ui/textarea";
interface PassphraseModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function PassphraseModal({ open, onOpenChange }: PassphraseModalProps) {
	const passphraseAuth = usePassphraseAuth({
		wordlist,
	});
	
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Store your passphrase</DialogTitle>
					<DialogDescription>
						Store your passphrase to use it later
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<Label htmlFor="passphrase">Passphrase</Label>
					<Textarea name="passphrase" readOnly value={passphraseAuth.passphrase} />
					<Button onClick={() => navigator.clipboard.writeText(passphraseAuth.passphrase)}>Copy to clipboard</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
