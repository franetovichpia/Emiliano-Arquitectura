import type { Metadata } from "next";
import { redirect } from "next/navigation";

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
    <main className="flex min-h-screen items-center justify-center bg-[#071d31] px-4 py-16 text-white">
      <AdminProjectForm categories={categories} />
    </main>
  );
}