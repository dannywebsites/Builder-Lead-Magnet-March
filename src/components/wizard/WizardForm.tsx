"use client";

import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQueryState, parseAsInteger } from "nuqs";

import type {
	CalculatorInput,
	CalculatorOutput,
	Currency,
} from "@/lib/calculator/types";
import { STEP_SCHEMAS, type FormValues } from "@/lib/form/step-schemas";
import { FORM_DEFAULTS } from "@/lib/form/form-defaults";
import { transformToCalculatorInput } from "@/lib/form/transform";
import { calculate } from "@/lib/calculator";
import { WizardProgress } from "./WizardProgress";
import { StepBusinessIdentity } from "./steps/StepBusinessIdentity";
import { StepFinancials } from "./steps/StepFinancials";
import { StepStaff } from "./steps/StepStaff";
import { StepJobPricing } from "./steps/StepJobPricing";

interface WizardFormProps {
	onCalculated: (
		output: CalculatorOutput,
		currency: Currency,
		staffCount: number,
		input: CalculatorInput,
	) => void;
}

export default function WizardForm({ onCalculated }: WizardFormProps) {
	const [step, setStep] = useQueryState(
		"step",
		parseAsInteger.withDefault(0),
	);

	const methods = useForm<FormValues>({
		mode: "onTouched",
		defaultValues: FORM_DEFAULTS,
	});

	const handleNext = useCallback(async () => {
		const schema = STEP_SCHEMAS[step];
		const fieldNames = Object.keys(
			schema.shape,
		) as Array<keyof FormValues>;
		const valid = await methods.trigger(fieldNames);
		if (valid) {
			setStep(step + 1);
		}
	}, [step, setStep, methods]);

	const handleBack = useCallback(() => {
		if (step > 0) {
			setStep(step - 1);
		}
	}, [step, setStep]);

	const handleCalculate = useCallback(async () => {
		const schema = STEP_SCHEMAS[3];
		const fieldNames = Object.keys(schema.shape) as Array<keyof FormValues>;
		const valid = await methods.trigger(fieldNames);
		if (!valid) return;

		const data = methods.getValues();
		const input = transformToCalculatorInput(data);
		const result = calculate(input);
		onCalculated(result, data.currency as Currency, Number(data.staffCount), input);
	}, [methods, onCalculated]);

	return (
		<div className="max-w-2xl mx-auto px-4 pb-12">
			<WizardProgress
				currentStep={step}
				totalSteps={4}
				onStepClick={(i) => {
					if (i < step) {
						setStep(i);
					}
				}}
			/>

			<FormProvider {...methods}>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8 mt-6">
						{step === 0 && <StepBusinessIdentity />}
						{step === 1 && <StepFinancials />}
						{step === 2 && <StepStaff />}
						{step === 3 && <StepJobPricing />}

						{/* Navigation buttons */}
						<div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
							{step > 0 ? (
								<button
									type="button"
									onClick={handleBack}
									className="px-6 py-3 rounded-lg text-base font-semibold min-h-[44px] text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
								>
									Back
								</button>
							) : (
								<div />
							)}

							{step < 3 ? (
								<button
									type="button"
									onClick={handleNext}
									className="px-6 py-3 rounded-xl text-base font-semibold min-h-[44px] bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] shadow-sm transition-colors"
								>
									Next Step
								</button>
							) : (
								<button
									type="button"
									onClick={handleCalculate}
									className="px-8 py-3 rounded-xl text-base font-bold min-h-[44px] bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] shadow-md hover:shadow-lg transition-all"
								>
									Calculate Your Numbers
								</button>
							)}
						</div>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}
