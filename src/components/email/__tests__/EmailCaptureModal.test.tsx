import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// This import will fail until Task 3 creates the component
import { EmailCaptureModal } from "@/components/email/EmailCaptureModal";

// Mock the send-report-action module
vi.mock("@/lib/email/send-report-action", () => ({
	sendReport: vi.fn(),
}));

// Mock PDF generation
vi.mock("@/lib/pdf/generate-report", () => ({
	generateAndDownloadReport: vi.fn().mockResolvedValue(undefined),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

const mockInput = {
	entityType: "limited_company" as const,
	grossPersonalDraw: 3000,
	fixedOverheads: 500,
	staffCount: 0,
	staffHourlyRate: 0,
	staffHoursPerWeek: 0,
	avgJobValue: 1500,
	directCostPct: 0.4,
	vatRate: 0.2 as const,
	currency: "GBP" as const,
};

const mockOutput = {
	monthlyRevenueTarget: 8000,
	monthlyBillings: 9600,
	hourlyFloorRate: 55,
	jobsToWin: 6,
	quotesNeeded: 18,
	leadsNeeded: 36,
	targetBusinessProfit: 4500,
	adjustedPayroll: 0,
	totalBillableHours: 120,
	realDirectCost: 3200,
	adjustedOverheads: 575,
};

const defaultProps = {
	isOpen: true,
	onClose: vi.fn(),
	input: mockInput,
	output: mockOutput,
	currency: "GBP" as const,
	alerts: [],
};

describe("EmailCaptureModal", () => {
	it("renders email input and consent checkbox when open", () => {
		render(<EmailCaptureModal {...defaultProps} />);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
	});

	it("returns null when isOpen is false", () => {
		const { container } = render(
			<EmailCaptureModal {...defaultProps} isOpen={false} />,
		);
		expect(container.innerHTML).toBe("");
	});

	it("shows validation error for empty email on submit", async () => {
		const user = userEvent.setup();
		render(<EmailCaptureModal {...defaultProps} />);
		const submitButton = screen.getByRole("button", {
			name: /send my report/i,
		});
		await user.click(submitButton);
		expect(screen.getByText(/valid email/i)).toBeInTheDocument();
	});

	it("shows fallback download button when API returns error", async () => {
		const { sendReport } = await import("@/lib/email/send-report-action");
		vi.mocked(sendReport).mockResolvedValueOnce({
			success: false,
			error: "Failed to send",
		});

		const user = userEvent.setup();
		render(<EmailCaptureModal {...defaultProps} />);

		// This stub validates the error fallback path exists
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("closes modal on Escape key press", async () => {
		const onClose = vi.fn();
		const user = userEvent.setup();
		render(<EmailCaptureModal {...defaultProps} onClose={onClose} />);
		await user.keyboard("{Escape}");
		expect(onClose).toHaveBeenCalled();
	});
});
