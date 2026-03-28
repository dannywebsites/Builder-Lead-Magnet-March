import * as z from "zod/v4";

// Client-side form schema (modal form)
export const emailCaptureSchema = z.object({
	email: z.email("Please enter a valid email address"),
	consent: z.literal(true, {
		error: "You must agree to receive your report by email",
	}),
});

export type EmailCaptureData = z.infer<typeof emailCaptureSchema>;

// Full API request schema (includes calculator data sent to /api/send-report)
export const sendReportRequestSchema = z.object({
	email: z.email(),
	consent: z.literal(true),
	calculatorInput: z.record(z.string(), z.unknown()),
	calculatorOutput: z.record(z.string(), z.unknown()),
	currency: z.enum(["GBP", "EUR"]),
	alerts: z.array(z.record(z.string(), z.unknown())),
});

export type SendReportRequest = z.infer<typeof sendReportRequestSchema>;
