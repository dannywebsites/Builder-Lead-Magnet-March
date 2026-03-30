import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";
import { formatCurrency } from "@/lib/calculator/currency";

interface CalculationBreakdownProps {
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
		<div
			className={`flex justify-between items-baseline py-2 ${highlight ? "border-t border-slate-200 mt-1 pt-3" : ""}`}
		>
			<span
				className={`text-sm ${highlight ? "font-semibold text-slate-900" : "text-slate-600"}`}
			>
				{label}
			</span>
			<span
				className={`text-sm font-semibold tabular-nums ${highlight ? "text-[var(--brand)]" : "text-slate-900"}`}
			>
				{value}
			</span>
		</div>
	);
}

export function CalculationBreakdown({
	input,
	output,
	currency,
}: CalculationBreakdownProps) {
	const fmt = (n: number) => formatCurrency(n, currency);
	const fmtDec = (n: number) =>
		formatCurrency(n, currency, { decimals: 2 });
	const isLtd = input.entityType === "limited_company";
	const hasStaff = input.staffCount > 0;
	const hasVat = input.vatRate > 0;
	const marginPct = (output.marginAfterMaterials * 100).toFixed(1);

	return (
		<details open className="mt-10">
			<summary className="cursor-pointer text-base font-bold text-slate-900 select-none flex items-center gap-2 group">
				<svg className="h-4 w-4 text-[var(--brand)] transition-transform group-open:rotate-90" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
				Your Numbers, Step by Step
			</summary>
			<div className="mt-3 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-md">
				<p className="text-sm text-slate-500 mb-5">
					Here is exactly how we got from your inputs to your numbers. No
					hidden math.
				</p>

				{/* Section 1: What you need to earn */}
				<div className="mb-5">
					<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
						What you need to earn
					</p>
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
				</div>

				{/* Section 2: Your costs */}
				<div className="mb-5">
					<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
						Your monthly costs
					</p>
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
				</div>

				{/* Section 3: Revenue target */}
				<div className="mb-5">
					<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
						Revenue you need to generate
					</p>
					<Row
						label={`Earnings + costs to cover`}
						value={fmt(output.targetBusinessProfit + output.adjustedOverheads)}
					/>
					<Row
						label={`Your direct costs eat ${(input.directCostPct * 100).toFixed(0)}% of every job (+ 15% slippage buffer)`}
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
				</div>

				{/* Section 4: What you invoice and charge */}
				<div>
					<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
						What you invoice and charge
					</p>
					{hasVat && (
						<Row
							label={`+ VAT at ${(input.vatRate * 100).toFixed(0)}%`}
							value={fmt(output.monthlyBillings - output.monthlyRevenueTarget)}
						/>
					)}
					<Row
						label={hasVat ? "= Monthly billings (inc. VAT)" : "= Monthly billings (VAT exempt)"}
						value={`${fmt(output.monthlyBillings)}/mo`}
						highlight
					/>
					{output.totalBillableHours > 0 && (
						<>
							<Row
								label={`${output.totalBillableHours.toFixed(1)} billable hours/month (75% efficiency cap applied)`}
								value=""
							/>
							<Row
								label="= Hourly floor rate"
								value={`${fmtDec(output.hourlyFloorRate)}/hr`}
								highlight
							/>
						</>
					)}
				</div>
			</div>
		</details>
	);
}
