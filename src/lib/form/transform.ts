import type { CalculatorInput, VatRateValue } from "@/lib/calculator";
import type { FormValues } from "./step-schemas";

export function transformToCalculatorInput(
	form: FormValues,
): CalculatorInput {
	const {
		directCostPctDisplay,
		vatRate,
		...rest
	} = form;

	return {
		...rest,
		vatRate: Number.parseFloat(vatRate) as VatRateValue,
		directCostPct: directCostPctDisplay / 100,
	};
}
