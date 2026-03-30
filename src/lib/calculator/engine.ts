import { BUSINESS_RULES } from "./constants";
import { roundCurrency } from "./currency";
import type { CalculatorInput, CalculatorOutput, EntityType } from "./types";

/**
 * Step 1: Calculate tax buffer.
 * Ltd companies need to earn more to cover corporation tax (20% buffer).
 * Sole traders take the gross draw as-is.
 */
export function calculateTaxBuffer(entityType: EntityType, grossPersonalDraw: number): number {
	if (entityType === "limited_company") {
		return grossPersonalDraw / BUSINESS_RULES.CORP_TAX_BUFFER;
	}
	return grossPersonalDraw;
}

/**
 * Step 2: Calculate true staff cost.
 * Applies employer burden (NI/PRSI) on top of base payroll.
 */
export function calculateStaffCost(
	staffCount: number,
	staffHourlyRate: number,
	staffHoursPerWeek: number,
): { totalMonthlyHours: number; basePayroll: number; adjustedPayroll: number } {
	const totalMonthlyHours = staffCount * staffHoursPerWeek * BUSINESS_RULES.WEEKS_PER_MONTH;
	const basePayroll = totalMonthlyHours * staffHourlyRate;
	const adjustedPayroll = basePayroll * BUSINESS_RULES.EMPLOYER_BURDEN;
	return { totalMonthlyHours, basePayroll, adjustedPayroll };
}

/**
 * Step 3: Calculate billable hours with efficiency cap.
 * Hard-capped at 75% — no one bills 100% of their hours.
 */
export function calculateBillableHours(totalMonthlyHours: number): number {
	return totalMonthlyHours * BUSINESS_RULES.EFFICIENCY_CAP;
}

/**
 * Step 4: Calculate slippage on direct costs.
 * 15% buffer for material waste, price increases, and rework.
 */
export function calculateSlippage(directCostPct: number): number {
	return directCostPct * BUSINESS_RULES.SLIPPAGE_FACTOR;
}

/**
 * Step 5: Calculate Minimum Revenue Target.
 * MRT = (profit + overheads) / (1 - realDirectCost)
 */
export function calculateMRT(
	targetBusinessProfit: number,
	adjustedOverheads: number,
	realDirectCost: number,
): number {
	return (targetBusinessProfit + adjustedOverheads) / (1 - realDirectCost);
}

/**
 * Composed calculation pipeline.
 * Takes raw form inputs and returns all output fields.
 * Pure function — no side effects, no network calls, fully synchronous.
 */
export function calculate(input: CalculatorInput): CalculatorOutput {
	// Step 1: Tax buffer
	const targetBusinessProfit = calculateTaxBuffer(input.entityType, input.grossPersonalDraw);

	// Step 2: Staff cost
	const { totalMonthlyHours, basePayroll, adjustedPayroll } = calculateStaffCost(
		input.staffCount,
		input.staffHourlyRate,
		input.staffHoursPerWeek,
	);

	// Step 3: Billable hours
	let totalBillableHours: number;
	if (input.staffCount === 0 && input.ownerHoursPerWeek) {
		const ownerMonthlyHours = input.ownerHoursPerWeek * BUSINESS_RULES.WEEKS_PER_MONTH;
		totalBillableHours = calculateBillableHours(ownerMonthlyHours);
	} else {
		totalBillableHours = calculateBillableHours(totalMonthlyHours);
	}

	// Step 4: Slippage
	const realDirectCost = calculateSlippage(input.directCostPct);

	// Step 5: Adjusted overheads (fixed + staff)
	const adjustedOverheads = input.fixedOverheads + adjustedPayroll;

	// Step 6: MRT
	const monthlyRevenueTarget = calculateMRT(
		targetBusinessProfit,
		adjustedOverheads,
		realDirectCost,
	);

	// Derived pipeline values (use unrounded MRT for precision)
	const monthlyBillings = monthlyRevenueTarget * (1 + input.vatRate);
	const hourlyFloorRate = totalBillableHours > 0 ? monthlyRevenueTarget / totalBillableHours : 0;
	const jobsToWin = monthlyRevenueTarget / input.avgJobValue;
	const quotesNeeded = jobsToWin / BUSINESS_RULES.WIN_RATE;
	const leadsNeeded = quotesNeeded / BUSINESS_RULES.LEAD_CONVERSION_RATE;

	return {
		monthlyRevenueTarget: roundCurrency(monthlyRevenueTarget),
		monthlyBillings: roundCurrency(monthlyBillings),
		hourlyFloorRate: roundCurrency(hourlyFloorRate),
		jobsToWin: Math.ceil(jobsToWin),
		quotesNeeded: Math.ceil(quotesNeeded),
		leadsNeeded: Math.ceil(leadsNeeded),
		targetBusinessProfit: roundCurrency(targetBusinessProfit),
		adjustedPayroll: roundCurrency(adjustedPayroll),
		totalBillableHours: roundCurrency(totalBillableHours),
		realDirectCost,
		adjustedOverheads: roundCurrency(adjustedOverheads),
		taxBufferAmount: roundCurrency(targetBusinessProfit - input.grossPersonalDraw),
		basePayroll: roundCurrency(basePayroll),
		employerBurdenAmount: roundCurrency(adjustedPayroll - basePayroll),
		marginAfterMaterials: 1 - realDirectCost,
	};
}
