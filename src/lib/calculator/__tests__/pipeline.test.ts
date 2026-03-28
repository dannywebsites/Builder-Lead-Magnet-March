import { describe, expect, it } from "vitest";
import { calculate } from "@/lib/calculator/engine";
import type { CalculatorInput, CalculatorOutput } from "@/lib/calculator/types";

/**
 * Helper: asserts every numeric field in the output is finite (no NaN, no Infinity).
 */
function assertAllFinite(output: CalculatorOutput): void {
	for (const [key, value] of Object.entries(output)) {
		expect(
			Number.isFinite(value),
			`Expected ${key} to be finite, got ${value}`,
		).toBe(true);
	}
}

// ---------- Fixtures ----------

const LTD_BASE: CalculatorInput = {
	entityType: "limited_company",
	grossPersonalDraw: 4000,
	fixedOverheads: 1500,
	staffCount: 2,
	staffHourlyRate: 15,
	staffHoursPerWeek: 40,
	avgJobValue: 2500,
	directCostPct: 0.25,
	vatRate: 0.2,
	currency: "GBP",
};

const ZERO_STAFF_SOLE: CalculatorInput = {
	entityType: "sole_trader",
	grossPersonalDraw: 3000,
	fixedOverheads: 500,
	staffCount: 0,
	staffHourlyRate: 0,
	staffHoursPerWeek: 0,
	avgJobValue: 1000,
	directCostPct: 0.3,
	vatRate: 0.2,
	currency: "GBP",
};

// ---------- Tests ----------

describe("sales pipeline calculations", () => {
	it("pipeline values are always whole numbers (Math.ceil)", () => {
		const result = calculate(LTD_BASE);
		expect(Number.isInteger(result.jobsToWin)).toBe(true);
		expect(Number.isInteger(result.quotesNeeded)).toBe(true);
		expect(Number.isInteger(result.leadsNeeded)).toBe(true);
	});

	it("pipeline scales with avgJobValue — smaller value means more jobs", () => {
		const smallJob = calculate({ ...LTD_BASE, avgJobValue: 1000 });
		const largeJob = calculate({ ...LTD_BASE, avgJobValue: 5000 });
		expect(smallJob.jobsToWin).toBeGreaterThan(largeJob.jobsToWin);
	});
});

describe("integration: Ltd company full scenario", () => {
	it("produces correct output for all 11 fields", () => {
		const result = calculate(LTD_BASE);

		// Hand-calculated values using engine formulas:
		// targetBusinessProfit = 4000 / 0.80 = 5000
		expect(result.targetBusinessProfit).toBe(5000);

		// adjustedPayroll = 2 * 40 * 4.33 * 15 * 1.30 = 6754.80
		expect(result.adjustedPayroll).toBe(6754.8);

		// adjustedOverheads = 1500 + 6754.80 = 8254.80
		expect(result.adjustedOverheads).toBe(8254.8);

		// totalBillableHours = 346.4 * 0.75 = 259.8
		expect(result.totalBillableHours).toBe(259.8);

		// realDirectCost = 0.25 * 1.15 = 0.2875
		expect(result.realDirectCost).toBeCloseTo(0.2875, 10);

		// MRT = (5000 + 8254.8) / (1 - 0.2875) = 13254.8 / 0.7125 = 18603.228070...
		expect(result.monthlyRevenueTarget).toBe(18603.23);

		// monthlyBillings = 18603.228070... * 1.20 = 22323.873684...
		expect(result.monthlyBillings).toBe(22323.87);

		// hourlyFloorRate = 18603.228070... / 259.8 = 71.6059...
		expect(result.hourlyFloorRate).toBe(71.61);

		// Pipeline (using unrounded MRT)
		expect(result.jobsToWin).toBe(8);
		expect(result.quotesNeeded).toBe(25);
		expect(result.leadsNeeded).toBe(83);

		assertAllFinite(result);
	});
});

describe("integration: Sole Trader full scenario", () => {
	it("sole trader gets pass-through profit (no corp tax buffer)", () => {
		const result = calculate({ ...LTD_BASE, entityType: "sole_trader" });

		// targetBusinessProfit = 4000 (pass-through, no / 0.80)
		expect(result.targetBusinessProfit).toBe(4000);

		// MRT = (4000 + 8254.8) / 0.7125 = 12254.8 / 0.7125 = 17199.719298...
		expect(result.monthlyRevenueTarget).toBe(17199.72);

		// Staff costs unchanged from Ltd
		expect(result.adjustedOverheads).toBe(8254.8);

		assertAllFinite(result);
	});
});

