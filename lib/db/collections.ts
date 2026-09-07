import { ObjectId } from "mongodb";
import type { Collection, WithId } from "mongodb";

import { requireAdminSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/mongodb";
import type {
  AdminUser,
  BimAnalysisData,
  BimConstructionProgress,
  Project,
  ProjectCategory,
  ProjectMedia,
  ProjectStatus,
  ZodiacSign,
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

export type AdminProjectsSort =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc";

type ListAdminProjectsOptions = {
  status?: ProjectStatus;
  sort?: AdminProjectsSort;
};

const sortDefinitions: Record<
  AdminProjectsSort,
  Record<string, 1 | -1>
> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "title-asc": { title: 1 },
  "title-desc": { title: -1 },
};

export async function listAdminProjects(
  options: ListAdminProjectsOptions = {},
): Promise<WithId<Project>[]> {
  const projects = await getProjectsCollection();

  const filter = options.status
    ? { status: options.status }
    : {};

  const sort =
    sortDefinitions[options.sort ?? "newest"];

  return projects
    .find(filter)
    .collation({ locale: "es", strength: 2 })
    .sort(sort)
    .toArray();
}

export async function getAdminProjectById(
  id: string,
): Promise<WithId<Project> | null> {
  const projects = await getProjectsCollection();
  return projects.findOne({ _id: new ObjectId(id) });
}

export async function listProjectCategories(): Promise<
  WithId<ProjectCategory>[]
> {
  const categories = await getProjectCategoriesCollection();
  return categories.find({}).sort({ sortOrder: 1 }).toArray();
}

type CreateProjectInput = {
  slug: string;
  title: string;
  categorySlug: string;
  zodiacSign?: ZodiacSign;
  createdBy?: string;
};

export async function createProject(
  input: CreateProjectInput,
): Promise<WithId<Project>> {
  const projects = await getProjectsCollection();
  const now = new Date();

  const doc: Project = {
    slug: input.slug,
    title: input.title,
    categorySlug: input.categorySlug,
    zodiacSign: input.zodiacSign,
    status: "borrador",
    hasIfc: false,
    media: [],
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  };

  const result = await projects.insertOne(doc);

  return { _id: result.insertedId, ...doc };
}

export async function updateProjectStatus(
  id: string,
  status: ProjectStatus,
): Promise<void> {
  const projects = await getProjectsCollection();
  const now = new Date();

  await projects.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status,
        updatedAt: now,
        ...(status === "publicado"
          ? { publishedAt: now }
          : {}),
      },
    },
  );
}

export async function addProjectMedia(
  id: string,
  media: ProjectMedia,
): Promise<void> {
  const projects = await getProjectsCollection();

  await projects.updateOne(
    { _id: new ObjectId(id) },
    {
      $push: { media },
      $set: { updatedAt: new Date() },
    },
  );
}