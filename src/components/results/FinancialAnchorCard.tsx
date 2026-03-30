interface FinancialAnchorCardProps {
	label: string;
	value: string;
	explanation: string;
	note?: string;
}

export function FinancialAnchorCard({
	label,
	value,
	explanation,
	note,
}: FinancialAnchorCardProps) {
	return (
		<div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
			<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
			<p className="mt-2 text-3xl font-bold text-slate-900 tabular-nums">{value}</p>
			<p className="mt-3 text-sm text-slate-500 leading-relaxed">{explanation}</p>
			{note && (
				<p className="mt-3 text-xs text-amber-600 italic">{note}</p>
			)}
		</div>
	);
}
