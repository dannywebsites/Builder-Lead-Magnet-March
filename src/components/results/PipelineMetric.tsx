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
		<div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
			<p className="text-sm font-semibold text-gray-600">{label}</p>
			<p className="mt-1 text-2xl font-bold text-foreground">
				{value.toLocaleString()}
			</p>
			<p className="mt-2 text-sm text-gray-500">{explanation}</p>
		</div>
	);
}
