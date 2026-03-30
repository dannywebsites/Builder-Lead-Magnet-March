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
	Row,
	Column,
	Img,
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

/** Top 3 financial anchors — displayed as hero cards */
const FINANCIAL_KEYS: AnchorKey[] = [
	"monthlyRevenueTarget",
	"monthlyBillings",
	"hourlyFloorRate",
];

/** Bottom 3 pipeline metrics — displayed in a compact row */
const PIPELINE_KEYS: AnchorKey[] = [
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
				{/* Brand header bar */}
				<Container style={styles.headerBar}>
					<Img
						src={`${process.env.NEXT_PUBLIC_BASE_URL || "https://insulatemarket.com"}/insulate-market-logo.jpg`}
						alt="Insulate Market"
						width="180"
						height="auto"
						style={styles.logo}
					/>
				</Container>

				<Container style={styles.container}>
					{/* Hero section */}
					<Section style={styles.heroSection}>
						<Heading as="h1" style={styles.heading}>
							Your Trade Survival Numbers
						</Heading>
						<Text style={styles.heroSubtext}>
							{name ? `${name}, here` : "Here"} are the numbers your business needs to hit — no optimistic assumptions, no perfect-world math.
						</Text>
					</Section>

					<Hr style={styles.hrBrand} />

					{/* Financial anchor cards */}
					<Section>
						{FINANCIAL_KEYS.map((key) => {
							const copy = OUTPUT_COPY[key];
							const rawValue =
								output[key as keyof CalculatorOutput] as number;
							const displayValue = formatValue(key, rawValue, currency);
							return (
								<Section key={key} style={styles.anchorCard}>
									<Text style={styles.anchorLabel}>{copy.label}</Text>
									<Text style={styles.anchorValue}>{displayValue}</Text>
									<Text style={styles.anchorExplanation}>
										{copy.explanation}
									</Text>
								</Section>
							);
						})}
					</Section>

					{/* Pipeline metrics row */}
					<Section style={styles.pipelineSection}>
						<Text style={styles.pipelineSectionTitle}>
							Your Monthly Pipeline
						</Text>
						<Row>
							{PIPELINE_KEYS.map((key) => {
								const copy = OUTPUT_COPY[key];
								const rawValue =
									output[key as keyof CalculatorOutput] as number;
								const displayValue = formatValue(key, rawValue, currency);
								return (
									<Column key={key} style={styles.pipelineColumn}>
										<Text style={styles.pipelineValue}>{displayValue}</Text>
										<Text style={styles.pipelineLabel}>{copy.label}</Text>
									</Column>
								);
							})}
						</Row>
					</Section>

					{/* Alerts */}
					{alerts.length > 0 && (
						<Section>
							<Hr style={styles.hr} />
							<Heading as="h2" style={styles.alertsHeading}>
								Important Notices
							</Heading>
							{alerts.map((alert) => (
								<Section key={alert.key} style={styles.alertCard}>
									<Text style={styles.alertTitle}>{alert.title}</Text>
									<Text style={styles.alertBody}>{alert.body}</Text>
								</Section>
							))}
						</Section>
					)}

					<Hr style={styles.hr} />

					{/* Disclaimer */}
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

				{/* Footer */}
				<Container style={styles.footer}>
					<Text style={styles.footerText}>
						Insulate Market — Helping tradespeople price with confidence
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

/* ── Brand tokens ── */
const BRAND = "#ED0D51";
const BRAND_LIGHT = "rgba(237, 13, 81, 0.06)";
const SLATE_900 = "#0f172a";
const SLATE_700 = "#334155";
const SLATE_500 = "#64748b";
const SLATE_200 = "#e2e8f0";
const SLATE_50 = "#f8fafc";

const styles = {
	body: {
		backgroundColor: SLATE_50,
		fontFamily:
			"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
		padding: "0",
		margin: "0",
	},
	headerBar: {
		backgroundColor: BRAND,
		padding: "16px 0",
		textAlign: "center" as const,
		maxWidth: "600px",
		margin: "0 auto",
		borderRadius: "8px 8px 0 0",
	},
	logo: {
		margin: "0 auto",
		display: "block" as const,
	},
	container: {
		maxWidth: "600px",
		margin: "0 auto",
		padding: "32px 24px",
		backgroundColor: "#ffffff",
	},
	heroSection: {
		textAlign: "center" as const,
		marginBottom: "8px",
	},
	heading: {
		color: SLATE_900,
		fontSize: "26px",
		fontWeight: "bold" as const,
		textAlign: "center" as const,
		margin: "0 0 12px",
		lineHeight: "1.2",
	},
	heroSubtext: {
		color: SLATE_500,
		fontSize: "15px",
		lineHeight: "1.6",
		margin: "0",
		textAlign: "center" as const,
	},
	hrBrand: {
		borderColor: BRAND,
		borderWidth: "2px",
		margin: "24px 40px",
		opacity: 0.3,
	},
	anchorCard: {
		backgroundColor: SLATE_50,
		borderRadius: "8px",
		padding: "20px",
		marginBottom: "12px",
		borderLeft: `4px solid ${BRAND}`,
	},
	anchorLabel: {
		color: SLATE_500,
		fontSize: "13px",
		fontWeight: "600" as const,
		textTransform: "uppercase" as const,
		letterSpacing: "0.5px",
		margin: "0 0 6px",
	},
	anchorValue: {
		color: SLATE_900,
		fontSize: "32px",
		fontWeight: "bold" as const,
		margin: "0 0 8px",
		lineHeight: "1.1",
	},
	anchorExplanation: {
		color: SLATE_700,
		fontSize: "13px",
		lineHeight: "1.5",
		margin: "0",
	},
	pipelineSection: {
		backgroundColor: BRAND_LIGHT,
		borderRadius: "8px",
		padding: "20px 12px",
		marginTop: "8px",
	},
	pipelineSectionTitle: {
		color: SLATE_900,
		fontSize: "14px",
		fontWeight: "bold" as const,
		textAlign: "center" as const,
		margin: "0 0 16px",
		textTransform: "uppercase" as const,
		letterSpacing: "0.5px",
	},
	pipelineColumn: {
		textAlign: "center" as const,
		width: "33.33%",
	},
	pipelineValue: {
		color: BRAND,
		fontSize: "28px",
		fontWeight: "bold" as const,
		margin: "0 0 4px",
		lineHeight: "1.1",
	},
	pipelineLabel: {
		color: SLATE_700,
		fontSize: "11px",
		margin: "0",
		lineHeight: "1.3",
	},
	hr: {
		borderColor: SLATE_200,
		margin: "24px 0",
	},
	alertsHeading: {
		color: SLATE_900,
		fontSize: "18px",
		fontWeight: "bold" as const,
		margin: "0 0 12px",
	},
	alertCard: {
		backgroundColor: "#fffbeb",
		borderRadius: "6px",
		padding: "12px 16px",
		marginBottom: "8px",
		borderLeft: "3px solid #f59e0b",
	},
	alertTitle: {
		color: "#92400e",
		fontSize: "14px",
		fontWeight: "bold" as const,
		margin: "0 0 4px",
	},
	alertBody: {
		color: SLATE_700,
		fontSize: "13px",
		lineHeight: "1.5",
		margin: "0",
	},
	disclaimer: {
		color: SLATE_500,
		fontSize: "11px",
		lineHeight: "1.6",
		textAlign: "center" as const,
	},
	footer: {
		maxWidth: "600px",
		margin: "0 auto",
		padding: "16px 24px",
		backgroundColor: SLATE_900,
		borderRadius: "0 0 8px 8px",
		textAlign: "center" as const,
	},
	footerText: {
		color: SLATE_500,
		fontSize: "12px",
		margin: "0",
	},
};
