import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	OUTPUT_COPY,
	ZERO_STAFF_HOURLY_NOTE,
} from "@/lib/results/output-copy";
import { ResultsView } from "@/components/results/ResultsView";
import type { CalculatorOutput, Currency } from "@/lib/calculator/types";

describe("output-copy constants", () => {
	it("has entries for all 6 headline output values", () => {
		const keys = Object.keys(OUTPUT_COPY);
		expect(keys).toContain("monthlyRevenueTarget");
		expect(keys).toContain("monthlyBillings");
		expect(keys).toContain("hourlyFloorRate");
		expect(keys).toContain("jobsToWin");
		expect(keys).toContain("quotesNeeded");
		expect(keys).toContain("leadsNeeded");
		expect(keys).toHaveLength(6);
	});

	it("every entry has a non-empty label and explanation", () => {
		for (const [key, entry] of Object.entries(OUTPUT_COPY)) {
			expect(entry.label, `${key}.label`).toBeTruthy();
			expect(entry.explanation, `${key}.explanation`).toBeTruthy();
			expect(entry.label.length, `${key}.label length`).toBeGreaterThan(5);
			expect(
				entry.explanation.length,
				`${key}.explanation length`,
			).toBeGreaterThan(20);
		}
	});

	it("zero-staff hourly note is defined", () => {
		expect(ZERO_STAFF_HOURLY_NOTE).toBeTruthy();
		expect(ZERO_STAFF_HOURLY_NOTE.length).toBeGreaterThan(10);
	});
});

const MOCK_OUTPUT: CalculatorOutput = {
	monthlyRevenueTarget: 8234,
	monthlyBillings: 9881,
	hourlyFloorRate: 25.34,
	jobsToWin: 12,
	quotesNeeded: 40,
	leadsNeeded: 134,
	targetBusinessProfit: 5000,
	adjustedPayroll: 2800,
	totalBillableHours: 325,
	realDirectCost: 0.4025,
	adjustedOverheads: 4800,
};

const defaultProps = {
	output: MOCK_OUTPUT,
	currency: "GBP" as Currency,
	staffCount: 2,
	alerts: [],
	onEdit: () => {},
};

describe("ResultsView", () => {
	it("renders monthly revenue target (OUT-01)", () => {
		render(<ResultsView {...defaultProps} />);
		expect(screen.getByText(/8,234/)).toBeTruthy();
		expect(screen.getByText("Monthly Revenue Goal (Net)")).toBeTruthy();
	});

	it("renders monthly billings (OUT-02)", () => {
		render(<ResultsView {...defaultProps} />);
		expect(screen.getByText(/9,881/)).toBeTruthy();
		expect(screen.getByText("Monthly Billings (Gross)")).toBeTruthy();
	});

	it("renders hourly floor rate with 2 decimals (OUT-03)", () => {
		render(<ResultsView {...defaultProps} />);
		expect(screen.getByText(/25\.34/)).toBeTruthy();
		expect(screen.getByText("Hourly Floor Rate")).toBeTruthy();
	});

	it("renders jobs to win as plain integer (OUT-04)", () => {
		render(<ResultsView {...defaultProps} />);
		expect(screen.getByText("12")).toBeTruthy();
		expect(screen.getByText("Jobs to Win")).toBeTruthy();
	});

	it("renders quotes needed as plain integer (OUT-05)", () => {
		render(<ResultsView {...defaultProps} />);
		expect(screen.getByText("40")).toBeTruthy();
		expect(screen.getByText("Quotes to Send")).toBeTruthy();
	});

	it("renders leads needed as plain integer (OUT-06)", () => {
		render(<ResultsView {...defaultProps} />);
		expect(screen.getByText("134")).toBeTruthy();
		expect(screen.getByText("Leads to Generate")).toBeTruthy();
	});

	it("shows explanation for every output value (OUT-07)", () => {
		render(<ResultsView {...defaultProps} />);
		expect(screen.getByText(/minimum your business needs/)).toBeTruthy();
		expect(screen.getByText(/needs to land in your bank/)).toBeTruthy();
		expect(screen.getByText(/absolute minimum you should charge/)).toBeTruthy();
		expect(screen.getByText(/how many jobs you need/)).toBeTruthy();
		expect(screen.getByText(/quotes you need to get out/)).toBeTruthy();
		expect(screen.getByText(/leads or enquiries you need/)).toBeTruthy();
	});

	it("shows zero-staff note when staffCount is 0 (D-10)", () => {
		render(<ResultsView {...defaultProps} staffCount={0} />);
		expect(screen.getByText(/Based on your hours only/)).toBeTruthy();
	});

	it("does not show zero-staff note when staffCount > 0", () => {
		render(<ResultsView {...defaultProps} staffCount={2} />);
		expect(screen.queryByText(/Based on your hours only/)).toBeNull();
	});

	it("renders Edit Your Numbers button (D-08)", () => {
		render(<ResultsView {...defaultProps} />);
		expect(screen.getByText("Edit Your Numbers")).toBeTruthy();
	});
});
