type AlertCopyEntry = {
	readonly title: string;
	readonly body: string;
};

export const ALERT_COPY = {
	"gross-draw": {
		title: "Your Personal Tax Is Not Covered Here",
		body: "This calculator works out what your business needs to earn — but your personal income tax (PAYE, USC, PRSI, or self-assessment) still comes out of your take-home draw. The figure you entered is your gross personal draw before personal tax. Make sure you are setting aside enough to cover your personal tax bill, or you will get a nasty surprise at year-end.",
	},
	"two-thirds-rule": {
		title: "You May Need the 23% VAT Rate Instead",
		body: "In Ireland, if your materials and direct costs make up more than two-thirds of the job value, Revenue may require you to charge VAT at 23% instead of 13.5%. This is called the Two-Thirds Rule. With your current direct cost percentage, you could be caught by this. Check with your accountant, and consider re-running your numbers at 23% to see the impact. You can hit 'Edit Your Numbers' below to change your VAT rate.",
	},
	"efficiency-cap": {
		title: "Why We Cap Billable Hours at 75%",
		body: "Your staff are contracted for a set number of hours, but nobody bills 100% of their time. Between travel, quoting, callbacks, training, and the odd rainy day, 75% billable efficiency is realistic for most trades. This protects you from building a plan that assumes every hour is a paying hour — because in the real world, it never is.",
	},
	"cis-rct": {
		title: "Subcontractor Tax Withholding Affects Your Cash Flow",
		body: "If you work as a subcontractor in construction, your main contractor may withhold tax from your payments under CIS (UK — up to 30%) or RCT (Ireland — up to 35%). This means the cash hitting your account is less than the invoice value. Your revenue target stays the same, but you will need to manage cash flow carefully because that withheld tax does not come back until your tax return is processed.",
	},
} as const satisfies Record<string, AlertCopyEntry>;
