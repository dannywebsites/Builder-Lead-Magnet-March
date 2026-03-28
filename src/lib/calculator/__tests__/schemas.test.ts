import { describe, expect, it } from "vitest";
import {
	EntityTypeSchema,
	VatRateSchema,
	CurrencySchema,
	CalculatorInputSchema,
} from "@/lib/calculator/schemas";

describe("EntityTypeSchema", () => {
	it('accepts "limited_company"', () => {
		expect(EntityTypeSchema.parse("limited_company")).toBe("limited_company");
	});

	it('accepts "sole_trader"', () => {
		expect(EntityTypeSchema.parse("sole_trader")).toBe("sole_trader");
	});

	it('rejects "partnership"', () => {
		expect(() => EntityTypeSchema.parse("partnership")).toThrow();
	});

	it("rejects empty string", () => {
		expect(() => EntityTypeSchema.parse("")).toThrow();
	});
});

describe("VatRateSchema", () => {
	it('accepts "0"', () => {
		expect(VatRateSchema.parse("0")).toBe("0");
	});

	it('accepts "0.135"', () => {
		expect(VatRateSchema.parse("0.135")).toBe("0.135");
	});

	it('accepts "0.20"', () => {
		expect(VatRateSchema.parse("0.20")).toBe("0.20");
	});

	it('accepts "0.23"', () => {
		expect(VatRateSchema.parse("0.23")).toBe("0.23");
	});

	it('rejects "0.15"', () => {
		expect(() => VatRateSchema.parse("0.15")).toThrow();
	});

	it('rejects "25"', () => {
		expect(() => VatRateSchema.parse("25")).toThrow();
	});
});

describe("CurrencySchema", () => {
	it('accepts "GBP"', () => {
		expect(CurrencySchema.parse("GBP")).toBe("GBP");
	});

	it('accepts "EUR"', () => {
		expect(CurrencySchema.parse("EUR")).toBe("EUR");
	});

	it('rejects "USD"', () => {
		expect(() => CurrencySchema.parse("USD")).toThrow();
	});
});

describe("CalculatorInputSchema", () => {
	const validInput = {
		entityType: "limited_company",
		grossPersonalDraw: 5000,
		fixedOverheads: 2000,
		staffCount: 2,
		staffHourlyRate: 15,
		staffHoursPerWeek: 40,
		avgJobValue: 3000,
		directCostPct: 0.35,
		vatRate: "0.20",
		currency: "GBP",
	};

	it("accepts a fully valid input object", () => {
		expect(() => CalculatorInputSchema.parse(validInput)).not.toThrow();
	});

	it("rejects directCostPct above 0.80", () => {
		expect(() =>
			CalculatorInputSchema.parse({ ...validInput, directCostPct: 0.85 }),
		).toThrow();
	});

	it("rejects negative staffCount", () => {
		expect(() =>
			CalculatorInputSchema.parse({ ...validInput, staffCount: -1 }),
		).toThrow();
	});

	it("rejects non-integer staffCount", () => {
		expect(() =>
			CalculatorInputSchema.parse({ ...validInput, staffCount: 1.5 }),
		).toThrow();
	});

	it("rejects grossPersonalDraw of 0", () => {
		expect(() =>
			CalculatorInputSchema.parse({ ...validInput, grossPersonalDraw: 0 }),
		).toThrow();
	});
});
