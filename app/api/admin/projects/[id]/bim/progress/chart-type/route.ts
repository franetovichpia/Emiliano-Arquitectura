import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import {
  getAdminProjectById,
  setProjectProgressChartType,
} from "@/lib/db/collections";
import { progressChartTypeSchema } from "@/lib/db/schemas";
import { revalidateProjectPages } from "@/lib/revalidate-project";

const updateChartTypeSchema = z.object({
  chartType: progressChartTypeSchema,
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
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

  const body = updateChartTypeSchema.safeParse(
    await request.json(),
  );

  if (!body.success) {
    return NextResponse.json(
      { error: "Datos inválidos." },
      { status: 400 },
    );
  }

  await setProjectProgressChartType(
    id,
    body.data.chartType,
  );

  const project = await getAdminProjectById(id);

  if (project) {
    revalidateProjectPages(project.slug);
  }

  return NextResponse.json({ ok: true });
}