import { describe, expect, it } from "vitest";
import { calculate } from "@/lib/calculator";
import type { CalculatorInput, VatRateValue } from "@/lib/calculator";
import type { FormValues } from "../step-schemas";
import { transformToCalculatorInput } from "../transform";

const validFormValues: FormValues = {
	entityType: "limited_company",
	currency: "GBP",
	vatRate: "0.20",
	grossPersonalDraw: 4000,
	fixedCostVehicle: 500,
	fixedCostPremises: 400,
	fixedCostEquipment: 200,
	fixedCostInsurance: 300,
	fixedCostTechnology: 100,
	fixedCostLoans: 200,
	fixedCostProfessional: 150,
	fixedCostOther: 150,
	fixedOverheads: 2000,
	staffCount: 2,
	staffHourlyRate: 15,
	staffHoursPerWeek: 40,
	ownerHoursPerWeek: 40,
	avgJobValue: 3000,
	directCostPctDisplay: 35,
};

describe("transformToCalculatorInput", () => {
	it('converts vatRate string "0.20" to number 0.2', () => {
		const result = transformToCalculatorInput(validFormValues);
		expect(result.vatRate).toBe(0.2);
	});

	it('converts vatRate string "0.135" to number 0.135', () => {
		const result = transformToCalculatorInput({
			...validFormValues,
			vatRate: "0.135",
		});
		expect(result.vatRate).toBe(0.135);
	});

	it('converts vatRate string "0" to number 0', () => {
		const result = transformToCalculatorInput({
			...validFormValues,
			vatRate: "0",
		});
		expect(result.vatRate).toBe(0);
	});

	it("converts directCostPctDisplay 35 to directCostPct 0.35", () => {
		const result = transformToCalculatorInput(validFormValues);
		expect(result.directCostPct).toBe(0.35);
	});

	it("converts directCostPctDisplay 80 to directCostPct 0.8", () => {
		const result = transformToCalculatorInput({
			...validFormValues,
			directCostPctDisplay: 80,
		});
		expect(result.directCostPct).toBe(0.8);
	});

	it("converts directCostPctDisplay 0 to directCostPct 0", () => {
		const result = transformToCalculatorInput({
			...validFormValues,
			directCostPctDisplay: 0,
		});
		expect(result.directCostPct).toBe(0);
	});

	it("output satisfies CalculatorInput type (vatRate is VatRateValue, not string)", () => {
		const result = transformToCalculatorInput(validFormValues);
		// Type assertion: this line would fail to compile if result doesn't match CalculatorInput
		const _typed: CalculatorInput = result;
		const _vatRate: VatRateValue = result.vatRate;
		expect(typeof result.vatRate).toBe("number");
		expect(result).not.toHaveProperty("directCostPctDisplay");
	});

	it("full round-trip: transform output can be passed to calculate() without errors", () => {
		const input = transformToCalculatorInput(validFormValues);
		const result = calculate(input);
		expect(result).toBeDefined();
		expect(result.monthlyRevenueTarget).toBeGreaterThan(0);
	});
});
