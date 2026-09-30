import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth/session";
import {
  deleteConstructionProgressEntry,
  getAdminProjectById,
} from "@/lib/db/collections";

type RouteContext = {
  params: Promise<{ id: string; entryId: string }>;
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

  const { id, entryId } = await params;

  await deleteConstructionProgressEntry(entryId);

  try {
    const project = await getAdminProjectById(id);

    if (project) {
      revalidatePath(`/modelos/${project.slug}`);
    }
  } catch {
    // La etapa ya se eliminó; si falla la
    // revalidación no debe tirar abajo el borrado.
  }

  return NextResponse.json({ ok: true });
}