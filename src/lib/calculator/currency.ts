import type { Currency } from "./types";

const LOCALE_MAP: Record<Currency, string> = {
	GBP: "en-GB",
	EUR: "en-IE",
};

/**
 * Format a monetary value for display.
 *
 * Per D-03: Large values (revenue, billings, overheads) use decimals: 0 (default).
 * Per D-04: Hourly Floor Rate uses decimals: 2.
 * Per D-05: Supports both GBP and EUR with correct locale positioning.
 */
export function formatCurrency(
	amount: number,
	currency: Currency,
	options?: { decimals?: number },
): string {
	const decimals = options?.decimals ?? 0;
	return new Intl.NumberFormat(LOCALE_MAP[currency], {
		style: "currency",
		currency,
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(amount);
}

/**
 * Round a number to 2 decimal places for currency precision.
 * Per CALC-07: Floating point precision handled correctly.
 * Uses Math.round to avoid floating point drift.
 */
export function roundCurrency(value: number): number {
	return Math.round(value * 100) / 100;
}
