import {
	Html,
	Head,
	Body,
	Container,
	Section,
	Text,
	Heading,
	Hr,
	Preview,
} from "@react-email/components";
import { OUTPUT_COPY } from "@/lib/results/output-copy";
import { formatCurrency } from "@/lib/calculator/currency";
import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";

interface ResultsSummaryEmailProps {
	name?: string;
	input: CalculatorInput;
	output: CalculatorOutput;
	currency: Currency;
	alerts: Alert[];
}

/** Keys that represent monetary values (formatted with formatCurrency) */
const CURRENCY_KEYS = new Set([
	"monthlyRevenueTarget",
	"monthlyBillings",
	"hourlyFloorRate",
]);

/** Keys that use 2-decimal formatting */
const DECIMAL_KEYS = new Set(["hourlyFloorRate"]);

type AnchorKey = keyof typeof OUTPUT_COPY;

const ANCHOR_KEYS: AnchorKey[] = [
	"monthlyRevenueTarget",
	"monthlyBillings",
	"hourlyFloorRate",
	"jobsToWin",
	"quotesNeeded",
	"leadsNeeded",
];

function formatValue(
	key: AnchorKey,
	value: number,
	currency: Currency,
): string {
	if (CURRENCY_KEYS.has(key)) {
		const decimals = DECIMAL_KEYS.has(key) ? 2 : 0;
		return formatCurrency(value, currency, { decimals });
	}
	return String(value);
}

export function ResultsSummaryEmail({
	name,
	output,
	currency,
	alerts,
}: ResultsSummaryEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>
				Your Trade Survival Numbers — here is what your business needs to earn
			</Preview>
			<Body style={styles.body}>
				<Container style={styles.container}>
					<Heading as="h1" style={styles.heading}>
						Your Trade Survival Numbers
					</Heading>

					<Text style={styles.greeting}>
						{name ? `Hi ${name},` : "Hi,"}
					</Text>
					<Text style={styles.greeting}>
						Here are your Trade Survival Numbers — the minimum your business needs to keep you solvent.
					</Text>

					<Section>
						{ANCHOR_KEYS.map((key) => {
							const copy = OUTPUT_COPY[key];
							const rawValue =
								output[key as keyof CalculatorOutput] as number;
							const displayValue = formatValue(key, rawValue, currency);
							return (
								<Section key={key} style={styles.anchorBlock}>
									<Text style={styles.valueLabel}>{copy.label}</Text>
									<Text style={styles.valueNumber}>{displayValue}</Text>
									<Text style={styles.explanationText}>
										{copy.explanation}
									</Text>
								</Section>
							);
						})}
					</Section>

					{alerts.length > 0 && (
						<Section>
							<Hr style={styles.hr} />
							<Heading as="h2" style={styles.alertsHeading}>
								Important Notices
							</Heading>
							{alerts.map((alert) => (
								<Section key={alert.key}>
									<Text style={styles.alertTitle}>{alert.title}</Text>
									<Text style={styles.alertBody}>{alert.body}</Text>
								</Section>
							))}
						</Section>
					)}

					<Hr style={styles.hr} />
					<Text style={styles.disclaimer}>
						This report uses conservative estimates to protect your business
						planning. Tax figures use buffer rates (20% Corp Tax, 30% employer
						burden) — not precise statutory rates. Billable hours are capped at
						75% of contracted hours to account for non-billable time. Direct
						costs include a 15% slippage factor. Always consult a qualified
						accountant for tax advice specific to your situation. These numbers
						are a planning tool, not financial advice.
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

const styles = {
	body: {
		backgroundColor: "#f6f9fc",
		fontFamily: "Arial, sans-serif",
		padding: "40px 0",
	},
	container: {
		maxWidth: "600px",
		margin: "0 auto",
		padding: "20px",
		backgroundColor: "#ffffff",
		borderRadius: "8px",
	},
	heading: {
		color: "#1a1a1a",
		fontSize: "24px",
		fontWeight: "bold" as const,
		textAlign: "center" as const,
		margin: "0 0 24px",
	},
	greeting: {
		color: "#333",
		fontSize: "14px",
		lineHeight: "1.5",
		margin: "0 0 16px",
	},
	anchorBlock: {
		marginBottom: "8px",
	},
	valueLabel: {
		color: "#666",
		fontSize: "14px",
		margin: "0 0 4px",
	},
	valueNumber: {
		color: "#1a1a1a",
		fontSize: "28px",
		fontWeight: "bold" as const,
		margin: "0 0 8px",
	},
	explanationText: {
		color: "#666",
		fontSize: "13px",
		lineHeight: "1.5",
		margin: "0 0 24px",
	},
	hr: {
		borderColor: "#e5e7eb",
		margin: "24px 0",
	},
	alertsHeading: {
		color: "#1a1a1a",
		fontSize: "20px",
		fontWeight: "bold" as const,
		margin: "0 0 16px",
	},
	alertTitle: {
		color: "#b45309",
		fontSize: "16px",
		fontWeight: "bold" as const,
		margin: "0 0 4px",
	},
	alertBody: {
		color: "#666",
		fontSize: "13px",
		lineHeight: "1.5",
		margin: "0 0 16px",
	},
	disclaimer: {
		color: "#999",
		fontSize: "11px",
		lineHeight: "1.5",
		textAlign: "center" as const,
	},
};
