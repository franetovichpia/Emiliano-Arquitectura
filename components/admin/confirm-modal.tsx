"use client";

import { useEffect } from "react";
import { Loader2, TriangleAlert } from "lucide-react";

type ConfirmModalProps = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  title,
  description,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [onCancel]);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0c2438] p-6 shadow-[0_2rem_5rem_rgb(0_0_0/0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-red-400/30 bg-red-400/10 text-red-300">
            <TriangleAlert
              aria-hidden="true"
              size={16}
              strokeWidth={1.8}
            />
          </span>

          <p className="text-sm font-semibold text-paper">
            {title}
          </p>
        </div>

        {description ? (
          <p className="mt-3 text-xs leading-5 text-white/50">
            {description}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            className="min-h-10 rounded-full border border-white/15 px-4 text-[0.62rem] font-semibold uppercase tracking-[0.11em] text-white/70 hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>

          <button
            className="glass-interactive inline-flex min-h-10 items-center gap-2 rounded-full border border-red-400/40 bg-red-500/80 px-4 text-[0.62rem] font-semibold uppercase tracking-[0.11em] text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            onClick={onConfirm}
            type="button"
          >
            {isLoading ? (
              <Loader2
                aria-hidden="true"
                className="animate-spin"
                size={13}
              />
            ) : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}