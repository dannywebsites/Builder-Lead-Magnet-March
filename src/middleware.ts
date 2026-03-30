import { NextResponse, type NextRequest } from "next/server";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const rateMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitResponse(): NextResponse {
	return NextResponse.json(
		{ error: "Too many requests. Please try again later." },
		{ status: 429 },
	);
}

function checkRateLimit(ip: string): boolean {
	const now = Date.now();

	// Clean up expired entries
	rateMap.forEach((entry, key) => {
		if (now > entry.resetTime) {
			rateMap.delete(key);
		}
	});

	const entry = rateMap.get(ip);

	if (!entry || now > entry.resetTime) {
		rateMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
		return true;
	}

	entry.count += 1;
	return entry.count <= RATE_LIMIT;
}

const SECURITY_HEADERS: Record<string, string> = {
	"X-Frame-Options": "DENY",
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"X-DNS-Prefetch-Control": "on",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
	"Content-Security-Policy": [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob:",
		"font-src 'self' data:",
		"connect-src 'self' https://plausible.io",
		"frame-ancestors 'none'",
	].join("; "),
};

export function middleware(request: NextRequest) {
	// Rate limit API routes only
	if (request.nextUrl.pathname.startsWith("/api")) {
		const ip =
			request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
			"unknown";
		if (!checkRateLimit(ip)) {
			return getRateLimitResponse();
		}
	}

	// Security headers on all responses
	const response = NextResponse.next();
	for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(key, value);
	}

	return response;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
