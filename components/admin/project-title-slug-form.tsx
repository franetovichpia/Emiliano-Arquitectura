"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, CircleCheck, Save } from "lucide-react";

type ProjectTitleSlugFormProps = {
  projectId: string;
  initialTitle: string;
  initialSlug: string;
};

const inputClasses =
  "min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 text-sm text-paper outline-none focus:border-terracotta";

const labelClasses =
  "mb-2 block text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-sage";

function slugify(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjectTitleSlugForm({
  projectId,
  initialTitle,
  initialSlug,
}: ProjectTitleSlugFormProps) {
  const router = useRouter();

  const [title, setTitle] =
    useState(initialTitle);

  const [slug, setSlug] = useState(initialSlug);

  const [isSlugTouched, setIsSlugTouched] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [saved, setSaved] = useState(false);

  const hasChanges =
    title.trim() !== initialTitle ||
    slug !== initialSlug;

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const normalizedSlug = slugify(slug);

    if (trimmedTitle.length < 2) {
      setError(
        "Ingresá un título más largo.",
      );
      return;
    }

    if (!normalizedSlug) {
      setError(
        "Ingresá un slug válido.",
      );
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: trimmedTitle,
            slug: normalizedSlug,
          }),
        },
      );

      if (!response.ok) {
        const body = await response
          .json()
          .catch(() => null);

        throw new Error(
          body?.error ??
            "No fue posible guardar los cambios.",
        );
      }

      setTitle(trimmedTitle);
      setSlug(normalizedSlug);
      setSaved(true);
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible guardar los cambios.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
        Título y URL del proyecto
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            className={labelClasses}
            htmlFor="edit-project-title"
          >
            Título
          </label>

          <input
            className={inputClasses}
            id="edit-project-title"
            onChange={(event) => {
              setTitle(event.target.value);

              if (!isSlugTouched) {
                setSlug(
                  slugify(event.target.value),
                );
              }

              setSaved(false);
            }}
            type="text"
            value={title}
          />
        </div>

        <div>
          <label
            className={labelClasses}
            htmlFor="edit-project-slug"
          >
            URL (slug)
          </label>

          <input
            className={inputClasses}
            id="edit-project-slug"
            onChange={(event) => {
              setIsSlugTouched(true);
              setSlug(event.target.value);
              setSaved(false);
            }}
            type="text"
            value={slug}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-white/40">
        Página pública: /modelos/
        {slugify(slug) || "..."}
      </p>

      <p className="mt-2 text-[0.65rem] leading-5 text-[#efad94]">
        Cambiar el slug cambia la URL pública del
        proyecto. Los links que ya compartiste con
        ese slug van a dejar de funcionar.
      </p>

      <div className="mt-5 flex items-center gap-3">
        <button
          className="glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-terracotta px-5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSaving || !hasChanges}
          onClick={() => void handleSave()}
          type="button"
        >
          {isSaving
            ? "Guardando"
            : "Guardar cambios"}
          <Save
            aria-hidden="true"
            size={14}
            strokeWidth={1.8}
          />
        </button>

        {saved ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-sage">
            <CircleCheck
              aria-hidden="true"
              size={14}
            />
            Guardado
          </span>
        ) : null}
      </div>

      {error ? (
        <p
          className="mt-3 flex items-center gap-2 text-xs text-[#ffb5a0]"
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