"use client";

import { useWatch } from "react-hook-form";
import { NumberInput } from "@/components/ui/NumberInput";

export function StepJobPricing() {
	const currency = useWatch({ name: "currency" });
	const currencySymbol = currency === "EUR" ? "\u20ac" : "\u00a3";

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h2 className="text-2xl font-semibold text-foreground">Your Jobs</h2>
				<p className="text-base text-gray-500 mt-1">How much your typical job is worth</p>
			</div>
			<NumberInput
				name="avgJobValue"
				label="Average Job Value (exc. VAT)"
				prefix={currencySymbol}
				placeholder="e.g. 3000"
				min={0}
				step="0.01"
			/>
			<NumberInput
				name="directCostPctDisplay"
				label="Direct Costs %"
				suffix="%"
				placeholder="e.g. 35"
				min={0}
				max={80}
				step="0.1"
			/>
		</div>
	);
}
