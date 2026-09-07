import { z } from "zod";

export const projectStatusSchema = z.enum([
  "borrador",
  "publicado",
  "archivado",
]);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const mediaTypeSchema = z.enum([
  "imagen",
  "render",
  "pdf",
  "documento",
]);
export type MediaType = z.infer<typeof mediaTypeSchema>;

export const bimModelFormatSchema = z.enum(["ifc", "frag"]);
export type BimModelFormatValue = z.infer<typeof bimModelFormatSchema>;

export const bimModelStatusSchema = z.enum([
  "procesando",
  "listo",
  "error",
]);
export type BimModelStatusValue = z.infer<typeof bimModelStatusSchema>;

export const zodiacSignSchema = z.enum([
  "aries", "tauro", "geminis", "cancer", "leo", "virgo",
  "libra", "escorpio", "sagitario", "capricornio", "acuario", "piscis",
]);
export type ZodiacSign = z.infer<typeof zodiacSignSchema>;

export const projectMediaSchema = z.object({
  id: z.string(),
  mediaType: mediaTypeSchema,
  storageKey: z.string(),
  title: z.string().optional(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  sortOrder: z.number().default(0),
  fileSizeBytes: z.number().optional(),
  mimeType: z.string().optional(),
  createdAt: z.date(),
});
export type ProjectMedia = z.infer<typeof projectMediaSchema>;

export const bimModelSchema = z.object({
  format: bimModelFormatSchema,
  ifcSchema: z.string().optional(),
  status: bimModelStatusSchema.default("procesando"),
  ifcStorageKey: z.string().optional(),
  fragStorageKey: z.string().optional(),
  fileSizeBytes: z.number().optional(),
  processedAt: z.date().optional(),
  errorMessage: z.string().optional(),
  updatedAt: z.date(),
});
export type BimModel = z.infer<typeof bimModelSchema>;

export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  categorySlug: z.string(),
  zodiacSign: zodiacSignSchema.optional(),
  status: projectStatusSchema.default("borrador"),
  hasIfc: z.boolean().default(false),
  summary: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  client: z.string().optional(),
  yearCompleted: z.number().optional(),
  areaM2: z.number().optional(),
  coverMediaId: z.string().optional(),
  media: z.array(projectMediaSchema).default([]),
  bimModel: bimModelSchema.optional(),
  sortOrder: z.number().default(0),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Project = z.infer<typeof projectSchema>;

export const projectCategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  sortOrder: z.number().default(0),
});
export type ProjectCategory = z.infer<typeof projectCategorySchema>;

export const bimAnalysisDataSchema = z.object({
  projectId: z.string(),
  ifcGlobalId: z.string().optional(),
  category: z.string(),
  family: z.string().optional(),
  ifcClass: z.string().optional(),
  quantity: z.number().default(1),
  lengthM: z.number().optional(),
  areaM2: z.number().optional(),
  volumeM3: z.number().optional(),
  phaseCreated: z.string().optional(),
  phaseDemolished: z.string().optional(),
  material: z.string().optional(),
  levelName: z.string().optional(),
  extraProperties: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.date(),
});
export type BimAnalysisData = z.infer<typeof bimAnalysisDataSchema>;

export const bimConstructionProgressSchema = z.object({
  projectId: z.string(),
  stageName: z.string(),
  plannedPercentage: z.number().default(0),
  actualPercentage: z.number().default(0),
  recordDate: z.date(),
  notes: z.string().optional(),
  sortOrder: z.number().default(0),
  createdAt: z.date(),
});
export type BimConstructionProgress = z.infer<
  typeof bimConstructionProgressSchema
>;

export const adminUserSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string(),
  fullName: z.string().optional(),
  role: z.enum(["admin", "editor"]).default("admin"),
  createdAt: z.date(),
});
export type AdminUser = z.infer<typeof adminUserSchema>;