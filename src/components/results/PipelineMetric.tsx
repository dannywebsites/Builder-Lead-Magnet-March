interface PipelineMetricProps {
	label: string;
	value: number;
	explanation: string;
}

export function PipelineMetric({
	label,
	value,
	explanation,
}: PipelineMetricProps) {
	return (
		<div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-6">
			<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
			<p className="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
				{value.toLocaleString()}
			</p>
			<p className="mt-3 text-sm text-slate-500 leading-relaxed">{explanation}</p>
		</div>
	);
}
