"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

type ProjectMediaDeleteButtonProps = {
  projectId: string;
  mediaId: string;
  mediaTitle: string;
};

export function ProjectMediaDeleteButton({
  projectId,
  mediaId,
  mediaTitle,
}: ProjectMediaDeleteButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] =
    useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `¿Eliminar "${mediaTitle}"?`,
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/media/${mediaId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        return;
      }

      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      aria-label={`Eliminar ${mediaTitle}`}
      className="absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-full border border-white/20 bg-blueprint-deep/75 text-ivory backdrop-blur-md transition-colors hover:border-red-400/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isDeleting}
      onClick={(event) => {
        event.preventDefault();
        void handleDelete();
      }}
      type="button"
    >
      {isDeleting ? (
        <Loader2
          aria-hidden="true"
          className="animate-spin"
          size={13}
        />
      ) : (
        <Trash2 aria-hidden="true" size={13} />
      )}
    </button>
  );
}