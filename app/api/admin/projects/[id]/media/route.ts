import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { addProjectMedia } from "@/lib/db/collections";
import { mediaTypeSchema } from "@/lib/db/schemas";

const addMediaSchema = z.object({
  mediaType: mediaTypeSchema,
  storageKey: z.string().min(1),
  title: z.string().optional(),
  fileSizeBytes: z.number().optional(),
  mimeType: z.string().optional(),
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

  const body = addMediaSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      { error: "Datos inválidos." },
      { status: 400 },
    );
  }

  await addProjectMedia(id, {
    id: randomUUID(),
    mediaType: body.data.mediaType,
    storageKey: body.data.storageKey,
    title: body.data.title,
    sortOrder: 0,
    fileSizeBytes: body.data.fileSizeBytes,
    mimeType: body.data.mimeType,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}