import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createRedis } from "@/lib/redis";

const ALLOWED_ORIGINS = [
  "https://thisismotivo.com",
  "https://www.thisismotivo.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Upstash Redis rate limiter (30 req/min per IP, sliding window)
const redis = createRedis();
const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      analytics: true,
      prefix: "motivo-api",
    })
  : null;

// Fallback in-memory rate limit when Upstash not configured (e.g. local dev)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimitedInMemory(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > MAX_REQUESTS;
}

function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // Same-origin or no Origin (e.g. curl)
  try {
    const host = new URL(origin).origin;
    return ALLOWED_ORIGINS.includes(host);
  } catch {
    return false;
  }
}

const API_PATHS = ["/api/chat", "/api/notify-email", "/api/send-brief", "/api/summarize"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (API_PATHS.some((p) => path.startsWith(p))) {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = getClientIp(req);

    if (ratelimit) {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    } else if (isRateLimitedInMemory(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
