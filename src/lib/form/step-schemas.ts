import * as z from "zod/v4";
import {
	CurrencySchema,
	EntityTypeSchema,
	VatRateSchema,
} from "@/lib/calculator";

export const Step1Schema = z.object({
	entityType: EntityTypeSchema,
	currency: CurrencySchema,
	vatRate: VatRateSchema,
});

export const Step2Schema = z.object({
	grossPersonalDraw: z.number().positive("Enter your monthly take-home target"),
	fixedCostVehicle: z.number().nonnegative("Cannot be negative"),
	fixedCostPremises: z.number().nonnegative("Cannot be negative"),
	fixedCostEquipment: z.number().nonnegative("Cannot be negative"),
	fixedCostInsurance: z.number().nonnegative("Cannot be negative"),
	fixedCostTechnology: z.number().nonnegative("Cannot be negative"),
	fixedCostLoans: z.number().nonnegative("Cannot be negative"),
	fixedCostProfessional: z.number().nonnegative("Cannot be negative"),
	fixedCostOther: z.number().nonnegative("Cannot be negative"),
	fixedOverheads: z.number().nonnegative("Fixed costs cannot be negative"),
});

export const Step3Schema = z.object({
	staffCount: z
		.number()
		.int("Enter a whole number (0 if you work solo)")
		.nonnegative("Enter a whole number (0 if you work solo)"),
	staffHourlyRate: z.number().nonnegative("Rate cannot be negative"),
	staffHoursPerWeek: z
		.number()
		.nonnegative("Hours cannot be negative")
		.max(168, "Maximum 168 hours per week"),
	ownerHoursPerWeek: z
		.number()
		.nonnegative("Hours cannot be negative")
		.max(168, "Maximum 168 hours per week"),
});

export const Step4Schema = z.object({
	avgJobValue: z.number().positive("Enter your average job value"),
	directCostPctDisplay: z
		.number()
		.min(0, "Cannot be negative")
		.max(80, "Direct costs cannot exceed 80% -- this protects your margin"),
});

export const STEP_SCHEMAS = [
	Step1Schema,
	Step2Schema,
	Step3Schema,
	Step4Schema,
] as const;

export type FormValues = z.infer<typeof Step1Schema> &
	z.infer<typeof Step2Schema> &
	z.infer<typeof Step3Schema> &
	z.infer<typeof Step4Schema>;
