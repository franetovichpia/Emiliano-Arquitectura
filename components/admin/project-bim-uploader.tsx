"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import {
  CircleAlert,
  Loader2,
  UploadCloud,
} from "lucide-react";

type ProjectBimUploaderProps = {
  projectId: string;
  projectSlug: string;
};

type UploadStage =
  | "subiendo"
  | "analizando"
  | "guardando";

const stageLabels: Record<UploadStage, string> = {
  subiendo: "Subiendo archivo IFC...",
  analizando: "Analizando materiales...",
  guardando: "Guardando en el proyecto...",
};

export function ProjectBimUploader({
  projectId,
  projectSlug,
}: ProjectBimUploaderProps) {
  const router = useRouter();

  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [stage, setStage] =
    useState<UploadStage | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setError(null);

    try {
      setStage("subiendo");

      const presignResponse = await fetch(
        "/api/admin/uploads/presign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bucket: "bim",
            fileName: file.name,
            contentType:
              file.type ||
              "application/octet-stream",
            projectSlug,
          }),
        },
      );

      if (!presignResponse.ok) {
        throw new Error(
          "No fue posible preparar la subida.",
        );
      }

      const { uploadUrl, key } =
        (await presignResponse.json()) as {
          uploadUrl: string;
          key: string;
        };

      const uploadResponse = await fetch(
        uploadUrl,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              file.type ||
              "application/octet-stream",
          },
          body: file,
        },
      );

      if (!uploadResponse.ok) {
        throw new Error(
          "No fue posible subir el archivo IFC.",
        );
      }

      setStage("analizando");

      const buffer = new Uint8Array(
        await file.arrayBuffer(),
      );

      const { extractMaterialsFromModel } =
        await import(
          "@/components/three/bim-material-extraction"
        );

      const materials =
        await extractMaterialsFromModel(
          buffer,
          "ifc",
        );

      setStage("guardando");

      const saveResponse = await fetch(
        `/api/admin/projects/${projectId}/bim`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            format: "ifc",
            ifcStorageKey: key,
            fileSizeBytes: file.size,
            materials,
          }),
        },
      );

      if (!saveResponse.ok) {
        throw new Error(
          "El archivo se subió pero no se pudo guardar en el proyecto.",
        );
      }

      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible procesar el archivo IFC.",
      );
    } finally {
      setStage(null);
    }
  };

  const isBusy = stage !== null;

  return (
    <div className="flex flex-col items-end gap-3">
      <input
        accept=".ifc"
        className="hidden"
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
      />

      <button
        className="glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white hover:border-white/35 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isBusy}
        onClick={() =>
          inputRef.current?.click()
        }
        type="button"
      >
        {isBusy ? (
          <Loader2
            aria-hidden="true"
            className="animate-spin"
            size={14}
          />
        ) : (
          <UploadCloud
            aria-hidden="true"
            size={14}
            strokeWidth={1.8}
          />
        )}
        {stage
          ? stageLabels[stage]
          : "Subir archivo IFC"}
      </button>

      {error ? (
        <p
          className="flex items-center gap-2 text-xs text-[#ffb5a0]"
          role="alert"
        >
          <CircleAlert
            aria-hidden="true"
            size={14}
          />
          {error}
        </p>
      ) : null}
    </div>
  );
}