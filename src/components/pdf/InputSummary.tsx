import { View, Text } from "@react-pdf/renderer";
import { reportStyles } from "./report-styles";
import { formatCurrency } from "@/lib/calculator/currency";
import { VAT_RATE_OPTIONS } from "@/lib/calculator/types";
import type { CalculatorInput, Currency } from "@/lib/calculator/types";

interface InputSummaryProps {
	input: CalculatorInput;
	currency: Currency;
}

export function InputSummary({ input, currency }: InputSummaryProps) {
	const vatLabel =
		VAT_RATE_OPTIONS.find((opt) => opt.value === input.vatRate)?.label ??
		`${(input.vatRate * 100).toFixed(1)}%`;

	return (
		<View>
			<Text style={reportStyles.sectionTitle}>Your Scenario</Text>

			<View style={reportStyles.inputRow}>
				<Text style={reportStyles.inputLabel}>Business Type</Text>
				<Text style={reportStyles.inputValue}>
					{input.entityType === "limited_company"
						? "Limited Company"
						: "Sole Trader"}
				</Text>
			</View>

			<View style={reportStyles.inputRow}>
				<Text style={reportStyles.inputLabel}>Monthly Gross Draw</Text>
				<Text style={reportStyles.inputValue}>
					{formatCurrency(input.grossPersonalDraw, currency)}
				</Text>
			</View>

			<View style={reportStyles.inputRow}>
				<Text style={reportStyles.inputLabel}>VAT Rate</Text>
				<Text style={reportStyles.inputValue}>{vatLabel}</Text>
			</View>

			<View style={reportStyles.inputRow}>
				<Text style={reportStyles.inputLabel}>Staff Count</Text>
				<Text style={reportStyles.inputValue}>
					{input.staffCount} {input.staffCount === 1 ? "employee" : "employees"}
				</Text>
			</View>
		</View>
	);
}
