import { View, Text } from "@react-pdf/renderer";
import { reportStyles } from "./report-styles";

export function ReportHeader() {
	return (
		<View style={reportStyles.header}>
			<Text style={reportStyles.title}>Trade Survival Report</Text>
			<Text style={reportStyles.subtitle}>Your Financial Reality Check</Text>
		</View>
	);
}
