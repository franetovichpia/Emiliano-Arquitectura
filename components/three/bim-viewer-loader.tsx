"use client";

import dynamic from "next/dynamic";

import type { BimModelFormat } from "@/data/bim-projects";
import type { BimMaterialInfo, MaterialFinish } from "@/lib/db/schemas";

type BimViewerLoaderProps = {
  modelFormat: BimModelFormat;
  modelName: string;
  modelUrl: string;
  materials?: readonly BimMaterialInfo[];
  materialOverrides?: Record<string, MaterialFinish>;
};

const BimViewer = dynamic(
  () =>
    import("@/components/three/bim-viewer").then(
      (module) => module.BimViewer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[38rem] place-items-center bg-blueprint-deep text-ivory">
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

export function BimViewerLoader({
  modelFormat,
  modelName,
  modelUrl,
  materials,
  materialOverrides,
}: BimViewerLoaderProps) {
  return (
    <BimViewer
      materialOverrides={materialOverrides}
      materials={materials}
      modelFormat={modelFormat}
      modelName={modelName}
      modelUrl={modelUrl}
    />
  );
}