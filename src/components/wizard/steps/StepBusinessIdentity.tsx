"use client";

import { SelectInput } from "@/components/ui/SelectInput";

const ENTITY_TYPE_OPTIONS = [
	{ label: "Limited Company", value: "limited_company" },
	{ label: "Sole Trader", value: "sole_trader" },
];

const CURRENCY_OPTIONS = [
	{ label: "GBP (\u00a3)", value: "GBP" },
	{ label: "EUR (\u20ac)", value: "EUR" },
];

const VAT_RATE_OPTIONS = [
	{ label: "20% (UK Standard)", value: "0.20" },
	{ label: "13.5% (Ireland Reduced)", value: "0.135" },
	{ label: "23% (Ireland Standard)", value: "0.23" },
	{ label: "0% (VAT Exempt)", value: "0" },
];

export function StepBusinessIdentity() {
	return (
		<div className="flex flex-col gap-4">
			<div>
				<h2 className="text-2xl font-semibold text-foreground">Your Business</h2>
				<p className="text-base text-gray-500 mt-1">Tell us about your business setup</p>
			</div>
			<SelectInput
				name="entityType"
				label="Business Type"
				options={ENTITY_TYPE_OPTIONS}
			/>
			<SelectInput
				name="currency"
				label="Currency"
				options={CURRENCY_OPTIONS}
			/>
			<SelectInput
				name="vatRate"
				label="VAT Rate"
				options={VAT_RATE_OPTIONS}
			/>
		</div>
	);
}
