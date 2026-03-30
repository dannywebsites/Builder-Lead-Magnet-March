import type { FormValues } from "./step-schemas";

export const FORM_DEFAULTS: FormValues = {
	entityType: "limited_company",
	currency: "GBP",
	vatRate: "0.20",
	grossPersonalDraw: 0,
	fixedCostVehicle: 0,
	fixedCostPremises: 0,
	fixedCostEquipment: 0,
	fixedCostInsurance: 0,
	fixedCostTechnology: 0,
	fixedCostLoans: 0,
	fixedCostProfessional: 0,
	fixedCostOther: 0,
	fixedOverheads: 0,
	staffCount: 0,
	staffHourlyRate: 0,
	staffHoursPerWeek: 0,
	ownerHoursPerWeek: 40,
	avgJobValue: 0,
	directCostPctDisplay: 0,
};
