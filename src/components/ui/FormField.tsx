"use client";

import type { FieldError } from "react-hook-form";

interface FormFieldProps {
	name: string;
	label: string;
	children: React.ReactNode;
	error?: FieldError;
}

export function FormField({ name, label, children, error }: FormFieldProps) {
	return (
		<div className="space-y-1">
			<label
				htmlFor={name}
				className="block text-sm font-semibold text-foreground"
			>
				{label}
			</label>
			{children}
			{error && (
				<p
					id={`${name}-error`}
					className="text-sm text-red-600"
					role="alert"
					aria-describedby={`${name}-error`}
				>
					{error.message}
				</p>
			)}
		</div>
	);
}
