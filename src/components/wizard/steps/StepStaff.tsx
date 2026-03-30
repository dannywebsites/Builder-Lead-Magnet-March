"use client";

import { useEffect } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { NumberInput } from "@/components/ui/NumberInput";
import { FIELD_COPY } from "@/lib/form/field-copy";

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
				<h2 className="text-2xl font-semibold text-foreground">
					{isStaffDisabled ? "Your Hours" : "Your Team"}
				</h2>
				<p className="text-base text-gray-500 mt-1">
					{isStaffDisabled
						? "How many hours you spend on billable work each week"
						: "Staff costs and working hours"}
				</p>
			</div>
			<NumberInput
				name="staffCount"
				label="Number of Staff"
				placeholder="0"
				min={0}
				step="1"
				explanation={FIELD_COPY.staffCount.explanation}
			/>
			{isStaffDisabled ? (
				<NumberInput
					name="ownerHoursPerWeek"
					label="Your Billable Hours Per Week"
					suffix="hrs"
					placeholder="e.g. 40"
					min={0}
					max={168}
					step="0.5"
					explanation={FIELD_COPY.ownerHoursPerWeek.explanation}
					disclaimer={FIELD_COPY.ownerHoursPerWeek.disclaimer ?? undefined}
				/>
			) : (
				<>
					<NumberInput
						name="staffHourlyRate"
						label="Staff Hourly Rate"
						prefix={currencySymbol}
						placeholder="e.g. 15"
						min={0}
						step="0.01"
						explanation={FIELD_COPY.staffHourlyRate.explanation}
						disclaimer={FIELD_COPY.staffHourlyRate.disclaimer ?? undefined}
					/>
					<NumberInput
						name="staffHoursPerWeek"
						label="Staff Hours Per Week"
						suffix="hrs"
						placeholder="e.g. 40"
						min={0}
						max={168}
						step="0.5"
						explanation={FIELD_COPY.staffHoursPerWeek.explanation}
						disclaimer={FIELD_COPY.staffHoursPerWeek.disclaimer ?? undefined}
					/>
				</>
			)}
		</div>
	);
}
