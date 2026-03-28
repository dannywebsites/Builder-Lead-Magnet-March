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
				className="w-full sm:w-auto px-6 py-3 rounded-lg text-base font-semibold min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
