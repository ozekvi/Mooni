import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// In-memory rate limiter (per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (record.count >= limit) return false; // blocked

  record.count++;
  return true; // allowed
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getIP(req);

  // ── Rate limiting ──────────────────────────────────────────────────────────
  // Auth routes: 10 req / 1 min per IP
  if (pathname.startsWith("/api/auth/register") || pathname.startsWith("/api/auth/verify")) {
    if (!rateLimit(`auth:${ip}`, 10, 60_000)) {
      return new NextResponse(JSON.stringify({ error: "Too many requests. Please wait a minute." }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Retry-After": "60" },
      });
    }
  }

  // Checkout: 5 req / 1 min per IP
  if (pathname.startsWith("/api/checkout")) {
    if (!rateLimit(`checkout:${ip}`, 5, 60_000)) {
      return new NextResponse(JSON.stringify({ error: "Too many requests." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // General API: 120 req / 1 min per IP
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/callback")) {
    if (!rateLimit(`api:${ip}`, 120, 60_000)) {
      return new NextResponse(JSON.stringify({ error: "Too many requests." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // ── Route protection ───────────────────────────────────────────────────────
  const protectedRoutes = ["/dashboard", "/admin"];
  const adminRoutes = ["/admin"];

  if (protectedRoutes.some((r) => pathname.startsWith(r))) {
    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (adminRoutes.some((r) => pathname.startsWith(r)) && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ── Security headers ───────────────────────────────────────────────────────
  const res = NextResponse.next();

  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://cdn.discordapp.com https://avatars.githubusercontent.com",
      "connect-src 'self' https://api.stripe.com https://discord.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
    ].join("; ")
  );

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|moon.png|.*\\.svg).*)",
  ],
};
