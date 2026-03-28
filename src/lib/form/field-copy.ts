type FieldCopyEntry = {
	readonly explanation: string;
	readonly disclaimer: string | null;
};

export const FIELD_COPY = {
	entityType: {
		explanation:
			"How your business is registered. This affects how we calculate your tax buffer -- limited companies need to set aside money for Corporation Tax.",
		disclaimer: null,
	},
	currency: {
		explanation:
			"The currency you invoice in. All your figures will be shown in this currency.",
		disclaimer: null,
	},
	vatRate: {
		explanation:
			"The VAT rate you charge on your invoices. If you are not VAT-registered, select 0% Exempt.",
		disclaimer: null,
	},
	fixedCostVehicle: {
		explanation:
			"Your van lease, fuel, insurance, and maintenance. If you own your van outright, include just fuel and upkeep.",
		disclaimer: null,
	},
	fixedCostPremises: {
		explanation:
			"Rent for your workshop, yard, or storage unit. Skip this if you work from home or on-site only.",
		disclaimer: null,
	},
	fixedCostEquipment: {
		explanation:
			"Tool hire, equipment leases, and replacement tools. The stuff that wears out or needs replacing.",
		disclaimer: null,
	},
	fixedCostInsurance: {
		explanation:
			"Public liability, professional indemnity, employer liability, and any other business insurance premiums.",
		disclaimer: null,
	},
	fixedCostTechnology: {
		explanation:
			"Software subscriptions, phone contracts, and IT costs. Think accounting software, project management tools, and your work phone.",
		disclaimer: null,
	},
	fixedCostLoans: {
		explanation:
			"Business loan repayments, equipment finance, and any other regular debt payments the business owes.",
		disclaimer: null,
	},
	fixedCostProfessional: {
		explanation:
			"Your accountant, bookkeeper, legal fees, and any professional memberships or trade body subscriptions.",
		disclaimer: null,
	},
	fixedCostOther: {
		explanation:
			"Anything else the business pays monthly that does not fit above -- uniforms, marketing, training, waste disposal contracts.",
		disclaimer: null,
	},
	grossPersonalDraw: {
		explanation:
			"What you want to take home each month, before your personal income tax. This is your pay after the business has covered all its costs. Most tradespeople target between 3,000 and 6,000 per month.",
		disclaimer:
			"* For limited companies, we add a 20% Corporation Tax buffer to protect this amount. Your business needs to generate more than your personal draw to cover this.",
	},
	staffCount: {
		explanation:
			"On-site billable staff only -- the people doing chargeable work. Do not count office or admin staff here. Enter 0 if you work solo.",
		disclaimer: null,
	},
	staffHourlyRate: {
		explanation:
			"The average gross hourly rate you pay your on-site staff, per their employment contract. Most trades pay between 12 and 25 per hour.",
		disclaimer:
			"* We add 30% on top of this to cover employer National Insurance, pension, and other employment costs. This is the real cost of having staff.",
	},
	staffHoursPerWeek: {
		explanation:
			"The contracted weekly hours for your on-site staff. Standard is 37.5 to 45 hours per week.",
		disclaimer:
			"* We apply a 75% efficiency cap to these hours. Nobody is billable 100% of the time -- travel, weather, callbacks, and admin eat into your day. This protects your quote from being too optimistic.",
	},
	avgJobValue: {
		explanation:
			"What a typical job is worth before VAT, based on your recent work. Think about your last 5-10 jobs and pick the middle ground. Most trades range from 500 to 10,000 per job.",
		disclaimer: null,
	},
	directCostPctDisplay: {
		explanation:
			"The percentage of each job that goes on materials, fuel, skip hire, and disposal. If a 1,000 job costs you 350 in materials and fuel, that is 35%. Most trades fall between 25% and 50%.",
		disclaimer:
			"* We add a 15% slippage factor on top of your figure. Materials go missing, fuel costs spike, skips overflow -- this protects your margin from real-world surprises.",
	},
} as const satisfies Record<string, FieldCopyEntry>;
