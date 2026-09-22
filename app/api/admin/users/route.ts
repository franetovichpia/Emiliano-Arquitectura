import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import {
  createAdminUser,
  isAdminEmailTaken,
} from "@/lib/db/collections";

const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
  fullName: z.string().trim().optional(),
  role: z.enum(["admin", "editor"]),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 403 },
    );
  }

  const body = createUserSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      { error: "Datos inválidos." },
      { status: 400 },
    );
  }

  const { email, password, fullName, role } =
    body.data;

  const emailTaken = await isAdminEmailTaken(
    email,
  );

  if (emailTaken) {
    return NextResponse.json(
      {
        error:
          "Ya existe un usuario con ese email.",
      },
      { status: 409 },
    );
  }

  const user = await createAdminUser({
    email,
    password,
    fullName,
    role,
  });

  return NextResponse.json({ user });
}