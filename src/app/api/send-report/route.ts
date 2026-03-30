import { Resend } from "resend";
import { ResultsSummaryEmail } from "@/lib/email/templates/ResultsSummaryEmail";
import { sendReportRequestSchema } from "@/lib/email/schema";

function getResend() {
	return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: Request) {
	try {
		const body = await request.json();

		// D-14: Validate email format and consent flag server-side
		const parsed = sendReportRequestSchema.safeParse(body);
		if (!parsed.success) {
			return Response.json(
				{ error: "Invalid input. Please provide a valid email and consent." },
				{ status: 400 },
			);
		}

		const { name, email, consent, calculatorInput, calculatorOutput, currency, alerts } =
			parsed.data;

		// Double-check consent server-side (belt and suspenders)
		if (!consent) {
			return Response.json(
				{ error: "Consent is required to send the report." },
				{ status: 400 },
			);
		}

		const templateProps = {
			name,
			input: calculatorInput,
			output: calculatorOutput,
			currency,
			alerts,
		};

		// LEAD-05: Send branded results summary email via Resend
		const resend = getResend();
		const { error: emailError } = await resend.emails.send({
			from:
				process.env.EMAIL_FROM ||
				"Trade Survival Calculator <onboarding@resend.dev>",
			to: [email],
			subject: "Your Trade Survival Numbers — What Your Business Needs to Earn",
			react: ResultsSummaryEmail(templateProps),
		});

		if (emailError) {
			console.error("Resend email error:", emailError);
			return Response.json(
				{ error: "Failed to send email. Please try again." },
				{ status: 500 },
			);
		}

		// LEAD-03: Add email to Resend audience for follow-up marketing (fire-and-forget)
		// Non-blocking — don't fail the request if audience add fails
		const audienceId = process.env.RESEND_AUDIENCE_ID;
		if (audienceId) {
			getResend().contacts.create({
				audienceId,
				email,
				firstName: name,
			}).catch((err) => {
				console.error("Failed to add contact to audience:", err);
			});
		}

		// Push lead data to GHL webhook (fire-and-forget)
		const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;
		if (ghlWebhookUrl) {
			fetch(ghlWebhookUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email }),
			}).catch((err) => {
				console.error("Failed to push to GHL webhook:", err);
			});
		}

		return Response.json({ success: true });
	} catch (error) {
		console.error("Send report error:", error);
		return Response.json(
			{ error: "An unexpected error occurred. Please try again." },
			{ status: 500 },
		);
	}
}
