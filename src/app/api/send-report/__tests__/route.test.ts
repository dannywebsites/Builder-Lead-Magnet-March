import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock resend before importing route
vi.mock("resend", () => {
	const mockSend = vi
		.fn()
		.mockResolvedValue({ data: { id: "test" }, error: null });
	const mockCreate = vi
		.fn()
		.mockResolvedValue({ data: {}, error: null });
	return {
		Resend: vi.fn().mockImplementation(() => ({
			emails: { send: mockSend },
			contacts: { create: mockCreate },
		})),
	};
});

// Mock the email template
vi.mock("@/lib/email/templates/ResultsSummaryEmail", () => ({
	ResultsSummaryEmail: vi.fn().mockReturnValue("mock-email-html"),
}));

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
				email: "test@example.com",
				consent: false,
				calculatorInput: {},
				calculatorOutput: {},
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
				email: "test@example.com",
				consent: true,
				calculatorInput: { entityType: "ltd" },
				calculatorOutput: { monthlyRevenueTarget: 8000 },
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
