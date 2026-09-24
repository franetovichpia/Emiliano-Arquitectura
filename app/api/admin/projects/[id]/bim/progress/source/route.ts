import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { setProjectProgressSource } from "@/lib/db/collections";
import { progressSourceSchema } from "@/lib/db/schemas";

const updateSourceSchema = z.object({
  source: progressSourceSchema,
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 },
    );
  }

  const { id } = await params;

  const body = updateSourceSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      { error: "Datos inválidos." },
      { status: 400 },
    );
  }

  await setProjectProgressSource(
    id,
    body.data.source,
  );

  return NextResponse.json({ ok: true });
}