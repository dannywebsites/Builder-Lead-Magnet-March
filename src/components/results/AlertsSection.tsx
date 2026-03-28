import type { Alert } from "@/lib/calculator/alerts";
import { AlertCard } from "./AlertCard";

interface AlertsSectionProps {
	alerts: Alert[];
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
	if (alerts.length === 0) return null;

	return (
		<div className="mt-12">
			<h2 className="text-2xl font-bold text-center mb-6">
				Important Notices
			</h2>
			<div className="grid grid-cols-1 gap-4">
				{alerts.map((alert) => (
					<AlertCard key={alert.key} alert={alert} />
				))}
			</div>
		</div>
	);
}
