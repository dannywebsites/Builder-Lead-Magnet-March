import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";
import { formatCurrency } from "@/lib/calculator/currency";
import { getOutputCopy, ZERO_STAFF_HOURLY_NOTE } from "@/lib/results/output-copy";
import { FinancialAnchorCard } from "@/components/results/FinancialAnchorCard";
import { PipelineMetric } from "@/components/results/PipelineMetric";
import { CalculationBreakdown } from "@/components/results/CalculationBreakdown";
import { AlertsSection } from "@/components/results/AlertsSection";
import { DownloadReportButton } from "@/components/results/DownloadReportButton";

interface ResultsViewProps {
	input: CalculatorInput;
	output: CalculatorOutput;
	currency: Currency;
	staffCount: number;
	alerts: Alert[];
	onEdit: () => void;
}

export function ResultsView({
	input,
	output,
	currency,
	staffCount,
	alerts,
	onEdit,
}: ResultsViewProps) {
	const copy = getOutputCopy(input, output, currency);

	return (
		<div className="max-w-3xl mx-auto px-4 py-12">
			{/* Section 1: Financial Anchors */}
			<div className="text-center mb-8">
				<p className="text-sm font-semibold uppercase tracking-widest text-[var(--brand)] mb-2">Your Results</p>
				<h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
					What Your Business Needs to Earn
				</h2>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<FinancialAnchorCard
					label={copy.monthlyRevenueTarget.label}
					value={formatCurrency(output.monthlyRevenueTarget, currency)}
					explanation={copy.monthlyRevenueTarget.explanation}
				/>
				<FinancialAnchorCard
					label={copy.monthlyBillings.label}
					value={formatCurrency(output.monthlyBillings, currency)}
					explanation={copy.monthlyBillings.explanation}
				/>
				<FinancialAnchorCard
					label={copy.hourlyFloorRate.label}
					value={formatCurrency(output.hourlyFloorRate, currency, { decimals: 2 })}
					explanation={copy.hourlyFloorRate.explanation}
					note={staffCount === 0 ? ZERO_STAFF_HOURLY_NOTE : undefined}
				/>
			</div>

			{/* Section 1.5: Calculation Breakdown */}
			<CalculationBreakdown input={input} output={output} currency={currency} />

			{/* Section: Important Notices */}
			<AlertsSection alerts={alerts} />

			{/* Section 2: Sales Pipeline */}
			<div className="text-center mt-14 mb-8">
				<p className="text-sm font-semibold uppercase tracking-widest text-[var(--brand)] mb-2">Pipeline</p>
				<h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
					Your Sales Marching Orders
				</h2>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<PipelineMetric
					label={copy.jobsToWin.label}
					value={output.jobsToWin}
					explanation={copy.jobsToWin.explanation}
				/>
				<PipelineMetric
					label={copy.quotesNeeded.label}
					value={output.quotesNeeded}
					explanation={copy.quotesNeeded.explanation}
				/>
				<PipelineMetric
					label={copy.leadsNeeded.label}
					value={output.leadsNeeded}
					explanation={copy.leadsNeeded.explanation}
				/>
			</div>

			{/* Section 3: Actions */}
			<div className="mt-12 flex flex-col items-center gap-3">
				<DownloadReportButton
					input={input}
					output={output}
					currency={currency}
					alerts={alerts}
				/>
				<button
					type="button"
					onClick={onEdit}
					className="px-6 py-3 rounded-xl text-base font-semibold min-h-[44px] text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors"
				>
					Edit Your Numbers
				</button>
			</div>
		</div>
	);
}
