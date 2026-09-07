"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

type ProjectCreatedBannerProps = {
  show: boolean;
};

export function ProjectCreatedBanner({
  show,
}: ProjectCreatedBannerProps) {
  const router = useRouter();

  const [isVisible, setIsVisible] =
    useState(show);

  useEffect(() => {
    if (!show) {
      return;
    }

    router.replace("/admin/projects");

    const timeout = setTimeout(
      () => setIsVisible(false),
      4000,
    );

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="mb-6 flex items-center gap-3 rounded-2xl border border-sage/25 bg-sage/10 p-4 text-sm text-sage"
      role="status"
    >
      <CheckCircle2
        aria-hidden="true"
        size={18}
        strokeWidth={1.6}
      />
      Proyecto cargado correctamente.
    </div>
  );
}