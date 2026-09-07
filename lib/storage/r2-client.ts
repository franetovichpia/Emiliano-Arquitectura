import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!accountId || !accessKeyId || !secretAccessKey) {
  throw new Error(
    "Faltan variables de entorno de Cloudflare R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).",
  );
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const r2Buckets = {
  media: process.env.R2_BUCKET_MEDIA ?? "project-media",
  bim: process.env.R2_BUCKET_BIM ?? "bim-models",
} as const;

const publicBaseUrls = {
  media: process.env.R2_PUBLIC_BASE_URL_MEDIA,
  bim: process.env.R2_PUBLIC_BASE_URL_BIM,
} as const;

export function getPublicUrl(
  bucketKind: keyof typeof publicBaseUrls,
  key: string,
) {
  const base = publicBaseUrls[bucketKind];

  if (!base) {
    throw new Error(
      `Falta la URL pública configurada para el bucket "${bucketKind}".`,
    );
  }

  return `${base.replace(/\/$/, "")}/${key}`;
}