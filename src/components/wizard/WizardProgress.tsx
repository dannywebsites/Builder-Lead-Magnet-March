"use client";

const STEP_LABELS = ["Business", "Money", "Team", "Pricing"];

interface WizardProgressProps {
	currentStep: number;
	totalSteps?: number;
	onStepClick?: (step: number) => void;
}

export function WizardProgress({
	currentStep,
	totalSteps = 4,
	onStepClick,
}: WizardProgressProps) {
	return (
		<div className="flex items-center justify-between w-full">
			{Array.from({ length: totalSteps }, (_, i) => {
				const isCompleted = i < currentStep;
				const isCurrent = i === currentStep;
				const isUpcoming = i > currentStep;

				return (
					<div key={i} className="flex items-center flex-1 last:flex-none">
						{/* Step circle + label */}
						<div className="flex flex-col items-center">
							<button
								type="button"
								onClick={() => {
									if (isCompleted && onStepClick) {
										onStepClick(i);
									}
								}}
								disabled={!isCompleted}
								className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
									isCompleted
										? "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
										: ""
								} ${
									isCurrent ? "ring-2 ring-blue-600 text-blue-600 bg-white" : ""
								} ${
									isUpcoming
										? "bg-gray-200 text-gray-400 cursor-default"
										: ""
								}`}
								aria-label={`Step ${i + 1}: ${STEP_LABELS[i]}${isCompleted ? " (completed)" : isCurrent ? " (current)" : ""}`}
							>
								{isCompleted ? "\u2713" : i + 1}
							</button>
							<span
								className={`mt-1 text-sm hidden sm:block ${
									isCompleted ? "text-foreground" : ""
								} ${isCurrent ? "text-foreground font-semibold" : ""} ${
									isUpcoming ? "text-gray-400" : ""
								}`}
							>
								{STEP_LABELS[i]}
							</span>
						</div>

						{/* Connector line */}
						{i < totalSteps - 1 && (
							<div
								className={`mx-2 h-0.5 flex-1 ${
									i < currentStep ? "bg-blue-600" : "bg-gray-200"
								}`}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
