"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  FileText,
  Square,
  Trash2,
} from "lucide-react";

import { ConfirmModal } from "@/components/admin/confirm-modal";

type MediaItem = {
  id: string;
  title: string;
  url: string;
  isImage: boolean;
};

type ProjectMediaGridProps = {
  projectId: string;
  media: readonly MediaItem[];
};

type PendingDelete = {
  ids: string[];
  title: string;
  description?: string;
};

export function ProjectMediaGrid({
  projectId,
  media,
}: ProjectMediaGridProps) {
  const router = useRouter();

  const [selectMode, setSelectMode] =
    useState(false);

  const [selectedIds, setSelectedIds] =
    useState<Set<string>>(new Set());

  const [pendingDelete, setPendingDelete] =
    useState<PendingDelete | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const toggleSelectMode = () => {
    setSelectMode((current) => !current);
    setSelectedIds(new Set());
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const askDeleteOne = (item: MediaItem) => {
    setPendingDelete({
      ids: [item.id],
      title: `¿Eliminar "${item.title}"?`,
      description:
        "Esta acción no se puede deshacer.",
    });
  };

  const askDeleteSelected = () => {
    if (selectedIds.size === 0) {
      return;
    }

    setPendingDelete({
      ids: Array.from(selectedIds),
      title: `¿Eliminar ${selectedIds.size} archivo${
        selectedIds.size === 1 ? "" : "s"
      }?`,
      description:
        "Esta acción no se puede deshacer.",
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await Promise.all(
        pendingDelete.ids.map((id) =>
          fetch(
            `/api/admin/projects/${projectId}/media/${id}`,
            { method: "DELETE" },
          ),
        ),
      );

      setSelectedIds(new Set());
      setSelectMode(false);
      setPendingDelete(null);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  if (media.length === 0) {
    return (
      <p className="mt-4 text-sm text-white/45">
        Todavía no subiste ninguna imagen ni
        documento.
      </p>
    );
  }

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          className="min-h-9 rounded-full border border-white/15 px-4 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white/70 hover:border-white/30"
          onClick={toggleSelectMode}
          type="button"
        >
          {selectMode
            ? "Cancelar selección"
            : "Seleccionar varias"}
        </button>

        {selectMode && selectedIds.size > 0 ? (
          <button
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-red-400/40 bg-red-500/15 px-4 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-red-300 hover:bg-red-500/25"
            onClick={askDeleteSelected}
            type="button"
          >
            <Trash2 aria-hidden="true" size={12} />
            Eliminar seleccionadas (
            {selectedIds.size})
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {media.map((item) => {
          const isSelected = selectedIds.has(
            item.id,
          );

          return (
            <div
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
              key={item.id}
            >
              {selectMode ? (
                <button
                  aria-label={
                    isSelected
                      ? `Deseleccionar ${item.title}`
                      : `Seleccionar ${item.title}`
                  }
                  className={`absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-full border backdrop-blur-md transition-colors ${
                    isSelected
                      ? "border-terracotta bg-terracotta text-white"
                      : "border-white/20 bg-blueprint-deep/75 text-ivory hover:border-terracotta/50"
                  }`}
                  onClick={() =>
                    toggleSelected(item.id)
                  }
                  type="button"
                >
                  {isSelected ? (
                    <CheckSquare
                      aria-hidden="true"
                      size={14}
                    />
                  ) : (
                    <Square
                      aria-hidden="true"
                      size={14}
                    />
                  )}
                </button>
              ) : (
                <button
                  aria-label={`Eliminar ${item.title}`}
                  className="absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-full border border-white/20 bg-blueprint-deep/75 text-ivory backdrop-blur-md transition-colors hover:border-red-400/40 hover:text-red-300"
                  onClick={() =>
                    askDeleteOne(item)
                  }
                  type="button"
                >
                  <Trash2
                    aria-hidden="true"
                    size={13}
                  />
                </button>
              )}

              <a
                className="block size-full"
                href={
                  selectMode ? undefined : item.url
                }
                onClick={(event) => {
                  if (selectMode) {
                    event.preventDefault();
                    toggleSelected(item.id);
                  }
                }}
                rel="noreferrer"
                target="_blank"
              >
                {item.isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={item.title}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={item.url}
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 p-3 text-center">
                    <FileText
                      aria-hidden="true"
                      className="text-white/40"
                      size={22}
                      strokeWidth={1.5}
                    />

                    <span className="line-clamp-2 text-[0.6rem] text-white/50">
                      {item.title}
                    </span>
                  </div>
                )}
              </a>

              {isSelected ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 border-2 border-terracotta"
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {pendingDelete ? (
        <ConfirmModal
          description={pendingDelete.description}
          isLoading={isDeleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => void confirmDelete()}
          title={pendingDelete.title}
        />
      ) : null}
    </>
  );
}