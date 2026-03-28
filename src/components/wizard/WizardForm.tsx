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
		<div className="max-w-2xl mx-auto px-4 py-12">
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
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
						{step === 0 && <StepBusinessIdentity />}
						{step === 1 && <StepFinancials />}
						{step === 2 && <StepStaff />}
						{step === 3 && <StepJobPricing />}

						{/* Navigation buttons */}
						<div className="flex justify-between mt-8">
							{step > 0 ? (
								<button
									type="button"
									onClick={handleBack}
									className="px-6 py-3 rounded-lg text-base font-semibold min-h-[44px] text-gray-600 hover:text-foreground"
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
									className="px-6 py-3 rounded-lg text-base font-semibold min-h-[44px] bg-blue-600 text-white hover:bg-blue-700"
								>
									Next Step
								</button>
							) : (
								<button
									type="button"
									onClick={handleCalculate}
									className="px-6 py-3 rounded-lg text-base font-semibold min-h-[44px] bg-blue-600 text-white hover:bg-blue-700"
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
