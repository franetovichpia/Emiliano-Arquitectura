import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth/session";
import { deleteAdminUser } from "@/lib/db/collections";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  const session = await requireAdminSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 403 },
    );
  }

  const { id } = await params;

  if (id === session.sub) {
    return NextResponse.json(
      {
        error:
          "No podés eliminar tu propia cuenta.",
      },
      { status: 400 },
    );
  }

  try {
    await deleteAdminUser(id);
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "No fue posible eliminar el usuario.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}