import type { CalculatorInput, VatRateValue } from "@/lib/calculator";
import type { FormValues } from "./step-schemas";

export function transformToCalculatorInput(
	form: FormValues,
): CalculatorInput {
	const {
		directCostPctDisplay,
		vatRate,
		fixedCostVehicle,
		fixedCostPremises,
		fixedCostEquipment,
		fixedCostInsurance,
		fixedCostTechnology,
		fixedCostLoans,
		fixedCostProfessional,
		fixedCostOther,
		...rest
	} = form;

	return {
		...rest,
		vatRate: Number.parseFloat(vatRate) as VatRateValue,
		directCostPct: directCostPctDisplay / 100,
	};
}
