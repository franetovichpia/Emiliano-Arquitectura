"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import {
  CircleAlert,
  ImagePlus,
  Link2,
  Loader2,
} from "lucide-react";

import type { MediaType } from "@/lib/db/schemas";

type ProjectMediaUploaderProps = {
  projectId: string;
  projectSlug: string;
};

function detectMediaType(file: File): MediaType {
  if (file.type === "application/pdf") {
    return "pdf";
  }

  if (file.type.startsWith("image/")) {
    return "imagen";
  }

  return "documento";
}

export function ProjectMediaUploader({
  projectId,
  projectSlug,
}: ProjectMediaUploaderProps) {
  const router = useRouter();

  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [uploadProgress, setUploadProgress] =
    useState<{
      current: number;
      total: number;
    } | null>(null);

  const isUploading = uploadProgress !== null;

  const [imageUrl, setImageUrl] = useState("");

  const [
    isUploadingFromUrl,
    setIsUploadingFromUrl,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const uploadSingleFile = async (file: File) => {
    const presignResponse = await fetch(
      "/api/admin/uploads/presign",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucket: "media",
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
        "No fue posible subir el archivo.",
      );
    }

    const saveResponse = await fetch(
      `/api/admin/projects/${projectId}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaType: detectMediaType(file),
          storageKey: key,
          title: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type,
        }),
      },
    );

    if (!saveResponse.ok) {
      throw new Error(
        "El archivo se subió pero no se pudo guardar en el proyecto.",
      );
    }
  };

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files ?? [],
    );
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    setError(null);

    const failedFileNames: string[] = [];

    for (
      let index = 0;
      index < files.length;
      index += 1
    ) {
      const file = files[index];

      setUploadProgress({
        current: index + 1,
        total: files.length,
      });

      try {
        await uploadSingleFile(file);
      } catch {
        failedFileNames.push(file.name);
      }
    }

    setUploadProgress(null);

    if (failedFileNames.length > 0) {
      setError(
        `No se pudieron subir: ${failedFileNames.join(", ")}`,
      );
    }

    router.refresh();
  };

  const handleUrlSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!imageUrl.trim()) {
      return;
    }

    setIsUploadingFromUrl(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/media-from-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: imageUrl.trim(),
            projectSlug,
          }),
        },
      );

      const payload: unknown = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof (
            payload as { error?: unknown }
          ).error === "string"
            ? (payload as { error: string })
                .error
            : "No fue posible traer esa imagen.";

        throw new Error(message);
      }

      setImageUrl("");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible traer esa imagen.",
      );
    } finally {
      setIsUploadingFromUrl(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          accept="image/*,application/pdf"
          className="hidden"
          multiple
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
        />

        <button
          className="glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white hover:border-white/35 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isUploading}
          onClick={() =>
            inputRef.current?.click()
          }
          type="button"
        >
          {isUploading ? (
            <Loader2
              aria-hidden="true"
              className="animate-spin"
              size={14}
            />
          ) : (
            <ImagePlus
              aria-hidden="true"
              size={14}
              strokeWidth={1.8}
            />
          )}
          {uploadProgress
            ? `Subiendo ${uploadProgress.current} de ${uploadProgress.total}...`
            : "Subir imágenes o PDF"}
        </button>
      </div>

      <form
        className="flex w-full max-w-md items-center gap-2"
        onSubmit={handleUrlSubmit}
      >
        <input
          className="min-h-10 flex-1 rounded-full border border-white/15 bg-white/[0.06] px-4 text-xs text-white outline-none placeholder:text-white/30 focus:border-terracotta"
          onChange={(event) =>
            setImageUrl(event.target.value)
          }
          placeholder="Pegar URL de una imagen (Behance, etc.)"
          type="url"
          value={imageUrl}
        />

        <button
          className="glass-interactive inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-4 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white hover:border-white/35 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={
            isUploadingFromUrl ||
            !imageUrl.trim()
          }
          type="submit"
        >
          {isUploadingFromUrl ? (
            <Loader2
              aria-hidden="true"
              className="animate-spin"
              size={13}
            />
          ) : (
            <Link2
              aria-hidden="true"
              size={13}
              strokeWidth={1.8}
            />
          )}
          Traer
        </button>
      </form>

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