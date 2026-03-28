import { describe, it, expect } from "vitest";
import {
	OUTPUT_COPY,
	ZERO_STAFF_HOURLY_NOTE,
} from "@/lib/results/output-copy";

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
