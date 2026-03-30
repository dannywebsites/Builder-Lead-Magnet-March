import Link from "next/link";

export function Footer() {
	return (
		<footer className="mt-auto border-t border-slate-200 py-8 px-4 text-center text-sm text-slate-400">
			<Link href="/privacy" className="hover:underline">
				Privacy Policy
			</Link>
			<span className="mx-2">&middot;</span>
			<span>
				&copy; {new Date().getFullYear()} Trade Survival Calculator
			</span>
		</footer>
	);
}