describe("integration: Zero staff edge cases", () => {
	it("sole trader with zero staff produces correct output", () => {
		const result = calculate(ZERO_STAFF_SOLE);

		expect(result.adjustedPayroll).toBe(0);
		expect(result.totalBillableHours).toBe(0);
		expect(result.hourlyFloorRate).toBe(0);

		// MRT = (3000 + 500) / (1 - 0.345) = 3500 / 0.655 = 5343.511450...
		expect(result.monthlyRevenueTarget).toBe(5343.51);

		assertAllFinite(result);
	});

	it("Ltd company with zero staff applies corp tax buffer", () => {
		const result = calculate({
			...ZERO_STAFF_SOLE,
			entityType: "limited_company",
		});

		// targetBusinessProfit = 3000 / 0.80 = 3750
		expect(result.targetBusinessProfit).toBe(3750);

		// MRT = (3750 + 500) / (1 - 0.345) = 4250 / 0.655 = 6488.549618...
		expect(result.monthlyRevenueTarget).toBe(6488.55);

		assertAllFinite(result);
	});
});

describe("integration: edge cases", () => {
	it("max directCostPct=0.80 produces positive MRT", () => {
		const input: CalculatorInput = {
			entityType: "sole_trader",
			grossPersonalDraw: 2000,
			fixedOverheads: 300,
			staffCount: 0,
			staffHourlyRate: 0,
			staffHoursPerWeek: 0,
			avgJobValue: 500,
			directCostPct: 0.8,
			vatRate: 0,
			currency: "GBP",
		};
		const result = calculate(input);

		// realDirectCost = 0.80 * 1.15 = 0.92
		// MRT = (2000 + 300) / (1 - 0.92) = 2300 / 0.08 = 28750
		expect(result.monthlyRevenueTarget).toBe(28750);
		expect(result.monthlyBillings).toBe(28750); // vatRate=0

		expect(result.monthlyRevenueTarget).toBeGreaterThan(0);
		assertAllFinite(result);
	});

	it("EUR currency does not affect calculation (display-only)", () => {
		const gbpResult = calculate(LTD_BASE);
		const eurResult = calculate({ ...LTD_BASE, currency: "EUR" });

		expect(gbpResult.monthlyRevenueTarget).toBe(eurResult.monthlyRevenueTarget);
		expect(gbpResult.monthlyBillings).toBe(eurResult.monthlyBillings);
		expect(gbpResult.hourlyFloorRate).toBe(eurResult.hourlyFloorRate);
		expect(gbpResult.jobsToWin).toBe(eurResult.jobsToWin);
		expect(gbpResult.quotesNeeded).toBe(eurResult.quotesNeeded);
		expect(gbpResult.leadsNeeded).toBe(eurResult.leadsNeeded);
		expect(gbpResult.targetBusinessProfit).toBe(eurResult.targetBusinessProfit);
		expect(gbpResult.adjustedPayroll).toBe(eurResult.adjustedPayroll);
		expect(gbpResult.totalBillableHours).toBe(eurResult.totalBillableHours);
		expect(gbpResult.realDirectCost).toBe(eurResult.realDirectCost);
		expect(gbpResult.adjustedOverheads).toBe(eurResult.adjustedOverheads);
	});

	it("VAT exempt (vatRate=0) produces monthlyBillings equal to MRT", () => {
		const input: CalculatorInput = {
			...LTD_BASE,
			vatRate: 0,
		};
		const result = calculate(input);
		expect(result.monthlyBillings).toBe(result.monthlyRevenueTarget);
	});

	it("Irish 13.5% VAT rate produces correct monthlyBillings", () => {
		const input: CalculatorInput = {
			...LTD_BASE,
			vatRate: 0.135,
		};
		const result = calculate(input);

		// MRT is the same as Ltd base (same inputs except vatRate)
		expect(result.monthlyRevenueTarget).toBe(18603.23);

		// monthlyBillings = MRT_raw * 1.135
		// 18603.228070... * 1.135 = 21114.663839...
		// roundCurrency = 21114.66
		const expectedBillings = 21114.66;
		expect(result.monthlyBillings).toBe(expectedBillings);
	});

	it("all output numeric fields are finite across all scenarios", () => {
		const scenarios: CalculatorInput[] = [
			LTD_BASE,
			{ ...LTD_BASE, entityType: "sole_trader" },
			ZERO_STAFF_SOLE,
			{ ...ZERO_STAFF_SOLE, entityType: "limited_company" },
			{ ...LTD_BASE, directCostPct: 0.8, vatRate: 0, currency: "EUR" },
			{ ...LTD_BASE, vatRate: 0.135 },
			{ ...LTD_BASE, vatRate: 0.23 },
		];

		for (const input of scenarios) {
			const result = calculate(input);
			assertAllFinite(result);
		}
	});
});
