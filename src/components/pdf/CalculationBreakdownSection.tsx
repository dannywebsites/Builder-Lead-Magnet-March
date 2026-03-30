import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";
import { formatCurrency } from "@/lib/calculator/currency";

const styles = StyleSheet.create({
	section: {
		marginTop: 16,
		marginBottom: 8,
	},
	title: {
		fontSize: 14,
		fontFamily: "Helvetica-Bold",
		color: "#1e3a5f",
		marginBottom: 8,
	},
	intro: {
		fontSize: 8,
		color: "#6b7280",
		marginBottom: 8,
	},
	groupLabel: {
		fontSize: 8,
		fontFamily: "Helvetica-Bold",
		color: "#9ca3af",
		textTransform: "uppercase",
		letterSpacing: 0.5,
		marginTop: 8,
		marginBottom: 4,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 3,
	},
	highlightRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 4,
		borderTopWidth: 0.5,
		borderTopColor: "#d1d5db",
		marginTop: 2,
	},
	label: {
		fontSize: 9,
		color: "#4b5563",
		maxWidth: "70%",
	},
	highlightLabel: {
		fontSize: 9,
		fontFamily: "Helvetica-Bold",
		color: "#1a1a1a",
		maxWidth: "70%",
	},
	value: {
		fontSize: 9,
		fontFamily: "Helvetica-Bold",
		color: "#1a1a1a",
	},
	highlightValue: {
		fontSize: 9,
		fontFamily: "Helvetica-Bold",
		color: "#2563eb",
	},
});

interface Props {
	input: CalculatorInput;
	output: CalculatorOutput;
	currency: Currency;
}

function Row({
	label,
	value,
	highlight,
}: { label: string; value: string; highlight?: boolean }) {
	return (
		<View style={highlight ? styles.highlightRow : styles.row}>
			<Text style={highlight ? styles.highlightLabel : styles.label}>
				{label}
			</Text>
			<Text style={highlight ? styles.highlightValue : styles.value}>
				{value}
			</Text>
		</View>
	);
}

export function CalculationBreakdownSection({
	input,
	output,
	currency,
}: Props) {
	const fmt = (n: number) => formatCurrency(n, currency);
	const fmtDec = (n: number) =>
		formatCurrency(n, currency, { decimals: 2 });
	const isLtd = input.entityType === "limited_company";
	const hasStaff = input.staffCount > 0;
	const hasVat = input.vatRate > 0;
	const marginPct = (output.marginAfterMaterials * 100).toFixed(1);

	return (
		<View style={styles.section}>
			<Text style={styles.title}>Your Numbers, Step by Step</Text>
			<Text style={styles.intro}>
				Here is exactly how we got from your inputs to your numbers.
			</Text>

			<Text style={styles.groupLabel}>What you need to earn</Text>
			<Row
				label="Your monthly take-home target"
				value={`${fmt(input.grossPersonalDraw)}/mo`}
			/>
			{isLtd && (
				<Row
					label="+ Corporation Tax buffer (20%)"
					value={fmt(output.taxBufferAmount)}
				/>
			)}
			<Row
				label={
					isLtd
						? "= Business must earn (before costs)"
						: "= Your earnings target"
				}
				value={`${fmt(output.targetBusinessProfit)}/mo`}
				highlight
			/>

			<Text style={styles.groupLabel}>Your monthly costs</Text>
			<Row
				label="Fixed overheads (rent, van, tools, insurance, etc.)"
				value={fmt(input.fixedOverheads)}
			/>
			{hasStaff ? (
				<>
					<Row
						label={`Staff base pay (${input.staffCount} staff x ${input.staffHoursPerWeek}hrs/wk x ${fmtDec(input.staffHourlyRate)}/hr)`}
						value={fmt(output.basePayroll)}
					/>
					<Row
						label="+ 30% employer burden (NI, pension, etc.)"
						value={fmt(output.employerBurdenAmount)}
					/>
				</>
			) : (
				<Row label="Staff costs (solo operator)" value={fmt(0)} />
			)}
			<Row
				label="= Total monthly costs to cover"
				value={`${fmt(output.adjustedOverheads)}/mo`}
				highlight
			/>

			<Text style={styles.groupLabel}>Revenue you need to generate</Text>
			<Row
				label="Earnings + costs to cover"
				value={fmt(output.targetBusinessProfit + output.adjustedOverheads)}
			/>
			<Row
				label={`Direct costs eat ${(input.directCostPct * 100).toFixed(0)}% of every job (+ 15% slippage buffer)`}
				value={`${(output.realDirectCost * 100).toFixed(1)}% gone`}
			/>
			<Row
				label={`So you keep ${marginPct}% of each pound billed`}
				value=""
			/>
			<Row
				label="= Minimum monthly revenue (net)"
				value={`${fmt(output.monthlyRevenueTarget)}/mo`}
				highlight
			/>

			<Text style={styles.groupLabel}>What you invoice and charge</Text>
			{hasVat && (
				<Row
					label={`+ VAT at ${(input.vatRate * 100).toFixed(0)}%`}
					value={fmt(output.monthlyBillings - output.monthlyRevenueTarget)}
				/>
			)}
			<Row
				label={
					hasVat
						? "= Monthly billings (inc. VAT)"
						: "= Monthly billings (VAT exempt)"
				}
				value={`${fmt(output.monthlyBillings)}/mo`}
				highlight
			/>
			{output.totalBillableHours > 0 && (
				<>
					<Row
						label={`${output.totalBillableHours.toFixed(1)} billable hours/month (75% efficiency cap)`}
						value=""
					/>
					<Row
						label="= Hourly floor rate"
						value={`${fmtDec(output.hourlyFloorRate)}/hr`}
						highlight
					/>
				</>
			)}
		</View>
	);
}
