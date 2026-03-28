import { View, Text } from "@react-pdf/renderer";
import { reportStyles } from "./report-styles";
import type { Alert } from "@/lib/calculator/alerts";

interface AlertsSectionProps {
	alerts: Alert[];
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
	if (alerts.length === 0) {
		return null;
	}

	return (
		<View>
			<Text style={reportStyles.sectionTitle}>Important Notices</Text>
			{alerts.map((alert) => (
				<View key={alert.key} style={reportStyles.alertBox}>
					<Text style={reportStyles.alertTitle}>{alert.title}</Text>
					<Text style={reportStyles.alertBody}>{alert.body}</Text>
				</View>
			))}
		</View>
	);
}
