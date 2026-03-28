import { View, Text } from "@react-pdf/renderer";
import { reportStyles } from "./report-styles";
import { OUTPUT_COPY } from "@/lib/results/output-copy";
import type { CalculatorOutput } from "@/lib/calculator/types";

interface PipelineSectionProps {
	output: CalculatorOutput;
}

export function PipelineSection({ output }: PipelineSectionProps) {
	return (
		<View>
			<Text style={reportStyles.sectionTitle}>Your Sales Marching Orders</Text>

			<View style={reportStyles.pipelineRow}>
				<Text style={reportStyles.pipelineLabel}>
					{OUTPUT_COPY.jobsToWin.label}
				</Text>
				<Text style={reportStyles.pipelineValue}>
					{Math.ceil(output.jobsToWin)}
				</Text>
			</View>
			<Text style={reportStyles.pipelineExplanation}>
				{OUTPUT_COPY.jobsToWin.explanation}
			</Text>

			<View style={reportStyles.pipelineRow}>
				<Text style={reportStyles.pipelineLabel}>
					{OUTPUT_COPY.quotesNeeded.label}
				</Text>
				<Text style={reportStyles.pipelineValue}>
					{Math.ceil(output.quotesNeeded)}
				</Text>
			</View>
			<Text style={reportStyles.pipelineExplanation}>
				{OUTPUT_COPY.quotesNeeded.explanation}
			</Text>

			<View style={reportStyles.pipelineRow}>
				<Text style={reportStyles.pipelineLabel}>
					{OUTPUT_COPY.leadsNeeded.label}
				</Text>
				<Text style={reportStyles.pipelineValue}>
					{Math.ceil(output.leadsNeeded)}
				</Text>
			</View>
			<Text style={reportStyles.pipelineExplanation}>
				{OUTPUT_COPY.leadsNeeded.explanation}
			</Text>
		</View>
	);
}
