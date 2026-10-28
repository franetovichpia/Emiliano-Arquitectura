import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import {
  getAdminProjectById,
  updateProjectMaterialOverrides,
} from "@/lib/db/collections";
import { materialFinishSchema } from "@/lib/db/schemas";
import { revalidateProjectPages } from "@/lib/revalidate-project";

const updateOverridesSchema = z.object({
  overrides: z.record(z.string(), materialFinishSchema),
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

  const body = updateOverridesSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      { error: "Datos inválidos." },
      { status: 400 },
    );
  }

  await updateProjectMaterialOverrides(
    id,
    body.data.overrides,
  );

  const project = await getAdminProjectById(id);

  if (project) {
    revalidateProjectPages(project.slug);
  }

  return NextResponse.json({ ok: true });
}