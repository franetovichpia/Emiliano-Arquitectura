import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdminProjectForm } from "@/components/forms/admin-project-form";
import { requireAdminSession } from "@/lib/auth/session";
import { listProjectCategories } from "@/lib/db/collections";

export const metadata: Metadata = {
  title: "Nuevo proyecto",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewAdminProjectPage() {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const categories = await listProjectCategories();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#071d31] px-4 py-16 text-white">
      <div className="mb-6 w-full max-w-md">
        <Link
          className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white/40 hover:text-white/70"
          href="/admin/projects"
        >
          <ArrowLeft
            aria-hidden="true"
            size={14}
            strokeWidth={1.8}
          />
          Volver a proyectos
        </Link>
      </div>

      <AdminProjectForm categories={categories} />
    </main>
  );
}