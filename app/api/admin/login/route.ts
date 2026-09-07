import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { createAdminSession } from "@/lib/auth/session";
import { getAdminUsersCollection } from "@/lib/db/collections";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = loginSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      { error: "Datos inválidos." },
      { status: 400 },
    );
  }

  const { email, password } = body.data;

  const adminUsers = await getAdminUsersCollection();
  const user = await adminUsers.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    return NextResponse.json(
      { error: "Credenciales incorrectas." },
      { status: 401 },
    );
  }

  const isValidPassword = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  if (!isValidPassword) {
    return NextResponse.json(
      { error: "Credenciales incorrectas." },
      { status: 401 },
    );
  }

  await createAdminSession({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return NextResponse.json({ ok: true });
}