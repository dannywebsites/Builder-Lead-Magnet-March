import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
	calculate,
	calculateBillableHours,
	calculateMRT,
	calculateSlippage,
	calculateStaffCost,
	calculateTaxBuffer,
} from "@/lib/calculator/engine";
import type { CalculatorInput } from "@/lib/calculator/types";

describe("calculateTaxBuffer", () => {
	it("returns grossDraw / 0.80 for limited_company", () => {
		expect(calculateTaxBuffer("limited_company", 4000)).toBe(5000);
	});

	it("returns grossDraw unchanged for sole_trader", () => {
		expect(calculateTaxBuffer("sole_trader", 4000)).toBe(4000);
	});

	it("returns 0 for limited_company with grossDraw=0", () => {
		expect(calculateTaxBuffer("limited_company", 0)).toBe(0);
	});
});

describe("calculateStaffCost", () => {
	it("calculates staff cost for 2 staff at 15/hr, 40hrs/week", () => {
		const result = calculateStaffCost(2, 15, 40);
		// totalMonthlyHours = 2 * 40 * 4.33 = 346.4
		expect(result.totalMonthlyHours).toBe(346.4);
		// basePayroll = 346.4 * 15 = 5196
		expect(result.basePayroll).toBe(5196);
		// adjustedPayroll = 5196 * 1.30 = 6754.8
		expect(result.adjustedPayroll).toBe(6754.8);
	});

	it("returns zeros for staffCount=0", () => {
		const result = calculateStaffCost(0, 15, 40);
		expect(result.totalMonthlyHours).toBe(0);
		expect(result.basePayroll).toBe(0);
		expect(result.adjustedPayroll).toBe(0);
	});
});

describe("calculateBillableHours", () => {
	it("applies 75% efficiency cap to monthly hours", () => {
		// 346.4 * 0.75 = 259.8 (may have floating point drift)
		expect(calculateBillableHours(346.4)).toBeCloseTo(259.8, 10);
	});

	it("returns 0 for 0 monthly hours", () => {
		expect(calculateBillableHours(0)).toBe(0);
	});
});

describe("calculateSlippage", () => {
	it("applies 15% slippage factor to direct cost percentage", () => {
		// 0.25 * 1.15 = 0.2875
		expect(calculateSlippage(0.25)).toBe(0.2875);
	});

	it("handles max direct cost percentage of 0.80", () => {
		// 0.80 * 1.15 = 0.92
		expect(calculateSlippage(0.8)).toBeCloseTo(0.92, 10);
	});
});

describe("calculateMRT", () => {
	it("calculates MRT from profit, overheads, and real direct cost", () => {
		// (5000 + 8254.8) / (1 - 0.2875) = 13254.8 / 0.7125 = 18603.228070...
		const result = calculateMRT(5000, 8254.8, 0.2875);
		expect(result).toBeCloseTo(18603.228070175435, 4);
	});
});

