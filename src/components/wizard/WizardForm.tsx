"use client";

import { useCallback } from "react";
import { type SubmitHandler, FormProvider, useForm } from "react-hook-form";
import { useQueryState, parseAsInteger } from "nuqs";

import { STEP_SCHEMAS, type FormValues } from "@/lib/form/step-schemas";
import { FORM_DEFAULTS } from "@/lib/form/form-defaults";
import { transformToCalculatorInput } from "@/lib/form/transform";
import { calculate } from "@/lib/calculator";
import { WizardProgress } from "./WizardProgress";

const STEP_TITLES = [
	{ title: "Your Business", description: "Tell us about your business setup" },
	{
		title: "Your Money",
		description: "What you need to take home and what you spend",
	},
	{
		title: "Your Team",
		description: "Staff costs -- skip if you work solo",
	},
	{
		title: "Your Jobs",
		description: "How much your typical job is worth",
	},
];

export default function WizardForm() {
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

	const onSubmit: SubmitHandler<FormValues> = useCallback(
		(data) => {
			const input = transformToCalculatorInput(data);
			const result = calculate(input);
			console.log("Calculation result:", result);
		},
		[],
	);

	const currentStepInfo = STEP_TITLES[step] ?? STEP_TITLES[0];

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
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
						<h2 className="text-2xl font-semibold text-foreground">
							{currentStepInfo.title}
						</h2>
						<p className="text-base text-gray-500 mt-1">
							{currentStepInfo.description}
						</p>

						{/* Step content placeholders */}
						<div className="mt-6 space-y-4">
							{step === 0 && (
								<div className="py-8 text-center text-gray-400">
									Step 1: Your Business fields (Plan 02)
								</div>
							)}
							{step === 1 && (
								<div className="py-8 text-center text-gray-400">
									Step 2: Your Money fields (Plan 02)
								</div>
							)}
							{step === 2 && (
								<div className="py-8 text-center text-gray-400">
									Step 3: Your Team fields (Plan 02)
								</div>
							)}
							{step === 3 && (
								<div className="py-8 text-center text-gray-400">
									Step 4: Your Jobs fields (Plan 02)
								</div>
							)}
						</div>

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
									type="submit"
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
