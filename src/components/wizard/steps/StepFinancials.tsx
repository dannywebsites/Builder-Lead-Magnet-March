"use client";

import { useEffect } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { NumberInput } from "@/components/ui/NumberInput";
import { FIELD_COPY } from "@/lib/form/field-copy";

const FIXED_COST_FIELDS = [
	"fixedCostVehicle",
	"fixedCostPremises",
	"fixedCostEquipment",
	"fixedCostInsurance",
	"fixedCostTechnology",
	"fixedCostLoans",
	"fixedCostProfessional",
	"fixedCostOther",
] as const;

const FIXED_COST_LABELS: Record<(typeof FIXED_COST_FIELDS)[number], string> = {
	fixedCostVehicle: "Vehicle / Van",
	fixedCostPremises: "Premises / Rent",
	fixedCostEquipment: "Equipment / Tools",
	fixedCostInsurance: "Insurance",
	fixedCostTechnology: "Technology / Software",
	fixedCostLoans: "Loans / Finance",
	fixedCostProfessional: "Professional Fees",
	fixedCostOther: "Other",
};

export function StepFinancials() {
	const { setValue } = useFormContext();
	const currency = useWatch({ name: "currency" });
	const categories = useWatch({ name: [...FIXED_COST_FIELDS] });
	const currencySymbol = currency === "EUR" ? "\u20ac" : "\u00a3";

	const total = (categories as number[]).reduce(
		(sum: number, val: number) => sum + (val || 0),
		0,
	);

	useEffect(() => {
		setValue("fixedOverheads", total);
	}, [total, setValue]);

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h2 className="text-2xl font-semibold text-foreground">Your Money</h2>
				<p className="text-base text-gray-500 mt-1">
					What you need to take home and what the business spends each month
				</p>
			</div>

			<NumberInput
				name="grossPersonalDraw"
				label="Monthly Take-Home Target"
				prefix={currencySymbol}
				placeholder="e.g. 4000"
				min={0}
				step="0.01"
				explanation={FIELD_COPY.grossPersonalDraw.explanation}
				disclaimer={FIELD_COPY.grossPersonalDraw.disclaimer ?? undefined}
			/>

			<div className="mt-4">
				<h3 className="text-lg font-semibold text-foreground">
					Monthly Fixed Costs
				</h3>
				<p className="text-sm text-gray-500 mt-1">
					Break down your regular business bills. Enter 0 for any category that
					does not apply to you.
				</p>
			</div>

			{FIXED_COST_FIELDS.map((fieldName) => (
				<NumberInput
					key={fieldName}
					name={fieldName}
					label={FIXED_COST_LABELS[fieldName]}
					prefix={currencySymbol}
					placeholder="e.g. 200"
					min={0}
					step="0.01"
					explanation={FIELD_COPY[fieldName].explanation}
				/>
			))}

			<div className="border-t border-gray-200 pt-3 mt-2 flex justify-between items-center">
				<span className="text-sm font-semibold text-foreground">
					Total Monthly Fixed Costs
				</span>
				<span className="text-lg font-bold text-foreground">
					{currencySymbol}
					{total.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</span>
			</div>
		</div>
	);
}
