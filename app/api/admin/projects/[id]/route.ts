import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import {
  updateProjectInfo,
  updateProjectStatus,
} from "@/lib/db/collections";
import { projectStatusSchema } from "@/lib/db/schemas";

const patchSchema = z.object({
  status: projectStatusSchema.optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  client: z.string().optional(),
  yearCompleted: z.number().optional(),
  areaM2: z.number().optional(),
  tools: z.array(z.string()).optional(),
  externalLink: z
    .union([z.string().url(), z.literal("")])
    .optional(),
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

  const body = patchSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      { error: "Datos inválidos." },
      { status: 400 },
    );
  }

  const { status, ...info } = body.data;

  if (status) {
    await updateProjectStatus(id, status);
  }

  if (Object.keys(info).length > 0) {
    await updateProjectInfo(id, {
      ...info,
      externalLink:
        info.externalLink || undefined,
    });
  }

  return NextResponse.json({ ok: true });
}