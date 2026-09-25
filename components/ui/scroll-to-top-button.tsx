"use client";

import { ArrowUp } from "lucide-react";

type ScrollToTopButtonProps = {
  className?: string;
};

export function ScrollToTopButton({
  className,
}: ScrollToTopButtonProps) {
  return (
    <button
      aria-label="Volver al inicio de la página"
      className={className}
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
      type="button"
    >
      Volver arriba

      <ArrowUp
        aria-hidden="true"
        size={14}
        strokeWidth={1.6}
      />
    </button>
  );
}