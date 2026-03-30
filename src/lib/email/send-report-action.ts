import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";

interface SendReportPayload {
	name: string;
	email: string;
	consent: true;
	calculatorInput: CalculatorInput;
	calculatorOutput: CalculatorOutput;
	currency: Currency;
	alerts: Alert[];
}

export async function sendReport(
	payload: SendReportPayload,
): Promise<{ success: boolean; error?: string }> {
	try {
		const response = await fetch("/api/send-report", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const data = await response.json().catch(() => ({}));
			return {
				success: false,
				error: data.error || "Something went wrong. Please try again.",
			};
		}

		return { success: true };
	} catch {
		return {
			success: false,
			error: "Could not connect to server. Please try again.",
		};
	}
}
