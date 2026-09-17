import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth/session";
import { deleteConstructionProgressEntry } from "@/lib/db/collections";

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

  const { entryId } = await params;

  await deleteConstructionProgressEntry(entryId);

  return NextResponse.json({ ok: true });
}