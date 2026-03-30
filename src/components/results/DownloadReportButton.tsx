"use client";

import { useState } from "react";
import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";
import { EmailCaptureModal } from "@/components/email/EmailCaptureModal";

interface DownloadReportButtonProps {
	input: CalculatorInput;
	output: CalculatorOutput;
	currency: Currency;
	alerts: Alert[];
}

export function DownloadReportButton({
	input,
	output,
	currency,
	alerts,
}: DownloadReportButtonProps) {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setShowModal(true)}
				className="w-full sm:w-auto px-8 py-3 rounded-xl text-base font-bold min-h-[44px] bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] shadow-md hover:shadow-lg transition-all"
			>
				Get Your Trade Survival Report
			</button>
			<EmailCaptureModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				input={input}
				output={output}
				currency={currency}
				alerts={alerts}
			/>
		</>
	);
}
