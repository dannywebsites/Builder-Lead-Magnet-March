import * as z from "zod/v4";

export const EntityTypeSchema = z.enum(["limited_company", "sole_trader"]);

export const VatRateSchema = z.enum(["0", "0.135", "0.20", "0.23"]);

export const CurrencySchema = z.enum(["GBP", "EUR"]);

export const CalculatorInputSchema = z.object({
	entityType: EntityTypeSchema,
	grossPersonalDraw: z.number().positive(),
	fixedOverheads: z.number().nonnegative(),
	staffCount: z.number().int().nonnegative(),
	staffHourlyRate: z.number().nonnegative(),
	staffHoursPerWeek: z.number().nonnegative().max(168),
	avgJobValue: z.number().positive(),
	directCostPct: z.number().min(0).max(0.8),
	vatRate: VatRateSchema,
	currency: CurrencySchema,
	ownerHoursPerWeek: z.number().nonnegative().max(168).optional(),
});

export type ValidatedCalculatorInput = z.infer<typeof CalculatorInputSchema>;
