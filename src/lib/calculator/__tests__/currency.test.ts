import { describe, expect, it } from "vitest";
import { formatCurrency, roundCurrency } from "@/lib/calculator/currency";

describe("formatCurrency", () => {
	it("formats GBP large value with no decimals and pound symbol", () => {
		const result = formatCurrency(10250, "GBP");
		expect(result).toContain("£");
		expect(result).toContain("10,250");
		expect(result).not.toContain(".");
	});

	it("formats EUR large value with no decimals and euro symbol", () => {
		const result = formatCurrency(10250, "EUR");
		expect(result).toContain("€");
		expect(result).toContain("10,250");
		expect(result).not.toContain(".");
	});

	it("formats GBP with 2 decimal places when specified", () => {
		const result = formatCurrency(47.23, "GBP", { decimals: 2 });
		expect(result).toContain("£");
		expect(result).toContain("47.23");
	});

	it("formats EUR with 2 decimal places when specified", () => {
		const result = formatCurrency(47.23, "EUR", { decimals: 2 });
		expect(result).toContain("€");
		expect(result).toContain("47.23");
	});

	it("handles zero correctly", () => {
		const result = formatCurrency(0, "GBP");
		expect(result).toContain("£");
		expect(result).toContain("0");
	});

	it("formats large numbers with thousands separators", () => {
		const result = formatCurrency(1234567, "GBP");
		expect(result).toContain(",");
	});

	it("rounds correctly with 2 decimals", () => {
		const result = formatCurrency(99.999, "GBP", { decimals: 2 });
		expect(result).toContain("£");
		expect(result).toContain("100.00");
	});
});

describe("roundCurrency", () => {
	it("rounds 47.2349 to 47.23", () => {
		expect(roundCurrency(47.2349)).toBe(47.23);
	});

	it("rounds 47.235 to 47.24", () => {
		expect(roundCurrency(47.235)).toBe(47.24);
	});

	it("handles zero", () => {
		expect(roundCurrency(0)).toBe(0);
	});

	it("handles whole numbers", () => {
		expect(roundCurrency(100)).toBe(100);
	});
});
