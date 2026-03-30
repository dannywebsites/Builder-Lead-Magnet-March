import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock resend before importing route
// Vitest 4.x requires function/class for constructors (arrow functions cannot be used with `new`)
vi.mock("resend", () => {
	const mockSend = vi
		.fn()
		.mockResolvedValue({ data: { id: "test" }, error: null });
	const mockCreate = vi
		.fn()
		.mockResolvedValue({ data: {}, error: null });
	return {
		Resend: vi.fn().mockImplementation(function () {
			return {
				emails: { send: mockSend },
				contacts: { create: mockCreate },
			};
		}),
	};
});

// Mock the email template
vi.mock("@/lib/email/templates/ResultsSummaryEmail", () => ({
	ResultsSummaryEmail: vi.fn().mockReturnValue("mock-email-html"),
}));

// Valid fixture matching strict Zod schemas
const validCalculatorInput = {
	entityType: "limited_company" as const,
	grossPersonalDraw: 3500,
	fixedOverheads: 1200,
	staffCount: 2,
	staffHourlyRate: 15,
	staffHoursPerWeek: 40,
	avgJobValue: 2500,
	directCostPct: 0.35,
	vatRate: 0.2 as const,
	currency: "GBP" as const,
	ownerHoursPerWeek: 45,
};

const validCalculatorOutput = {
	monthlyRevenueTarget: 12000,
	monthlyBillings: 14400,
	hourlyFloorRate: 45,
	jobsToWin: 5,
	quotesNeeded: 10,
	leadsNeeded: 20,
	targetBusinessProfit: 5000,
	adjustedPayroll: 3200,
	totalBillableHours: 160,
	realDirectCost: 4200,
	adjustedOverheads: 1440,
	taxBufferAmount: 2400,
	basePayroll: 2600,
	employerBurdenAmount: 600,
	marginAfterMaterials: 7800,
};

describe("POST /api/send-report", () => {
	beforeEach(() => {
		vi.stubEnv("RESEND_API_KEY", "re_test_key");
		vi.stubEnv("EMAIL_FROM", "Test <test@test.dev>");
	});

	it("returns 400 for missing email", async () => {
		// Import dynamically so mocks are in place
		const { POST } = await import("@/app/api/send-report/route");
		const request = new Request("http://localhost/api/send-report", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ consent: true }),
		});
		const response = await POST(request);
		expect(response.status).toBe(400);
	});

	it("returns 400 for consent=false", async () => {
		const { POST } = await import("@/app/api/send-report/route");
		const request = new Request("http://localhost/api/send-report", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "Test User",
				email: "test@example.com",
				consent: false,
				calculatorInput: validCalculatorInput,
				calculatorOutput: validCalculatorOutput,
				currency: "GBP",
				alerts: [],
			}),
		});
		const response = await POST(request);
		expect(response.status).toBe(400);
	});

	it("returns 200 with success:true for valid request", async () => {
		const { POST } = await import("@/app/api/send-report/route");
		const request = new Request("http://localhost/api/send-report", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "Test User",
				email: "test@example.com",
				consent: true,
				calculatorInput: validCalculatorInput,
				calculatorOutput: validCalculatorOutput,
				currency: "GBP",
				alerts: [],
			}),
		});
		const response = await POST(request);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.success).toBe(true);
	});
});
