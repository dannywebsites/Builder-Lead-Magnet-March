import { describe, expect, it } from "vitest";
import {
	STEP_SCHEMAS,
	Step1Schema,
	Step2Schema,
	Step3Schema,
	Step4Schema,
} from "../step-schemas";

describe("Step1Schema", () => {
	it("accepts valid business setup fields", () => {
		const result = Step1Schema.safeParse({
			entityType: "limited_company",
			currency: "GBP",
			vatRate: "0.20",
		});
		expect(result.success).toBe(true);
	});

	it("rejects missing entityType", () => {
		const result = Step1Schema.safeParse({
			currency: "GBP",
			vatRate: "0.20",
		});
		expect(result.success).toBe(false);
	});

	it("rejects invalid vatRate value", () => {
		const result = Step1Schema.safeParse({
			entityType: "limited_company",
			currency: "GBP",
			vatRate: "0.50",
		});
		expect(result.success).toBe(false);
	});
});

describe("Step2Schema", () => {
	const validStep2 = {
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
	};

	it("accepts valid money fields", () => {
		const result = Step2Schema.safeParse(validStep2);
		expect(result.success).toBe(true);
	});

	it("rejects grossPersonalDraw of 0 (must be positive)", () => {
		const result = Step2Schema.safeParse({
			...validStep2,
			grossPersonalDraw: 0,
		});
		expect(result.success).toBe(false);
	});

	it("rejects negative fixedOverheads", () => {
		const result = Step2Schema.safeParse({
			...validStep2,
			fixedOverheads: -100,
		});
		expect(result.success).toBe(false);
	});

	it("rejects negative category values", () => {
		const result = Step2Schema.safeParse({
			...validStep2,
			fixedCostVehicle: -50,
		});
		expect(result.success).toBe(false);
	});
});

describe("Step3Schema", () => {
	it("accepts zero-staff case", () => {
		const result = Step3Schema.safeParse({
			staffCount: 0,
			staffHourlyRate: 0,
			staffHoursPerWeek: 0,
		});
		expect(result.success).toBe(true);
	});

	it("accepts valid staff fields", () => {
		const result = Step3Schema.safeParse({
			staffCount: 3,
			staffHourlyRate: 15,
			staffHoursPerWeek: 40,
		});
		expect(result.success).toBe(true);
	});

	it("rejects non-integer staffCount", () => {
		const result = Step3Schema.safeParse({
			staffCount: 1.5,
			staffHourlyRate: 15,
			staffHoursPerWeek: 40,
		});
		expect(result.success).toBe(false);
	});

	it("rejects staffHoursPerWeek over 168", () => {
		const result = Step3Schema.safeParse({
			staffCount: 1,
			staffHourlyRate: 15,
			staffHoursPerWeek: 200,
		});
		expect(result.success).toBe(false);
	});
});

describe("Step4Schema", () => {
	it("accepts valid pricing fields", () => {
		const result = Step4Schema.safeParse({
			avgJobValue: 3000,
			directCostPctDisplay: 35,
		});
		expect(result.success).toBe(true);
	});

	it("rejects avgJobValue of 0 (must be positive)", () => {
		const result = Step4Schema.safeParse({
			avgJobValue: 0,
			directCostPctDisplay: 35,
		});
		expect(result.success).toBe(false);
	});

	it("rejects directCostPctDisplay over 80", () => {
		const result = Step4Schema.safeParse({
			avgJobValue: 3000,
			directCostPctDisplay: 85,
		});
		expect(result.success).toBe(false);
	});

	it("rejects negative directCostPctDisplay", () => {
		const result = Step4Schema.safeParse({
			avgJobValue: 3000,
			directCostPctDisplay: -5,
		});
		expect(result.success).toBe(false);
	});
});

describe("STEP_SCHEMAS", () => {
	it("has length 4", () => {
		expect(STEP_SCHEMAS).toHaveLength(4);
	});
});
