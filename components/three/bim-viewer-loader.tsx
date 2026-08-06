"use client";

import dynamic from "next/dynamic";

const BimViewer = dynamic(
  () =>
    import("@/components/three/bim-viewer").then(
      (module) => module.BimViewer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[38rem] place-items-center bg-forest-deep text-ivory">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-2 border-sage/25 border-t-sage" />

          <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sage">
            Preparando entorno OpenBIM
          </p>
        </div>
      </div>
    ),
  },
);

export function BimViewerLoader() {
  return <BimViewer />;
}