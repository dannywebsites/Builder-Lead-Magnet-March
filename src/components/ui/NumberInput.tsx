"use client";

import { useFormContext } from "react-hook-form";

interface NumberInputProps {
	name: string;
	label: string;
	prefix?: string;
	suffix?: string;
	placeholder?: string;
	disabled?: boolean;
	min?: number;
	max?: number;
	step?: string;
	explanation?: string;
	disclaimer?: string;
}

export function NumberInput({
	name,
	label,
	prefix,
	suffix,
	placeholder,
	disabled = false,
	min,
	max,
	step,
	explanation,
	disclaimer,
}: NumberInputProps) {
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
				<p className={`text-sm text-gray-500 ${disabled ? "opacity-50" : ""}`}>
					{explanation}
				</p>
			)}
			<div className="relative">
				{prefix && (
					<span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
						{prefix}
					</span>
				)}
				<input
					id={name}
					type="number"
					placeholder={placeholder}
					disabled={disabled}
					min={min}
					max={max}
					step={step}
					aria-invalid={!!error}
					aria-describedby={[error ? `${name}-error` : "", disclaimer ? `${name}-disclaimer` : ""].filter(Boolean).join(" ") || undefined}
					className={`w-full rounded-lg border px-3 py-3 min-h-[44px] bg-white focus:outline-none focus:ring-2 ${
						prefix ? "pl-8" : ""
					} ${suffix ? "pr-12" : ""} ${
						error
							? "border-red-500 focus:ring-red-500"
							: "border-gray-300 focus:ring-blue-500"
					} ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
					{...register(name, { valueAsNumber: true })}
				/>
				{suffix && (
					<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
						{suffix}
					</span>
				)}
			</div>
			{error && (
				<p id={`${name}-error`} className="text-sm text-red-600" role="alert">
					{typeof error.message === "string" ? error.message : ""}
				</p>
			)}
			{disclaimer && (
				<p
					id={`${name}-disclaimer`}
					className={`text-xs text-gray-400 italic ${disabled ? "opacity-50" : ""}`}
				>
					{disclaimer}
				</p>
			)}
		</div>
	);
}
