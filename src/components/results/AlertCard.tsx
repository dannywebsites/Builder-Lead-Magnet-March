import type { Alert } from "@/lib/calculator/alerts";

interface AlertCardProps {
	alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
	return (
		<div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
			<div className="flex items-start gap-3">
				<svg
					className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
						clipRule="evenodd"
					/>
				</svg>
				<div>
					<p className="text-sm font-semibold text-amber-800">
						{alert.title}
					</p>
					<p className="mt-1 text-sm text-amber-700">{alert.body}</p>
				</div>
			</div>
		</div>
	);
}
