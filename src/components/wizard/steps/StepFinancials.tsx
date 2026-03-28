"use client";

import { useWatch } from "react-hook-form";
import { NumberInput } from "@/components/ui/NumberInput";

export function StepFinancials() {
	const currency = useWatch({ name: "currency" });
	const currencySymbol = currency === "EUR" ? "\u20ac" : "\u00a3";

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h2 className="text-2xl font-semibold text-foreground">Your Money</h2>
				<p className="text-base text-gray-500 mt-1">What you need to take home and what you spend</p>
			</div>
			<NumberInput
				name="grossPersonalDraw"
				label="Monthly Take-Home Target"
				prefix={currencySymbol}
				placeholder="e.g. 4000"
				min={0}
				step="0.01"
			/>
			<NumberInput
				name="fixedOverheads"
				label="Monthly Fixed Costs"
				prefix={currencySymbol}
				placeholder="e.g. 2000"
				min={0}
				step="0.01"
			/>
		</div>
	);
}
