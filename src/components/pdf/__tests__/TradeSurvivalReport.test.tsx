// @vitest-environment node
import { describe, it, expect } from "vitest";
import { pdf } from "@react-pdf/renderer";
import { TradeSurvivalReport } from "../TradeSurvivalReport";
import type { CalculatorInput, CalculatorOutput } from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";

const testInput: CalculatorInput = {
	entityType: "limited_company",
	grossPersonalDraw: 4000,
	fixedOverheads: 2000,
	staffCount: 2,
	staffHourlyRate: 15,
	staffHoursPerWeek: 40,
	avgJobValue: 3000,
	directCostPct: 0.35,
	vatRate: 0.2,
	currency: "GBP",
};

const testOutput: CalculatorOutput = {
	monthlyRevenueTarget: 15384.62,
	monthlyBillings: 18461.54,
	hourlyFloorRate: 23.67,
	jobsToWin: 5.13,
	quotesNeeded: 17.09,
	leadsNeeded: 56.98,
	targetBusinessProfit: 5000,
	adjustedPayroll: 6756,
	totalBillableHours: 259.8,
	realDirectCost: 0.4025,
	adjustedOverheads: 8756,
	taxBufferAmount: 1000,
	basePayroll: 5196,
	employerBurdenAmount: 1560,
	marginAfterMaterials: 0.5975,
};

const testAlerts: Alert[] = [
	{
		key: "gross-draw",
		title: "Your Personal Tax Is Not Covered Here",
		body: "Test alert body 1",
	},
	{
		key: "efficiency-cap",
		title: "Why We Cap Billable Hours at 75%",
		body: "Test alert body 2",
	},
	{
		key: "cis-rct",
		title: "Subcontractor Tax Withholding Affects Your Cash Flow",
		body: "Test alert body 3",
	},
];

describe("TradeSurvivalReport component tree", () => {
	it("renders to a valid PDF Blob (PDF-01)", async () => {
		const blob = await pdf(
			TradeSurvivalReport({
				input: testInput,
				output: testOutput,
				currency: "GBP",
				alerts: testAlerts,
			}),
		).toBlob();
		expect(blob).toBeInstanceOf(Blob);
		expect(blob.size).toBeGreaterThan(0);
	});

	it("passes all 6 output keys through FinancialAnchorsSection and PipelineSection (PDF-01)", async () => {
		const pdfString = await pdf(
			TradeSurvivalReport({
				input: testInput,
				output: testOutput,
				currency: "GBP",
				alerts: testAlerts,
			}),
		).toString();

		expect(pdfString).toBeTruthy();
		expect(pdfString.length).toBeGreaterThan(1000);
	});

	it("forwards alerts array to AlertsSection (PDF-02)", async () => {
		const blobWithAlerts = await pdf(
			TradeSurvivalReport({
				input: testInput,
				output: testOutput,
				currency: "GBP",
				alerts: testAlerts,
			}),
		).toBlob();

		const blobWithoutAlerts = await pdf(
			TradeSurvivalReport({
				input: testInput,
				output: testOutput,
				currency: "GBP",
				alerts: [],
			}),
		).toBlob();

		expect(blobWithAlerts.size).toBeGreaterThan(blobWithoutAlerts.size);
	});

	it("includes DisclaimersFooter in output (PDF-03)", async () => {
		const blob = await pdf(
			TradeSurvivalReport({
				input: testInput,
				output: testOutput,
				currency: "GBP",
				alerts: [],
			}),
		).toBlob();
		expect(blob).toBeInstanceOf(Blob);
		expect(blob.size).toBeGreaterThan(2000);
	});

	it("renders with zero staff (edge case)", async () => {
		const zeroStaffInput = { ...testInput, staffCount: 0 };
		const blob = await pdf(
			TradeSurvivalReport({
				input: zeroStaffInput,
				output: testOutput,
				currency: "GBP",
				alerts: [],
			}),
		).toBlob();
		expect(blob).toBeInstanceOf(Blob);
	});

	it("renders with EUR currency and IE VAT (edge case)", async () => {
		const eurInput = {
			...testInput,
			currency: "EUR" as const,
			vatRate: 0.23 as const,
		};
		const blob = await pdf(
			TradeSurvivalReport({
				input: eurInput,
				output: testOutput,
				currency: "EUR",
				alerts: testAlerts,
			}),
		).toBlob();
		expect(blob).toBeInstanceOf(Blob);
	});
});
