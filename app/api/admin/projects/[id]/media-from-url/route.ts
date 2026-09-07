import { randomUUID } from "node:crypto";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { addProjectMedia } from "@/lib/db/collections";
import { r2Buckets, r2Client } from "@/lib/storage/r2-client";

const bodySchema = z.object({
  imageUrl: z.string().url("Ingresá una URL válida."),
  projectSlug: z.string().min(1),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getFileNameFromUrl(url: string) {
  try {
    const pathname = new URL(url).pathname;
    const lastSegment = pathname.split("/").pop();
    return lastSegment && lastSegment.length > 0
      ? lastSegment
      : "imagen";
  } catch {
    return "imagen";
  }
}

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

  const body = bodySchema.safeParse(
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

  const { imageUrl, projectSlug } = body.data;

  let imageResponse: Response;

  try {
    imageResponse = await fetch(imageUrl);
  } catch {
    return NextResponse.json(
      {
        error:
          "No fue posible descargar esa URL.",
      },
      { status: 400 },
    );
  }

  if (!imageResponse.ok) {
    return NextResponse.json(
      {
        error: `La URL respondió con error (${imageResponse.status}). Verificá que sea pública y accesible.`,
      },
      { status: 400 },
    );
  }

  const contentType =
    imageResponse.headers.get("content-type") ??
    "application/octet-stream";

  if (!contentType.startsWith("image/")) {
    return NextResponse.json(
      {
        error:
          "Esa URL no parece ser una imagen (revisá el enlace).",
      },
      { status: 400 },
    );
  }

  const arrayBuffer =
    await imageResponse.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  const fileName = getFileNameFromUrl(imageUrl);
  const key = `${projectSlug}/${randomUUID()}-${fileName}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: r2Buckets.media,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  await addProjectMedia(id, {
    id: randomUUID(),
    mediaType: "imagen",
    storageKey: key,
    title: fileName,
    sortOrder: 0,
    fileSizeBytes: buffer.byteLength,
    mimeType: contentType,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}