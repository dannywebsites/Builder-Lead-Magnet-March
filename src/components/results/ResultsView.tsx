import type { CalculatorOutput, Currency } from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";
import { formatCurrency } from "@/lib/calculator/currency";
import { OUTPUT_COPY, ZERO_STAFF_HOURLY_NOTE } from "@/lib/results/output-copy";
import { FinancialAnchorCard } from "@/components/results/FinancialAnchorCard";
import { PipelineMetric } from "@/components/results/PipelineMetric";
import { AlertsSection } from "@/components/results/AlertsSection";

interface ResultsViewProps {
	output: CalculatorOutput;
	currency: Currency;
	staffCount: number;
	alerts: Alert[];
	onEdit: () => void;
}

export function ResultsView({
	output,
	currency,
	staffCount,
	alerts,
	onEdit,
}: ResultsViewProps) {
	return (
		<div className="max-w-2xl mx-auto px-4 py-12">
			{/* Section 1: Financial Anchors */}
			<h2 className="text-2xl font-bold text-center mb-6">
				What Your Business Needs to Earn
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<FinancialAnchorCard
					label={OUTPUT_COPY.monthlyRevenueTarget.label}
					value={formatCurrency(output.monthlyRevenueTarget, currency)}
					explanation={OUTPUT_COPY.monthlyRevenueTarget.explanation}
				/>
				<FinancialAnchorCard
					label={OUTPUT_COPY.monthlyBillings.label}
					value={formatCurrency(output.monthlyBillings, currency)}
					explanation={OUTPUT_COPY.monthlyBillings.explanation}
				/>
				<FinancialAnchorCard
					label={OUTPUT_COPY.hourlyFloorRate.label}
					value={formatCurrency(output.hourlyFloorRate, currency, { decimals: 2 })}
					explanation={OUTPUT_COPY.hourlyFloorRate.explanation}
					note={staffCount === 0 ? ZERO_STAFF_HOURLY_NOTE : undefined}
				/>
			</div>

			{/* Section: Important Notices (between anchors and pipeline) */}
			<AlertsSection alerts={alerts} />

			{/* Section 2: Sales Pipeline */}
			<h2 className="text-2xl font-bold text-center mt-12 mb-6">
				Your Sales Marching Orders
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<PipelineMetric
					label={OUTPUT_COPY.jobsToWin.label}
					value={output.jobsToWin}
					explanation={OUTPUT_COPY.jobsToWin.explanation}
				/>
				<PipelineMetric
					label={OUTPUT_COPY.quotesNeeded.label}
					value={output.quotesNeeded}
					explanation={OUTPUT_COPY.quotesNeeded.explanation}
				/>
				<PipelineMetric
					label={OUTPUT_COPY.leadsNeeded.label}
					value={output.leadsNeeded}
					explanation={OUTPUT_COPY.leadsNeeded.explanation}
				/>
			</div>

			{/* Section 3: Edit button */}
			<div className="mt-10 text-center">
				<button
					type="button"
					onClick={onEdit}
					className="px-6 py-3 rounded-lg text-base font-semibold min-h-[44px] text-gray-600 hover:text-foreground border border-gray-300"
				>
					Edit Your Numbers
				</button>
			</div>
		</div>
	);
}
