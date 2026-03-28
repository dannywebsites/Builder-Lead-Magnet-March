import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Privacy Policy | Trade Survival Calculator",
	description: "How we handle your data",
};

export default function PrivacyPage() {
	return (
		<main className="max-w-2xl mx-auto px-4 py-12">
			<Link href="/" className="text-blue-600 hover:underline text-sm">
				&larr; Back to calculator
			</Link>

			<h1 className="text-3xl font-bold mb-8 mt-6">Privacy Policy</h1>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">What we collect</h2>
				<p className="text-gray-700 leading-relaxed">
					When you request your Trade Survival Report, we ask for your email
					address. That is the only personal data we collect.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Why we collect it</h2>
				<p className="text-gray-700 leading-relaxed">
					We use your email address to: (1) Send you your Trade Survival Report,
					(2) Occasionally send you practical tips for running a profitable trade
					business. You can unsubscribe from tips at any time using the link in
					every email.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">What we do NOT do</h2>
				<p className="text-gray-700 leading-relaxed">
					We do not use cookies or tracking scripts that require consent. We do
					not share, sell, or give your email address to anyone. We do not store
					any of the financial figures you enter into the calculator — all
					calculations happen in your browser and are never sent to our servers.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Your rights</h2>
				<p className="text-gray-700 leading-relaxed">
					You can ask us to delete your email address at any time by emailing
					[contact email placeholder]. We will remove it within 30 days. Under
					GDPR and the UK Data Protection Act 2018, you also have the right to
					access, correct, or restrict processing of your data.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Who we are</h2>
				<p className="text-gray-700 leading-relaxed">
					Trade Survival Calculator is operated by [Business Name placeholder].
					For any privacy questions, email [contact email placeholder].
				</p>
			</section>

			<p className="text-sm text-gray-500 mt-8">Last updated: March 2026</p>
		</main>
	);
}
