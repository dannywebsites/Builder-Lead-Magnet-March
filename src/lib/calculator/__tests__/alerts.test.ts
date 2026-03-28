import { describe, expect, it } from "vitest";
import { getTriggeredAlerts } from "@/lib/calculator/alerts";
import type { CalculatorInput, CalculatorOutput } from "@/lib/calculator/types";
import { ALERT_COPY } from "@/lib/results/alert-copy";

function makeInput(overrides: Partial<CalculatorInput> = {}): CalculatorInput {
	return {
		entityType: "limited_company",
		grossPersonalDraw: 4000,
		fixedOverheads: 500,
		staffCount: 0,
		staffHourlyRate: 0,
		staffHoursPerWeek: 0,
		avgJobValue: 5000,
		directCostPct: 0.3,
		vatRate: 0.2,
		currency: "GBP",
		...overrides,
	};
}

function makeOutput(): CalculatorOutput {
	return {
		monthlyRevenueTarget: 10000,
		monthlyBillings: 12000,
		hourlyFloorRate: 50,
		jobsToWin: 3,
		quotesNeeded: 10,
		leadsNeeded: 34,
		targetBusinessProfit: 5000,
		adjustedPayroll: 0,
		totalBillableHours: 160,
		realDirectCost: 0.3,
		adjustedOverheads: 500,
	};
}

describe("getTriggeredAlerts", () => {
	describe("gross-draw (ALRT-01)", () => {
		it("returns gross-draw alert for limited_company", () => {
			const alerts = getTriggeredAlerts(
				makeInput({ entityType: "limited_company" }),
				makeOutput(),
			);
			const grossDraw = alerts.find((a) => a.key === "gross-draw");
			expect(grossDraw).toBeDefined();
			expect(grossDraw?.title).toBe(ALERT_COPY["gross-draw"].title);
			expect(grossDraw?.body).toBe(ALERT_COPY["gross-draw"].body);
		});

		it("returns gross-draw alert for sole_trader", () => {
			const alerts = getTriggeredAlerts(
				makeInput({ entityType: "sole_trader" }),
				makeOutput(),
			);
			const grossDraw = alerts.find((a) => a.key === "gross-draw");
			expect(grossDraw).toBeDefined();
		});
	});

	describe("two-thirds-rule (ALRT-02)", () => {
		it("triggers when vatRate is 0.135 and directCostPct > 0.66", () => {
			const alerts = getTriggeredAlerts(
				makeInput({ vatRate: 0.135, directCostPct: 0.7 }),
				makeOutput(),
			);
			const twoThirds = alerts.find((a) => a.key === "two-thirds-rule");
			expect(twoThirds).toBeDefined();
			expect(twoThirds?.title).toBe(ALERT_COPY["two-thirds-rule"].title);
		});

		it("does NOT trigger at boundary directCostPct === 0.66", () => {
			const alerts = getTriggeredAlerts(
				makeInput({ vatRate: 0.135, directCostPct: 0.66 }),
				makeOutput(),
			);
			const twoThirds = alerts.find((a) => a.key === "two-thirds-rule");
			expect(twoThirds).toBeUndefined();
		});

		it("does NOT trigger when vatRate is not 0.135", () => {
			const alerts = getTriggeredAlerts(
				makeInput({ vatRate: 0.2, directCostPct: 0.7 }),
				makeOutput(),
			);
			const twoThirds = alerts.find((a) => a.key === "two-thirds-rule");
			expect(twoThirds).toBeUndefined();
		});
	});

	describe("efficiency-cap (ALRT-03)", () => {
		it("triggers when staffCount > 0", () => {
			const alerts = getTriggeredAlerts(
				makeInput({ staffCount: 2 }),
				makeOutput(),
			);
			const effCap = alerts.find((a) => a.key === "efficiency-cap");
			expect(effCap).toBeDefined();
			expect(effCap?.title).toBe(ALERT_COPY["efficiency-cap"].title);
		});

		it("does NOT trigger when staffCount is 0", () => {
			const alerts = getTriggeredAlerts(
				makeInput({ staffCount: 0 }),
				makeOutput(),
			);
			const effCap = alerts.find((a) => a.key === "efficiency-cap");
			expect(effCap).toBeUndefined();
		});
	});

	describe("cis-rct (ALRT-04)", () => {
		it("always returns cis-rct alert", () => {
			const alerts = getTriggeredAlerts(makeInput(), makeOutput());
			const cisRct = alerts.find((a) => a.key === "cis-rct");
			expect(cisRct).toBeDefined();
			expect(cisRct?.title).toBe(ALERT_COPY["cis-rct"].title);
			expect(cisRct?.body).toBe(ALERT_COPY["cis-rct"].body);
		});
	});

	describe("all alerts", () => {
		it("all returned alerts have non-empty title and body", () => {
			const alerts = getTriggeredAlerts(
				makeInput({
					vatRate: 0.135,
					directCostPct: 0.7,
					staffCount: 2,
				}),
				makeOutput(),
			);
			for (const alert of alerts) {
				expect(alert.title.length).toBeGreaterThan(0);
				expect(alert.body.length).toBeGreaterThan(0);
			}
		});

		it("returns exactly 4 alerts when all conditions are met", () => {
			const alerts = getTriggeredAlerts(
				makeInput({
					entityType: "limited_company",
					vatRate: 0.135,
					directCostPct: 0.7,
					staffCount: 2,
				}),
				makeOutput(),
			);
			expect(alerts).toHaveLength(4);
			const keys = alerts.map((a) => a.key);
			expect(keys).toContain("gross-draw");
			expect(keys).toContain("two-thirds-rule");
			expect(keys).toContain("efficiency-cap");
			expect(keys).toContain("cis-rct");
		});
	});
});
