import { formatCurrency } from "@/lib/calculator/currency";
import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";

type OutputCopyEntry = {
	readonly label: string;
	readonly explanation: string;
};

export const OUTPUT_COPY = {
	monthlyRevenueTarget: {
		label: "Monthly Revenue Goal (Net)",
		explanation:
			"This is the minimum your business needs to bring in each month before VAT. It covers your personal draw, staff costs, overheads, and a buffer for the unexpected. Every pound below this number means you are eating into your own pay.",
	},
	monthlyBillings: {
		label: "Monthly Billings (Gross)",
		explanation:
			"This is the total you need to invoice each month, including VAT. This is the number that needs to land in your bank account before you start paying bills.",
	},
	hourlyFloorRate: {
		label: "Hourly Floor Rate",
		explanation:
			"The absolute minimum you should charge per hour to cover all your costs and pay yourself what you need. Charge less than this and you are working at a loss, even if your diary is full.",
	},
	jobsToWin: {
		label: "Jobs to Win",
		explanation:
			"Based on your average job value, this is how many jobs you need to complete each month to hit your revenue goal. Not quotes sent -- actual jobs won and delivered.",
	},
	quotesNeeded: {
		label: "Quotes to Send",
		explanation:
			"Assuming roughly 1 in 3 quotes converts to a won job, this is how many quotes you need to get out the door each month. If your win rate is better than 30%, you will need fewer.",
	},
	leadsNeeded: {
		label: "Leads to Generate",
		explanation:
			"Working backward from quotes, and assuming about 1 in 3 enquiries turn into a quote opportunity, this is the total number of leads or enquiries you need coming in each month to keep the pipeline full.",
	},
} as const satisfies Record<string, OutputCopyEntry>;

export function getOutputCopy(
	input: CalculatorInput,
	output: CalculatorOutput,
	currency: Currency,
): Record<string, OutputCopyEntry> {
	const fmt = (n: number) => formatCurrency(n, currency);
	const marginPct = (output.marginAfterMaterials * 100).toFixed(0);

	return {
		monthlyRevenueTarget: {
			label: "Monthly Revenue Goal (Net)",
			explanation: `Your ${fmt(input.grossPersonalDraw)} take-home plus ${fmt(output.adjustedOverheads)} in costs, divided by your ${marginPct}% margin after materials. Every pound below this and you are eating into your own pay.`,
		},
		monthlyBillings: {
			label: "Monthly Billings (Gross)",
			explanation: `Your ${fmt(output.monthlyRevenueTarget)} revenue goal with ${(input.vatRate * 100).toFixed(0)}% VAT added on top. This is what you actually need to invoice each month.`,
		},
		hourlyFloorRate: {
			label: "Hourly Floor Rate",
			explanation:
				output.totalBillableHours > 0
					? `Your ${fmt(output.monthlyRevenueTarget)} revenue goal divided by ${output.totalBillableHours.toFixed(1)} billable hours per month. Charge less than this and you are working at a loss.`
					: "Cannot calculate without billable hours. Add your working hours or staff hours above.",
		},
		jobsToWin: {
			label: "Jobs to Win",
			explanation: `${fmt(output.monthlyRevenueTarget)} divided by your ${fmt(input.avgJobValue)} average job value. Not quotes sent -- actual jobs won and delivered.`,
		},
		quotesNeeded: {
			label: "Quotes to Send",
			explanation: `${output.jobsToWin} jobs divided by a 30% win rate. If your conversion is better than 1 in 3, you will need fewer quotes.`,
		},
		leadsNeeded: {
			label: "Leads to Generate",
			explanation: `${output.quotesNeeded} quotes divided by a 30% lead-to-quote rate. This is the total enquiries you need each month to keep the pipeline full.`,
		},
	};
}

export const ZERO_STAFF_HOURLY_NOTE =
	"Based on your own working hours with a 75% efficiency cap applied. This is the minimum you should charge per hour to cover all costs and pay yourself." as const;
