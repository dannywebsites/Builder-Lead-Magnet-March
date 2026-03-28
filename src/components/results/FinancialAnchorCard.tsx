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
		<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<p className="text-sm font-semibold text-gray-600">{label}</p>
			<p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
			<p className="mt-2 text-sm text-gray-500">{explanation}</p>
			{note && (
				<p className="mt-2 text-xs text-amber-600 italic">{note}</p>
			)}
		</div>
	);
}
