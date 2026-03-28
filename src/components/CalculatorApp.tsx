"use client";

import { useState, Suspense } from "react";
import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";
import type { Alert } from "@/lib/calculator/alerts";
import { getTriggeredAlerts } from "@/lib/calculator/alerts";
import WizardForm from "@/components/wizard/WizardForm";
import { ResultsView } from "@/components/results/ResultsView";

interface ResultsState {
	input: CalculatorInput;
	output: CalculatorOutput;
	currency: Currency;
	staffCount: number;
	alerts: Alert[];
}

export function CalculatorApp() {
	const [results, setResults] = useState<ResultsState | null>(null);

	return (
		<Suspense>
			{/* Per D-04: Keep WizardForm mounted but hidden to preserve form state */}
			<div className={results ? "hidden" : ""}>
				<WizardForm
					onCalculated={(output, currency, staffCount, input) => {
						const alerts = getTriggeredAlerts(input, output);
						setResults({ input, output, currency, staffCount, alerts });
					}}
				/>
			</div>
			{results && (
				<ResultsView
					input={results.input}
					output={results.output}
					currency={results.currency}
					staffCount={results.staffCount}
					alerts={results.alerts}
					onEdit={() => setResults(null)}
				/>
			)}
		</Suspense>
	);
}
