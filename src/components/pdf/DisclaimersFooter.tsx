import { View, Text } from "@react-pdf/renderer";
import { reportStyles } from "./report-styles";

export function DisclaimersFooter() {
	return (
		<View style={reportStyles.footer}>
			<Text style={reportStyles.sectionTitle}>Important Notes</Text>

			<Text style={reportStyles.disclaimer}>
				All buffers used in this report (20% Corporation Tax, 30% employer
				burden, 75% billable efficiency cap, 15% material slippage, 30% win
				rate, 30% lead-to-quote rate) are conservative estimates designed to
				protect your margin. Actual rates vary by jurisdiction and business.
			</Text>

			<Text style={reportStyles.disclaimer}>
				Win rate and lead-to-quote rate are industry averages. Your actual
				conversion rates may differ -- adjust your pipeline targets accordingly.
			</Text>

			<Text style={reportStyles.footerGeneral}>
				These figures use conservative buffers, not precise statutory rates.
				Always consult a qualified accountant for tax and compliance matters.
			</Text>
		</View>
	);
}
