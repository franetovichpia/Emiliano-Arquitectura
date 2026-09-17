import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { addConstructionProgressEntry } from "@/lib/db/collections";

const addProgressSchema = z.object({
  stageName: z.string().min(1),
  plannedPercentage: z.number().min(0).max(100),
  actualPercentage: z.number().min(0).max(100),
  recordDate: z.coerce.date(),
  notes: z.string().optional(),
  sortOrder: z.number().optional(),
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

  const body = addProgressSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      { error: "Datos inválidos." },
      { status: 400 },
    );
  }

  const entry = await addConstructionProgressEntry({
    projectId: id,
    ...body.data,
  });

  return NextResponse.json({
    ok: true,
    entry: {
      ...entry,
      _id: entry._id.toString(),
    },
  });
}