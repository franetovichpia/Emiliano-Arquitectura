import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { updateProjectCategoryProgress } from "@/lib/db/collections";
import { categoryProgressEntrySchema } from "@/lib/db/schemas";

const updateCategoryProgressSchema = z.object({
  categoryProgress: z.record(
    z.string(),
    categoryProgressEntrySchema,
  ),
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

  const body = updateCategoryProgressSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      { error: "Datos inválidos." },
      { status: 400 },
    );
  }

  await updateProjectCategoryProgress(
    id,
    body.data.categoryProgress,
  );

  return NextResponse.json({ ok: true });
}