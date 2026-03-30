import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Footer } from "@/components/ui/Footer";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Trade Survival Calculator - Know Your Real Numbers",
	description: "Work backward from what you need to take home. Get the brutal truth about what your trade business must generate to stay solvent.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
			<body className="min-h-full flex flex-col bg-[var(--background)]">
				<NuqsAdapter>{children}</NuqsAdapter>
				<Footer />
				<Toaster richColors position="top-center" />
			</body>
		</html>
	);
}
