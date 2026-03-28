import { Suspense } from "react";
import WizardForm from "@/components/wizard/WizardForm";

export default function Home() {
	return (
		<main>
			<Suspense>
				<WizardForm />
			</Suspense>
		</main>
	);
}
