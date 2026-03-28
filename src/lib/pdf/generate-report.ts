import { pdf } from "@react-pdf/renderer";
import { TradeSurvivalReport } from "@/components/pdf/TradeSurvivalReport";
import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";

export async function generateAndDownloadReport(
	input: CalculatorInput,
	output: CalculatorOutput,
	currency: Currency,
	alerts: Alert[],
): Promise<void> {
	const blob = await pdf(
		TradeSurvivalReport({ input, output, currency, alerts }),
	).toBlob();

	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = "trade-survival-report.pdf";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
