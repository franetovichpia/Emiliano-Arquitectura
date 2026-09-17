import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { setProjectBimModel } from "@/lib/db/collections";
import {
  bimModelFormatSchema,
  materialFinishSchema,
} from "@/lib/db/schemas";

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