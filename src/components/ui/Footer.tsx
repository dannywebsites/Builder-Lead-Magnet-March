import Link from "next/link";

export function Footer() {
	return (
		<footer className="mt-auto border-t border-gray-200 py-6 px-4 text-center text-sm text-gray-500">
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
