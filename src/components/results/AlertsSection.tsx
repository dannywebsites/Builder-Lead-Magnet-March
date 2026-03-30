import type { Alert } from "@/lib/calculator/alerts";
import { AlertCard } from "./AlertCard";

interface AlertsSectionProps {
	alerts: Alert[];
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
	if (alerts.length === 0) return null;

	return (
		<div className="mt-12">
			<div className="text-center mb-6">
				<h2 className="text-xl font-bold text-slate-900">
					Important Notices
				</h2>
			</div>
			<div className="grid grid-cols-1 gap-4">
				{alerts.map((alert) => (
					<AlertCard key={alert.key} alert={alert} />
				))}
			</div>
		</div>
	);
}
