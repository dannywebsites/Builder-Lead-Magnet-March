import { StyleSheet } from "@react-pdf/renderer";

export const reportStyles = StyleSheet.create({
	page: {
		padding: 40,
		fontFamily: "Helvetica",
		fontSize: 10,
		lineHeight: 1.5,
		color: "#1a1a1a",
	},
	header: {
		marginBottom: 20,
		borderBottomWidth: 2,
		borderBottomColor: "#2563eb",
		paddingBottom: 12,
	},
	title: {
		fontSize: 22,
		fontFamily: "Helvetica-Bold",
		color: "#1e3a5f",
	},
	subtitle: {
		fontSize: 10,
		color: "#6b7280",
		marginTop: 4,
	},
	sectionTitle: {
		fontSize: 14,
		fontFamily: "Helvetica-Bold",
		marginTop: 16,
		marginBottom: 8,
		color: "#1e3a5f",
	},
	metricRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderBottomColor: "#e5e7eb",
	},
	metricLabel: {
		fontSize: 10,
		fontFamily: "Helvetica-Bold",
		width: "45%",
	},
	metricValue: {
		fontSize: 12,
		fontFamily: "Helvetica-Bold",
		color: "#2563eb",
		width: "25%",
		textAlign: "right",
	},
	metricExplanation: {
		fontSize: 8,
		color: "#6b7280",
		marginTop: 2,
		width: "100%",
	},
	inputRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 3,
	},
	inputLabel: {
		fontSize: 9,
		color: "#6b7280",
	},
	inputValue: {
		fontSize: 9,
		fontFamily: "Helvetica-Bold",
	},
	alertBox: {
		backgroundColor: "#fef3c7",
		padding: 10,
		marginVertical: 4,
		borderLeftWidth: 3,
		borderLeftColor: "#f59e0b",
	},
	alertTitle: {
		fontSize: 10,
		fontFamily: "Helvetica-Bold",
		color: "#92400e",
	},
	alertBody: {
		fontSize: 9,
		color: "#78350f",
		marginTop: 4,
	},
	pipelineRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderBottomColor: "#e5e7eb",
	},
	pipelineLabel: {
		fontSize: 10,
		fontFamily: "Helvetica-Bold",
		width: "50%",
	},
	pipelineValue: {
		fontSize: 14,
		fontFamily: "Helvetica-Bold",
		color: "#1e3a5f",
		width: "20%",
		textAlign: "right",
	},
	pipelineExplanation: {
		fontSize: 8,
		color: "#6b7280",
		marginTop: 2,
		width: "100%",
	},
	disclaimer: {
		fontSize: 7,
		color: "#9ca3af",
		marginTop: 4,
		lineHeight: 1.4,
	},
	footer: {
		marginTop: 20,
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: "#e5e7eb",
	},
	footerGeneral: {
		fontSize: 8,
		fontFamily: "Helvetica-Bold",
		color: "#6b7280",
		marginTop: 8,
	},
	dateText: {
		fontSize: 8,
		color: "#9ca3af",
		textAlign: "right",
		marginTop: 12,
	},
});
