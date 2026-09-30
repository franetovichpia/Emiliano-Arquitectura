"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyLinkButtonProps = {
  path: string;
};

export function CopyLinkButton({
  path,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}${path}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(
        () => setCopied(false),
        2000,
      );
    } catch {
      // El navegador no permitió usar el
      // portapapeles; no hay más que hacer acá.
    }
  };

  return (
    <button
      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white/70 hover:border-terracotta/50 hover:text-white"
      onClick={() => void handleCopy()}
      type="button"
    >
      {copied ? (
        <>
          <Check aria-hidden="true" size={12} />
          Copiado
        </>
      ) : (
        <>
          <Copy aria-hidden="true" size={12} />
          Copiar link
        </>
      )}
    </button>
  );
}