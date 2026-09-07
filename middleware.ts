import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { ADMIN_SESSION_COOKIE_NAME } from "@/lib/auth/session";

function getSecretKey() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "",
  );
}

export async function middleware(
  request: NextRequest,
) {
  if (
    !request.nextUrl.pathname.startsWith("/admin")
  ) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(
    ADMIN_SESSION_COOKIE_NAME,
  )?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
  }

  try {
    await jwtVerify(token, getSecretKey());
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};