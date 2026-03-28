/** Business entity type */
export type EntityType = "limited_company" | "sole_trader";

/** Supported currencies */
export type Currency = "GBP" | "EUR";

/** VAT rate options as numeric values (for calculation layer) */
export type VatRateValue = 0 | 0.135 | 0.20 | 0.23;

/** VAT rate display labels for UI selects */
export const VAT_RATE_OPTIONS: ReadonlyArray<{
	label: string;
	value: VatRateValue;
}> = [
	{ label: "20% (UK Standard)", value: 0.20 },
	{ label: "13.5% (Ireland Reduced)", value: 0.135 },
	{ label: "23% (Ireland Standard)", value: 0.23 },
	{ label: "0% (VAT Exempt)", value: 0 },
];

/** Raw calculator inputs from the form */
export interface CalculatorInput {
	entityType: EntityType;
	grossPersonalDraw: number;
	fixedOverheads: number;
	staffCount: number;
	staffHourlyRate: number;
	staffHoursPerWeek: number;
	avgJobValue: number;
	directCostPct: number;
	vatRate: VatRateValue;
	currency: Currency;
}

/** Calculated output results */
export interface CalculatorOutput {
	monthlyRevenueTarget: number;
	monthlyBillings: number;
	hourlyFloorRate: number;
	jobsToWin: number;
	quotesNeeded: number;
	leadsNeeded: number;
	targetBusinessProfit: number;
	adjustedPayroll: number;
	totalBillableHours: number;
	realDirectCost: number;
	adjustedOverheads: number;
}
