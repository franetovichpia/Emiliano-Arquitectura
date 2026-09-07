import type { Collection, WithId } from "mongodb";

import { requireAdminSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/mongodb";
import type {
  AdminUser,
  BimAnalysisData,
  BimConstructionProgress,
  Project,
  ProjectCategory,
} from "@/lib/db/schemas";

export async function getProjectsCollection(): Promise<
  Collection<Project>
> {
  const db = await getDb();
  return db.collection<Project>("projects");
}

export async function getProjectCategoriesCollection(): Promise<
  Collection<ProjectCategory>
> {
  const db = await getDb();
  return db.collection<ProjectCategory>("projectCategories");
}

export async function getBimAnalysisDataCollection(): Promise<
  Collection<BimAnalysisData>
> {
  const db = await getDb();
  return db.collection<BimAnalysisData>("bimAnalysisData");
}

export async function getBimConstructionProgressCollection(): Promise<
  Collection<BimConstructionProgress>
> {
  const db = await getDb();
  return db.collection<BimConstructionProgress>(
    "bimConstructionProgress",
  );
}

export async function getAdminUsersCollection(): Promise<
  Collection<AdminUser>
> {
  const db = await getDb();
  return db.collection<AdminUser>("adminUsers");
}

export async function listPublicProjects(
  categorySlug?: string,
): Promise<WithId<Project>[]> {
  const projects = await getProjectsCollection();

  return projects
    .find({
      status: "publicado",
      ...(categorySlug ? { categorySlug } : {}),
    })
    .sort({ sortOrder: 1, publishedAt: -1 })
    .toArray();
}

export async function getPublicProjectBySlug(
  slug: string,
): Promise<WithId<Project> | null> {
  const projects = await getProjectsCollection();
  return projects.findOne({ slug, status: "publicado" });
}

export async function getAdminProjectBySlug(
  slug: string,
): Promise<WithId<Project> | null> {
  const session = await requireAdminSession();

  if (!session) {
    return null;
  }

  const projects = await getProjectsCollection();
  return projects.findOne({ slug });
}