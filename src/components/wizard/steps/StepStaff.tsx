"use client";

import { useEffect } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { NumberInput } from "@/components/ui/NumberInput";

export function StepStaff() {
	const { setValue } = useFormContext();
	const staffCount = useWatch({ name: "staffCount" });
	const currency = useWatch({ name: "currency" });
	const currencySymbol = currency === "EUR" ? "\u20ac" : "\u00a3";

	const isStaffDisabled = staffCount === 0 || Number.isNaN(staffCount);

	useEffect(() => {
		if (staffCount === 0 || Number.isNaN(staffCount)) {
			setValue("staffHourlyRate", 0);
			setValue("staffHoursPerWeek", 0);
		}
	}, [staffCount, setValue]);

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h2 className="text-2xl font-semibold text-foreground">Your Team</h2>
				<p className="text-base text-gray-500 mt-1">Staff costs -- skip if you work solo</p>
			</div>
			<NumberInput
				name="staffCount"
				label="Number of Staff"
				placeholder="0"
				min={0}
				step="1"
			/>
			<NumberInput
				name="staffHourlyRate"
				label="Staff Hourly Rate"
				prefix={currencySymbol}
				placeholder="e.g. 15"
				disabled={isStaffDisabled}
				min={0}
				step="0.01"
			/>
			<NumberInput
				name="staffHoursPerWeek"
				label="Staff Hours Per Week"
				suffix="hrs"
				placeholder="e.g. 40"
				disabled={isStaffDisabled}
				min={0}
				max={168}
				step="0.5"
			/>
		</div>
	);
}
