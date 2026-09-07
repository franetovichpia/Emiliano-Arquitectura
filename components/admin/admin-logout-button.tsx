"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const router = useRouter();

  const [isLoading, setIsLoading] =
    useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      className="glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isLoading}
      onClick={handleLogout}
      type="button"
    >
      <LogOut
        aria-hidden="true"
        size={15}
        strokeWidth={1.6}
      />
      Cerrar sesión
    </button>
  );
}