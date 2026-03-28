"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { emailCaptureSchema } from "@/lib/email/schema";
import type { EmailCaptureData } from "@/lib/email/schema";
import { sendReport } from "@/lib/email/send-report-action";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";
import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";

interface EmailCaptureModalProps {
	isOpen: boolean;
	onClose: () => void;
	input: CalculatorInput;
	output: CalculatorOutput;
	currency: Currency;
	alerts: Alert[];
}

export function EmailCaptureModal({
	isOpen,
	onClose,
	input,
	output,
	currency,
	alerts,
}: EmailCaptureModalProps) {
	const [apiError, setApiError] = useState<string | null>(null);
	const emailRef = useRef<HTMLInputElement | null>(null);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<EmailCaptureData>({
		resolver: zodResolver(emailCaptureSchema),
		defaultValues: {
			email: "",
			consent: false as unknown as true,
		},
	});

	// Escape key handler
	useEffect(() => {
		if (!isOpen) return;
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				onClose();
			}
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	// Auto-focus email input on open
	useEffect(() => {
		if (isOpen && emailRef.current) {
			emailRef.current.focus();
		}
	}, [isOpen]);

	// Reset form state when modal closes
	useEffect(() => {
		if (!isOpen) {
			reset();
			setApiError(null);
		}
	}, [isOpen, reset]);

	if (!isOpen) return null;

	const onSubmit = async (formData: EmailCaptureData) => {
		setApiError(null);
		const result = await sendReport({
			email: formData.email,
			consent: formData.consent,
			calculatorInput: input,
			calculatorOutput: output,
			currency,
			alerts,
		});

		if (result.success) {
			onClose();
			toast.success("Report sent to your email");
			const { generateAndDownloadReport } = await import(
				"@/lib/pdf/generate-report"
			);
			await generateAndDownloadReport(input, output, currency, alerts);
		} else {
			setApiError(
				result.error ||
					"Failed to send email. You can still download your report below.",
			);
		}
	};

	async function handleFallbackDownload() {
		const { generateAndDownloadReport } = await import(
			"@/lib/pdf/generate-report"
		);
		await generateAndDownloadReport(input, output, currency, alerts);
		onClose();
	}

	const { ref: formRef, ...emailRegister } = register("email");

	return (
		<div
			className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
			onClick={onClose}
			onKeyDown={undefined}
		>
			<div
				role="dialog"
				aria-modal="true"
				className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 relative"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={undefined}
			>
				<button
					type="button"
					onClick={onClose}
					className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
					aria-label="Close"
				>
					&#x00D7;
				</button>

				<h2 className="text-xl font-bold text-gray-900 mb-2">
					Get Your Trade Survival Report
				</h2>
				<p className="text-sm text-gray-600 mb-5">
					Enter your email and we'll send you a summary plus your
					downloadable report.
				</p>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<input
							type="email"
							aria-label="Email address"
							placeholder="your@email.com"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							{...emailRegister}
							ref={(e) => {
								formRef(e);
								emailRef.current = e;
							}}
						/>
						{errors.email && (
							<p className="text-sm text-red-600 mt-1" role="alert">
								{errors.email.message}
							</p>
						)}
					</div>

					<Controller
						name="consent"
						control={control}
						render={({ field, fieldState }) => (
							<ConsentCheckbox
								checked={!!field.value}
								onChange={field.onChange}
								error={fieldState.error?.message}
							/>
						)}
					/>

					{apiError && (
						<p className="text-sm text-red-600" role="alert">
							{apiError}
						</p>
					)}

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmitting ? "Sending..." : "Send My Report"}
					</button>

					{apiError && (
						<button
							type="button"
							onClick={handleFallbackDownload}
							className="w-full text-sm text-blue-600 hover:underline"
						>
							Download Report Without Email
						</button>
					)}
				</form>
			</div>
		</div>
	);
}
