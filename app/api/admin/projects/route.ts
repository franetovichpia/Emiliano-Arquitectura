import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { createProject } from "@/lib/db/collections";
import { zodiacSignSchema } from "@/lib/db/schemas";

const createProjectSchema = z.object({
  title: z.string().trim().min(2, "Ingresá un título."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "La URL solo puede tener minúsculas, números y guiones.",
    ),
  categorySlug: z.string().min(1, "Elegí una categoría."),
  zodiacSign: zodiacSignSchema.optional(),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 },
    );
  }

  const body = createProjectSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      {
        error:
          body.error.issues[0]?.message ??
          "Datos inválidos.",
      },
      { status: 400 },
    );
  }

  try {
    const project = await createProject({
      title: body.data.title,
      slug: body.data.slug,
      categorySlug: body.data.categorySlug,
      zodiacSign: body.data.zodiacSign,
      createdBy: session.sub,
    });

    return NextResponse.json({
      id: project._id.toString(),
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        {
          error:
            "Ya existe un proyecto con esa URL. Elegí otra.",
        },
        { status: 409 },
      );
    }

    throw error;
  }
}