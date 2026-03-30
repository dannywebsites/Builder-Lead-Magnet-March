import { CalculatorApp } from "@/components/CalculatorApp";

export default function Home() {
	return (
		<main>
			{/* Hero header */}
			<div className="bg-slate-900 text-white">
				<div className="max-w-2xl mx-auto px-4 pt-12 pb-16 text-center">
					<p className="text-sm font-semibold tracking-widest uppercase text-[var(--brand)] mb-3">
						Trade Survival Calculator
					</p>
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
						What does your business{" "}
						<span className="text-[var(--brand)]">actually</span> need to earn?
					</h1>
					<p className="mt-4 text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
						Enter what you want to take home. We will show you the brutal truth
						about what your business must generate to make that happen.
					</p>
				</div>
			</div>

			{/* Calculator */}
			<div className="-mt-8">
				<CalculatorApp />
			</div>
		</main>
	);
}
