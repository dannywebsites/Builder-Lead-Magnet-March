"use client";

import { useState, Suspense } from "react";
import type { CalculatorOutput, Currency } from "@/lib/calculator/types";
import WizardForm from "@/components/wizard/WizardForm";

interface ResultsState {
	output: CalculatorOutput;
	currency: Currency;
	staffCount: number;
}

export function CalculatorApp() {
	const [results, setResults] = useState<ResultsState | null>(null);

	return (
		<Suspense>
			{/* Per D-04: Keep WizardForm mounted but hidden to preserve form state */}
			<div className={results ? "hidden" : ""}>
				<WizardForm
					onCalculated={(output, currency, staffCount) =>
						setResults({ output, currency, staffCount })
					}
				/>
			</div>
			{results && (
				<div className="max-w-2xl mx-auto px-4 py-12">
					<h2 className="text-2xl font-bold text-center mb-8">
						Your Numbers
					</h2>
					<pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
						{JSON.stringify(results.output, null, 2)}
					</pre>
					<button
						type="button"
						onClick={() => setResults(null)}
						className="mt-6 px-6 py-3 rounded-lg text-base font-semibold min-h-[44px] text-gray-600 hover:text-foreground border border-gray-300"
					>
						Edit Your Numbers
					</button>
				</div>
			)}
		</Suspense>
	);
}
