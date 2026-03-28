import { View, Text } from "@react-pdf/renderer";
import { reportStyles } from "./report-styles";
import { OUTPUT_COPY, ZERO_STAFF_HOURLY_NOTE } from "@/lib/results/output-copy";
import { formatCurrency } from "@/lib/calculator/currency";
import type { CalculatorOutput, Currency } from "@/lib/calculator/types";

interface FinancialAnchorsSectionProps {
	output: CalculatorOutput;
	currency: Currency;
	staffCount: number;
}

export function FinancialAnchorsSection({
	output,
	currency,
	staffCount,
}: FinancialAnchorsSectionProps) {
	return (
		<View>
			<Text style={reportStyles.sectionTitle}>
				What Your Business Needs to Earn
			</Text>

			<View style={reportStyles.metricRow}>
				<Text style={reportStyles.metricLabel}>
					{OUTPUT_COPY.monthlyRevenueTarget.label}
				</Text>
				<Text style={reportStyles.metricValue}>
					{formatCurrency(output.monthlyRevenueTarget, currency)}
				</Text>
			</View>
			<Text style={reportStyles.metricExplanation}>
				{OUTPUT_COPY.monthlyRevenueTarget.explanation}
			</Text>

			<View style={reportStyles.metricRow}>
				<Text style={reportStyles.metricLabel}>
					{OUTPUT_COPY.monthlyBillings.label}
				</Text>
				<Text style={reportStyles.metricValue}>
					{formatCurrency(output.monthlyBillings, currency)}
				</Text>
			</View>
			<Text style={reportStyles.metricExplanation}>
				{OUTPUT_COPY.monthlyBillings.explanation}
			</Text>

			<View style={reportStyles.metricRow}>
				<Text style={reportStyles.metricLabel}>
					{OUTPUT_COPY.hourlyFloorRate.label}
				</Text>
				<Text style={reportStyles.metricValue}>
					{formatCurrency(output.hourlyFloorRate, currency, { decimals: 2 })}
				</Text>
			</View>
			<Text style={reportStyles.metricExplanation}>
				{OUTPUT_COPY.hourlyFloorRate.explanation}
			</Text>
			{staffCount === 0 && (
				<Text style={reportStyles.metricExplanation}>
					{ZERO_STAFF_HOURLY_NOTE}
				</Text>
			)}
		</View>
	);
}
