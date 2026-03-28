"use client";

import { useFormContext } from "react-hook-form";

interface SelectInputProps {
	name: string;
	label: string;
	options: Array<{ label: string; value: string }>;
	placeholder?: string;
	explanation?: string;
}

export function SelectInput({
	name,
	label,
	options,
	placeholder,
	explanation,
}: SelectInputProps) {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	const error = errors[name];

	return (
		<div className="space-y-1">
			<label
				htmlFor={name}
				className="block text-sm font-semibold text-foreground"
			>
				{label}
			</label>
			{explanation && (
				<p className="text-sm text-gray-500">{explanation}</p>
			)}
			<select
				id={name}
				aria-invalid={!!error}
				aria-describedby={error ? `${name}-error` : undefined}
				className={`w-full rounded-lg border px-3 py-3 min-h-[44px] bg-white focus:outline-none focus:ring-2 ${
					error
						? "border-red-500 focus:ring-red-500"
						: "border-gray-300 focus:ring-blue-500"
				}`}
				{...register(name)}
			>
				{placeholder && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
			{error && (
				<p id={`${name}-error`} className="text-sm text-red-600" role="alert">
					{typeof error.message === "string" ? error.message : ""}
				</p>
			)}
		</div>
	);
}
