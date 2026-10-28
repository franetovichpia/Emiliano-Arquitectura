import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth/session";
import {
  deleteConstructionProgressEntry,
  getAdminProjectById,
} from "@/lib/db/collections";
import { revalidateProjectPages } from "@/lib/revalidate-project";

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

  const project = await getAdminProjectById(id);

  if (project) {
    revalidateProjectPages(project.slug);
  }

  return NextResponse.json({ ok: true });
}