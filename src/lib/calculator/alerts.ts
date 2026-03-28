import type { CalculatorInput, CalculatorOutput } from "./types";
import { ALERT_COPY } from "../results/alert-copy";

export type AlertKey =
	| "gross-draw"
	| "two-thirds-rule"
	| "efficiency-cap"
	| "cis-rct";

export interface Alert {
	key: AlertKey;
	title: string;
	body: string;
}

export function getTriggeredAlerts(
	input: CalculatorInput,
	_output: CalculatorOutput,
): Alert[] {
	const alerts: Alert[] = [];

	// ALRT-01: Gross Draw Warning — always fires for both entity types
	alerts.push({
		key: "gross-draw",
		title: ALERT_COPY["gross-draw"].title,
		body: ALERT_COPY["gross-draw"].body,
	});

	// ALRT-02: Irish Two-Thirds Rule — vatRate === 0.135 AND directCostPct > 0.66
	if (input.vatRate === 0.135 && input.directCostPct > 0.66) {
		alerts.push({
			key: "two-thirds-rule",
			title: ALERT_COPY["two-thirds-rule"].title,
			body: ALERT_COPY["two-thirds-rule"].body,
		});
	}

	// ALRT-03: Efficiency Cap — when staffCount > 0
	if (input.staffCount > 0) {
		alerts.push({
			key: "efficiency-cap",
			title: ALERT_COPY["efficiency-cap"].title,
			body: ALERT_COPY["efficiency-cap"].body,
		});
	}

	// ALRT-04: CIS/RCT Warning — always fires
	alerts.push({
		key: "cis-rct",
		title: ALERT_COPY["cis-rct"].title,
		body: ALERT_COPY["cis-rct"].body,
	});

	return alerts;
}
