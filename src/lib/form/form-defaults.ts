import type { FormValues } from "./step-schemas";

export const FORM_DEFAULTS: FormValues = {
	entityType: "limited_company",
	currency: "GBP",
	vatRate: "0.20",
	grossPersonalDraw: 0,
	fixedOverheads: 0,
	staffCount: 0,
	staffHourlyRate: 0,
	staffHoursPerWeek: 0,
	avgJobValue: 0,
	directCostPctDisplay: 0,
};