describe("calculate", () => {
	const ltdInput: CalculatorInput = {
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

	it("produces correct output for Ltd company full scenario", () => {
		const result = calculate(ltdInput);

		// targetBusinessProfit = 4000 / 0.80 = 5000
		expect(result.targetBusinessProfit).toBe(5000);

		// adjustedPayroll = 2 * 40 * 4.33 * 15 * 1.30 = 6754.80
		expect(result.adjustedPayroll).toBe(6754.8);

		// adjustedOverheads = 1500 + 6754.80 = 8254.80
		expect(result.adjustedOverheads).toBe(8254.8);

		// totalBillableHours = roundCurrency(346.4 * 0.75) = roundCurrency(259.7999...) = 259.8
		expect(result.totalBillableHours).toBe(259.8);

		// realDirectCost = 0.25 * 1.15 = 0.2875
		expect(result.realDirectCost).toBeCloseTo(0.2875, 10);

		// MRT = (5000 + 8254.8) / (1 - 0.2875) = 13254.8 / 0.7125 = 18603.228070...
		// roundCurrency(18603.228070...) = 18603.23
		expect(result.monthlyRevenueTarget).toBe(18603.23);

		// monthlyBillings = roundCurrency(18603.228070... * 1.20) = roundCurrency(22323.873684...) = 22323.87
		expect(result.monthlyBillings).toBe(22323.87);

		// hourlyFloorRate = roundCurrency(18603.578947... / 259.8) = roundCurrency(71.607...) = 71.61
		expect(result.hourlyFloorRate).toBe(71.61);

		// Pipeline uses unrounded MRT:
		// jobsToWinRaw = 18603.578947... / 2500 = 7.44143...
		// jobsToWin = Math.ceil(7.44143...) = 8
		expect(result.jobsToWin).toBe(8);

		// quotesNeededRaw = 7.44143... / 0.30 = 24.8047...
		// quotesNeeded = Math.ceil(24.8047...) = 25
		expect(result.quotesNeeded).toBe(25);

		// leadsNeededRaw = 24.8047... / 0.30 = 82.6825...
		// leadsNeeded = Math.ceil(82.6825...) = 83
		expect(result.leadsNeeded).toBe(83);
	});

	it("produces correct MRT for sole trader scenario", () => {
		const soleTraderInput: CalculatorInput = {
			...ltdInput,
			entityType: "sole_trader",
		};
		const result = calculate(soleTraderInput);

		// targetBusinessProfit = 4000 (pass-through)
		expect(result.targetBusinessProfit).toBe(4000);

		// MRT = (4000 + 8254.8) / (1 - 0.2875) = 12254.8 / 0.7125 = 17199.719298...
		// roundCurrency = 17199.72
		expect(result.monthlyRevenueTarget).toBe(17199.72);
	});

	it("handles zero-staff scenario correctly", () => {
		const zeroStaffInput: CalculatorInput = {
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
		const result = calculate(zeroStaffInput);

		expect(result.adjustedPayroll).toBe(0);
		expect(result.totalBillableHours).toBe(0);
		expect(result.hourlyFloorRate).toBe(0);

		// MRT = (3000 + 500) / (1 - 0.345) = 3500 / 0.655 = 5343.511450...
		// roundCurrency = 5343.51
		expect(result.monthlyRevenueTarget).toBe(5343.51);

		// monthlyBillings = roundCurrency(5343.511450... * 1.20) = roundCurrency(6412.21374...) = 6412.21
		expect(result.monthlyBillings).toBe(6412.21);

		// jobsToWinRaw = 5343.511450... / 1000 = 5.34351...
		expect(result.jobsToWin).toBe(6);

		// quotesNeededRaw = 5.34351... / 0.30 = 17.8117...
		expect(result.quotesNeeded).toBe(18);

		// leadsNeededRaw = 17.8117... / 0.30 = 59.3723...
		expect(result.leadsNeeded).toBe(60);
	});

	it("contains no async, fetch, or server imports in engine.ts source", () => {
		const enginePath = path.resolve(__dirname, "..", "engine.ts");
		const source = fs.readFileSync(enginePath, "utf-8");
		expect(source).not.toMatch(/\basync\b/);
		expect(source).not.toMatch(/\bfetch\b/);
		expect(source).not.toMatch(/\bserver\b/);
	});

	it("produces all finite numbers with no NaN or Infinity", () => {
		const result = calculate(ltdInput);
		for (const [_key, value] of Object.entries(result)) {
			expect(Number.isFinite(value)).toBe(true);
		}
	});

	it("produces all finite numbers for zero-staff scenario", () => {
		const zeroStaffInput: CalculatorInput = {
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
		const result = calculate(zeroStaffInput);
		for (const [_key, value] of Object.entries(result)) {
			expect(Number.isFinite(value)).toBe(true);
		}
	});

	it("calculates billable hours from ownerHoursPerWeek when staffCount=0", () => {
		const soloInput: CalculatorInput = {
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
			ownerHoursPerWeek: 40,
		};
		const result = calculate(soloInput);

		// ownerMonthlyHours = 40 * 4.33 = 173.2
		// totalBillableHours = 173.2 * 0.75 = 129.9
		expect(result.totalBillableHours).toBe(129.9);
		expect(result.hourlyFloorRate).toBeGreaterThan(0);

		// hourlyFloorRate = MRT / 129.9
		// MRT = 5343.51 (same as zero-staff test)
		expect(result.hourlyFloorRate).toBeCloseTo(5343.51 / 129.9, 1);
	});

	it("ignores ownerHoursPerWeek when staffCount > 0", () => {
		const inputWithOwnerHours: CalculatorInput = {
			...ltdInput,
			ownerHoursPerWeek: 40,
		};
		const result = calculate(inputWithOwnerHours);
		const resultWithout = calculate(ltdInput);

		// Should use staff hours, not owner hours
		expect(result.totalBillableHours).toBe(resultWithout.totalBillableHours);
	});

	it("emits correct breakdown intermediates", () => {
		const result = calculate(ltdInput);

		// taxBufferAmount = targetBusinessProfit - grossPersonalDraw = 5000 - 4000 = 1000
		expect(result.taxBufferAmount).toBe(1000);

		// basePayroll = 2 * 40 * 4.33 * 15 = 5196
		expect(result.basePayroll).toBe(5196);

		// employerBurdenAmount = adjustedPayroll - basePayroll = 6754.8 - 5196 = 1558.8
		expect(result.employerBurdenAmount).toBe(1558.8);

		// marginAfterMaterials = 1 - 0.2875 = 0.7125
		expect(result.marginAfterMaterials).toBeCloseTo(0.7125, 10);
	});

	it("emits zero taxBufferAmount for sole trader", () => {
		const soleTraderInput: CalculatorInput = {
			...ltdInput,
			entityType: "sole_trader",
		};
		const result = calculate(soleTraderInput);
		expect(result.taxBufferAmount).toBe(0);
	});
});
