import * as z from "zod/v4";

// Client-side form schema (modal form)
export const emailCaptureSchema = z.object({
	name: z.string().min(1, "Please enter your name"),
	email: z.email("Please enter a valid email address"),
	consent: z.literal(true, {
		error: "You must agree to receive your report by email",
	}),
});

export type EmailCaptureData = z.infer<typeof emailCaptureSchema>;

// Strict schemas matching CalculatorInput/CalculatorOutput/Alert types
const calculatorInputSchema = z.object({
	entityType: z.enum(["limited_company", "sole_trader"]),
	grossPersonalDraw: z.number().nonnegative(),
	fixedOverheads: z.number().nonnegative(),
	staffCount: z.number().int().nonnegative(),
	staffHourlyRate: z.number().nonnegative(),
	staffHoursPerWeek: z.number().nonnegative(),
	avgJobValue: z.number().positive(),
	directCostPct: z.number().min(0).max(0.8),
	vatRate: z.union([
		z.literal(0),
		z.literal(0.135),
		z.literal(0.2),
		z.literal(0.23),
	]),
	currency: z.enum(["GBP", "EUR"]),
	ownerHoursPerWeek: z.number().nonnegative().optional(),
});

const calculatorOutputSchema = z.object({
	monthlyRevenueTarget: z.number(),
	monthlyBillings: z.number(),
	hourlyFloorRate: z.number(),
	jobsToWin: z.number(),
	quotesNeeded: z.number(),
	leadsNeeded: z.number(),
	targetBusinessProfit: z.number(),
	adjustedPayroll: z.number(),
	totalBillableHours: z.number(),
	realDirectCost: z.number(),
	adjustedOverheads: z.number(),
	taxBufferAmount: z.number(),
	basePayroll: z.number(),
	employerBurdenAmount: z.number(),
	marginAfterMaterials: z.number(),
});

const alertSchema = z.object({
	key: z.enum(["gross-draw", "two-thirds-rule", "efficiency-cap", "cis-rct"]),
	title: z.string(),
	body: z.string(),
});

// Full API request schema (includes calculator data sent to /api/send-report)
export const sendReportRequestSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	consent: z.literal(true),
	calculatorInput: calculatorInputSchema,
	calculatorOutput: calculatorOutputSchema,
	currency: z.enum(["GBP", "EUR"]),
	alerts: z.array(alertSchema),
});

export type SendReportRequest = z.infer<typeof sendReportRequestSchema>;
