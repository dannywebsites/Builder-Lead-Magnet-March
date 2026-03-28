"use client";

import { useState } from "react";
import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";

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
	const [isGenerating, setIsGenerating] = useState(false);

	async function handleDownload() {
		setIsGenerating(true);
		try {
			const { generateAndDownloadReport } = await import(
				"@/lib/pdf/generate-report"
			);
			await generateAndDownloadReport(input, output, currency, alerts);
		} catch (error) {
			console.error("PDF generation failed:", error);
		} finally {
			setIsGenerating(false);
		}
	}

	return (
		<button
			type="button"
			onClick={handleDownload}
			disabled={isGenerating}
			className="w-full sm:w-auto px-6 py-3 rounded-lg text-base font-semibold min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		>
			{isGenerating ? "Generating Report..." : "Get Your Trade Survival Report"}
		</button>
	);
}
