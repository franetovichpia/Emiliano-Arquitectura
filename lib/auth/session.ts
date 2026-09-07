import "server-only";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const SESSION_COOKIE_NAME = "emiliano_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12; // 12 horas

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("Falta la variable de entorno AUTH_SECRET.");
  }

  return new TextEncoder().encode(secret);
}

export type AdminSessionPayload = {
  sub: string;
  email: string;
  role: "admin" | "editor";
};

export async function createAdminSession(
  payload: AdminSessionPayload,
) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAdminSession(): Promise<
  AdminSessionPayload | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      getSecretKey(),
    );

    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_COOKIE_NAME =
  SESSION_COOKIE_NAME;