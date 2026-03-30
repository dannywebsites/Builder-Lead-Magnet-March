"use client";

import Link from "next/link";

interface ConsentCheckboxProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	error?: string;
}

export function ConsentCheckbox({
	checked,
	onChange,
	error,
}: ConsentCheckboxProps) {
	return (
		<div className="space-y-1">
			<label className="flex items-start gap-3 cursor-pointer">
				<input
					type="checkbox"
					id="consent"
					name="consent"
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
					className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--brand)] focus:ring-[var(--brand)]"
				/>
				<span className="text-sm text-gray-700">
					I agree to receive my report and occasional tips by email. See our{" "}
					<Link
						href="/privacy"
						className="text-[var(--brand)] hover:underline"
						target="_blank"
					>
						Privacy Policy
					</Link>
					.
				</span>
			</label>
			{error && (
				<p className="text-sm text-red-600 ml-7" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}
