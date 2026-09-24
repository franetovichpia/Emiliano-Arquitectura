import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import {
  getAdminProjectById,
  removeProjectBimModel,
  setProjectBimModel,
} from "@/lib/db/collections";
import {
  bimModelFormatSchema,
  materialFinishSchema,
} from "@/lib/db/schemas";
import { deleteObject } from "@/lib/storage/r2-client";

const saveBimModelSchema = z.object({
  format: bimModelFormatSchema,
  ifcSchema: z.string().optional(),
  ifcStorageKey: z.string().min(1),
  fileSizeBytes: z.number().optional(),
  materials: z
    .array(
      z.object({
        key: z.string().min(1),
        name: z.string(),
        colorHex: z.string().optional(),
        opacity: z.number().optional(),
        suggestedFinish: materialFinishSchema.default("auto"),
      }),
    )
    .default([]),
  categories: z.array(z.string()).default([]),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
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

  const body = saveBimModelSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      { error: "Datos inválidos." },
      { status: 400 },
    );
  }

  await setProjectBimModel(id, body.data);

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
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
  const project = await getAdminProjectById(id);

  const storageKey =
    project?.bimModel?.ifcStorageKey ??
    project?.bimModel?.fragStorageKey;

  if (storageKey) {
    try {
      await deleteObject("bim", storageKey);
    } catch {
      // El registro en la base es la fuente de
      // verdad; si el borrado en R2 falla igual
      // sacamos el modelo del proyecto.
    }
  }

  await removeProjectBimModel(id);

  return NextResponse.json({ ok: true });
}