import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import {
  isProjectSlugTaken,
  updateProjectInfo,
  updateProjectStatus,
  updateProjectTitleAndSlug,
} from "@/lib/db/collections";
import { projectStatusSchema } from "@/lib/db/schemas";

const patchSchema = z.object({
  status: projectStatusSchema.optional(),
  title: z
    .string()
    .trim()
    .min(2, "Ingresá un título.")
    .optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Solo minúsculas, números y guiones.",
    )
    .optional(),
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

  const { status, title, slug, ...info } =
    body.data;

  if (status) {
    await updateProjectStatus(id, status);
  }

  if (title || slug) {
    if (!title || !slug) {
      return NextResponse.json(
        {
          error:
            "El título y el slug se guardan juntos.",
        },
        { status: 400 },
      );
    }

    const slugTaken = await isProjectSlugTaken(
      slug,
      id,
    );

    if (slugTaken) {
      return NextResponse.json(
        {
          error:
            "Ese slug ya está en uso por otro proyecto.",
        },
        { status: 409 },
      );
    }

    await updateProjectTitleAndSlug(id, {
      title,
      slug,
    });
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