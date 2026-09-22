import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import type { Collection, WithId } from "mongodb";

import { requireAdminSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/mongodb";
import type {
  AdminUser,
  BimAnalysisData,
  BimConstructionProgress,
  BimMaterialInfo,
  BimModelFormatValue,
  MaterialFinish,
  Project,
  ProjectCategory,
  ProjectMedia,
  ProgressChartType,
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

export type AdminUserSummary = {
  id: string;
  email: string;
  fullName?: string;
  role: AdminUser["role"];
  createdAt: string;
};

export async function listAdminUsers(): Promise<
  AdminUserSummary[]
> {
  const adminUsers = await getAdminUsersCollection();

  const users = await adminUsers
    .find({})
    .sort({ createdAt: 1 })
    .toArray();

  return users.map((user) => ({
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }));
}

export async function isAdminEmailTaken(
  email: string,
): Promise<boolean> {
  const adminUsers = await getAdminUsersCollection();

  const existing = await adminUsers.findOne({
    email: email.toLowerCase(),
  });

  return existing !== null;
}

type CreateAdminUserInput = {
  email: string;
  password: string;
  fullName?: string;
  role: AdminUser["role"];
};

export async function createAdminUser(
  input: CreateAdminUserInput,
): Promise<AdminUserSummary> {
  const adminUsers = await getAdminUsersCollection();
  const passwordHash = await bcrypt.hash(
    input.password,
    12,
  );

  const now = new Date();

  const doc: AdminUser = {
    email: input.email.toLowerCase(),
    passwordHash,
    fullName: input.fullName,
    role: input.role,
    createdAt: now,
  };

  const result = await adminUsers.insertOne(doc);

  return {
    id: result.insertedId.toString(),
    email: doc.email,
    fullName: doc.fullName,
    role: doc.role,
    createdAt: now.toISOString(),
  };
}

export async function deleteAdminUser(
  id: string,
): Promise<void> {
  const adminUsers = await getAdminUsersCollection();

  const target = await adminUsers.findOne({
    _id: new ObjectId(id),
  });

  if (!target) {
    return;
  }

  if (target.role === "admin") {
    const adminCount =
      await adminUsers.countDocuments({
        role: "admin",
      });

    if (adminCount <= 1) {
      throw new Error(
        "No se puede eliminar el único usuario administrador.",
      );
    }
  }

  await adminUsers.deleteOne({
    _id: new ObjectId(id),
  });
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

export async function listPublicBimProjects(): Promise<
  WithId<Project>[]
> {
  const projects = await getProjectsCollection();

  return projects
    .find({ status: "publicado", hasIfc: true })
    .sort({ sortOrder: 1, publishedAt: -1 })
    .toArray();
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
    tools: [],
    media: [],
    progressChartType: "barra",
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

type UpdateProjectInfoInput = {
  summary?: string;
  location?: string;
  client?: string;
  yearCompleted?: number;
  areaM2?: number;
  tools?: string[];
  externalLink?: string;
};

export async function updateProjectInfo(
  id: string,
  input: UpdateProjectInfoInput,
): Promise<void> {
  const projects = await getProjectsCollection();

  await projects.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    },
  );
}

export async function isProjectSlugTaken(
  slug: string,
  excludeId: string,
): Promise<boolean> {
  const projects = await getProjectsCollection();

  const existing = await projects.findOne({
    slug,
    _id: { $ne: new ObjectId(excludeId) },
  });

  return existing !== null;
}

type UpdateProjectTitleSlugInput = {
  title: string;
  slug: string;
};

export async function updateProjectTitleAndSlug(
  id: string,
  input: UpdateProjectTitleSlugInput,
): Promise<void> {
  const projects = await getProjectsCollection();

  await projects.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: input.title,
        slug: input.slug,
        updatedAt: new Date(),
      },
    },
  );
}

type SetProjectBimModelInput = {
  format: BimModelFormatValue;
  ifcSchema?: string;
  ifcStorageKey: string;
  fileSizeBytes?: number;
  materials: BimMaterialInfo[];
};

export async function setProjectBimModel(
  id: string,
  input: SetProjectBimModelInput,
): Promise<void> {
  const projects = await getProjectsCollection();
  const now = new Date();

  await projects.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        hasIfc: true,
        updatedAt: now,
        bimModel: {
          format: input.format,
          ifcSchema: input.ifcSchema,
          status: "listo",
          ifcStorageKey: input.ifcStorageKey,
          fileSizeBytes: input.fileSizeBytes,
          materials: input.materials,
          materialOverrides: {},
          processedAt: now,
          updatedAt: now,
        },
      },
    },
  );
}

export async function updateProjectMaterialOverrides(
  id: string,
  overrides: Record<string, MaterialFinish>,
): Promise<void> {
  const projects = await getProjectsCollection();

  await projects.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        "bimModel.materialOverrides": overrides,
        "bimModel.updatedAt": new Date(),
        updatedAt: new Date(),
      },
    },
  );
}

type AddConstructionProgressInput = {
  projectId: string;
  stageName: string;
  plannedPercentage: number;
  actualPercentage: number;
  paidPercentage: number;
  recordDate: Date;
  notes?: string;
  sortOrder?: number;
};

export async function addConstructionProgressEntry(
  input: AddConstructionProgressInput,
): Promise<WithId<BimConstructionProgress>> {
  const progress = await getBimConstructionProgressCollection();

  const doc: BimConstructionProgress = {
    projectId: input.projectId,
    stageName: input.stageName,
    plannedPercentage: input.plannedPercentage,
    actualPercentage: input.actualPercentage,
    paidPercentage: input.paidPercentage,
    recordDate: input.recordDate,
    notes: input.notes,
    sortOrder: input.sortOrder ?? 0,
    createdAt: new Date(),
  };

  const result = await progress.insertOne(doc);

  return { _id: result.insertedId, ...doc };
}

export async function listConstructionProgress(
  projectId: string,
): Promise<WithId<BimConstructionProgress>[]> {
  const progress = await getBimConstructionProgressCollection();

  return progress
    .find({ projectId })
    .sort({ sortOrder: 1, recordDate: 1 })
    .toArray();
}

export async function deleteConstructionProgressEntry(
  entryId: string,
): Promise<void> {
  const progress = await getBimConstructionProgressCollection();

  await progress.deleteOne({
    _id: new ObjectId(entryId),
  });
}

export async function setProjectProgressChartType(
  id: string,
  chartType: ProgressChartType,
): Promise<void> {
  const projects = await getProjectsCollection();

  await projects.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        progressChartType: chartType,
        updatedAt: new Date(),
      },
    },
  );
}