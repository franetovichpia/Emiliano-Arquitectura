import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { r2Buckets, r2Client } from "@/lib/storage/r2-client";

const presignRequestSchema = z.object({
  bucket: z.enum(["media", "bim"]),
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  projectSlug: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 },
    );
  }

  const body = presignRequestSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      { error: "Datos inválidos." },
      { status: 400 },
    );
  }

  const { bucket, fileName, contentType, projectSlug } =
    body.data;

  const sanitizedFileName = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-");

  const key = `${projectSlug}/${crypto.randomUUID()}-${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: r2Buckets[bucket],
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, {
    expiresIn: 60 * 10,
  });

  return NextResponse.json({ uploadUrl, key });
}