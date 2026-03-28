import { Document, Page, Text } from "@react-pdf/renderer";
import { reportStyles } from "./report-styles";
import { ReportHeader } from "./ReportHeader";
import { InputSummary } from "./InputSummary";
import { FinancialAnchorsSection } from "./FinancialAnchorsSection";
import { AlertsSection } from "./AlertsSection";
import { PipelineSection } from "./PipelineSection";
import { DisclaimersFooter } from "./DisclaimersFooter";
import type { CalculatorInput, CalculatorOutput, Currency } from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";

export interface ReportProps {
	input: CalculatorInput;
	output: CalculatorOutput;
	currency: Currency;
	alerts: Alert[];
}

export function TradeSurvivalReport({
	input,
	output,
	currency,
	alerts,
}: ReportProps) {
	return (
		<Document title="Trade Survival Report" author="Trade Survival Calculator">
			<Page size="A4" style={reportStyles.page}>
				<ReportHeader />
				<InputSummary input={input} currency={currency} />
				<FinancialAnchorsSection
					output={output}
					currency={currency}
					staffCount={input.staffCount}
				/>
				{alerts.length > 0 && <AlertsSection alerts={alerts} />}
				<PipelineSection output={output} />
				<DisclaimersFooter />
				<Text style={reportStyles.dateText}>
					Generated: {new Date().toLocaleDateString("en-GB")}
				</Text>
			</Page>
		</Document>
	);
}
