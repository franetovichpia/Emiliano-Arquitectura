import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth/session";
import {
  getAdminProjectById,
  removeProjectMedia,
} from "@/lib/db/collections";
import { deleteObject } from "@/lib/storage/r2-client";

type RouteContext = {
  params: Promise<{ id: string; mediaId: string }>;
};

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

  const { id, mediaId } = await params;
  const project = await getAdminProjectById(id);

  const item = project?.media.find(
    (media) => media.id === mediaId,
  );

  if (item) {
    try {
      await deleteObject("media", item.storageKey);
    } catch {
      // El registro en la base es la fuente de
      // verdad; si el borrado en R2 falla igual
      // sacamos el archivo del proyecto.
    }
  }

  await removeProjectMedia(id, mediaId);

  return NextResponse.json({ ok: true });
}