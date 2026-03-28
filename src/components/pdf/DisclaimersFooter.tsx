import { View, Text } from "@react-pdf/renderer";
import { reportStyles } from "./report-styles";

export function DisclaimersFooter() {
	return (
		<View style={reportStyles.footer}>
			<Text style={reportStyles.sectionTitle}>Notes and Disclaimers</Text>

			<Text style={reportStyles.disclaimer}>
				* The 30% employer burden is a conservative buffer covering employer
				NICs, pension contributions, and employment overheads. Actual costs vary
				by jurisdiction and benefit structure.
			</Text>

			<Text style={reportStyles.disclaimer}>
				* The Corp Tax buffer (20%) is applied to Limited Company figures only.
				This is not a precise tax calculation -- it protects against the common
				mistake of spending pre-tax profits.
			</Text>

			<Text style={reportStyles.disclaimer}>
				* Billable hours are capped at 75% of contracted hours. This accounts
				for travel, admin, callbacks, weather delays, and other non-billable
				time.
			</Text>

			<Text style={reportStyles.disclaimer}>
				* A 15% slippage factor is applied to direct costs to protect against
				underquoting materials, fuel price increases, and disposal cost
				surprises.
			</Text>

			<Text style={reportStyles.disclaimer}>
				* Win rate (30%) and lead-to-quote rate (30%) are conservative industry
				averages. Your actual rates may differ.
			</Text>

			<Text style={reportStyles.footerGeneral}>
				These figures use conservative buffers, not precise statutory rates.
				Always consult a qualified accountant.
			</Text>
		</View>
	);
}
