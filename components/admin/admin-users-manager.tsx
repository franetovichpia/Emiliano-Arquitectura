"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircleAlert,
  Trash2,
  UserPlus,
} from "lucide-react";

import { cn } from "@/utils/cn";

type AdminUserRole = "admin" | "editor";

type AdminUserRow = {
  id: string;
  email: string;
  fullName?: string;
  role: AdminUserRole;
  createdAt: string;
};

type AdminUsersManagerProps = {
  currentUserId: string;
  initialUsers: readonly AdminUserRow[];
};

const inputClasses =
  "min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 text-sm text-paper outline-none focus:border-terracotta";

const labelClasses =
  "mb-2 block text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-sage";

export function AdminUsersManager({
  currentUserId,
  initialUsers,
}: AdminUsersManagerProps) {
  const router = useRouter();

  const [users, setUsers] = useState<
    AdminUserRow[]
  >([...initialUsers]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [role, setRole] =
    useState<AdminUserRole>("editor");

  const [isCreating, setIsCreating] =
    useState(false);

  const [createError, setCreateError] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  const handleCreate = async () => {
    setIsCreating(true);
    setCreateError(null);

    try {
      const response = await fetch(
        "/api/admin/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
            fullName:
              fullName.trim() || undefined,
            role,
          }),
        },
      );

      const body = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          body?.error ??
            "No fue posible crear el usuario.",
        );
      }

      setUsers((current) => [
        ...current,
        body.user as AdminUserRow,
      ]);

      setEmail("");
      setPassword("");
      setFullName("");
      setRole("editor");
      router.refresh();
    } catch (err: unknown) {
      setCreateError(
        err instanceof Error
          ? err.message
          : "No fue posible crear el usuario.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);

    try {
      const response = await fetch(
        `/api/admin/users/${id}`,
        { method: "DELETE" },
      );

      const body = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          body?.error ??
            "No fue posible eliminar el usuario.",
        );
      }

      setUsers((current) =>
        current.filter((user) => user.id !== id),
      );

      router.refresh();
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "No fue posible eliminar el usuario.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
          Usuarios con acceso ({users.length})
        </p>

        <div className="mt-4 divide-y divide-white/10">
          {users.map((user) => (
            <div
              className="flex flex-wrap items-center justify-between gap-3 py-3"
              key={user.id}
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-white/85">
                  {user.fullName || user.email}

                  {user.id === currentUserId ? (
                    <span className="ml-2 text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-sage">
                      Vos
                    </span>
                  ) : null}
                </p>

                <p className="mt-0.5 truncate text-xs text-white/45">
                  {user.email}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.1em]",
                    user.role === "admin"
                      ? "border-terracotta/50 bg-terracotta/15 text-terracotta"
                      : "border-white/20 text-white/60",
                  )}
                >
                  {user.role === "admin"
                    ? "Administrador"
                    : "Editor"}
                </span>

                <button
                  aria-label={`Eliminar a ${user.email}`}
                  className="grid size-8 place-items-center rounded-full border border-white/15 text-white/50 hover:border-[#ffb5a0]/50 hover:text-[#ffb5a0] disabled:cursor-not-allowed disabled:opacity-30"
                  disabled={
                    user.id === currentUserId ||
                    deletingId === user.id
                  }
                  onClick={() =>
                    void handleDelete(user.id)
                  }
                  type="button"
                >
                  <Trash2
                    aria-hidden="true"
                    size={14}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {deleteError ? (
          <p
            className="mt-3 flex items-center gap-2 text-xs text-[#ffb5a0]"
            role="alert"
          >
            <CircleAlert
              aria-hidden="true"
              size={14}
            />
            {deleteError}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
          Crear nuevo usuario
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              className={labelClasses}
              htmlFor="new-user-name"
            >
              Nombre
            </label>

            <input
              className={inputClasses}
              id="new-user-name"
              onChange={(event) =>
                setFullName(event.target.value)
              }
              type="text"
              value={fullName}
            />
          </div>

          <div>
            <label
              className={labelClasses}
              htmlFor="new-user-role"
            >
              Rol
            </label>

            <select
              className={inputClasses}
              id="new-user-role"
              onChange={(event) =>
                setRole(
                  event.target
                    .value as AdminUserRole,
                )
              }
              value={role}
            >
              <option
                className="bg-forest-deep text-paper"
                value="editor"
              >
                Editor
              </option>

              <option
                className="bg-forest-deep text-paper"
                value="admin"
              >
                Administrador
              </option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label
              className={labelClasses}
              htmlFor="new-user-email"
            >
              Email
            </label>

            <input
              className={inputClasses}
              id="new-user-email"
              onChange={(event) =>
                setEmail(event.target.value)
              }
              type="email"
              value={email}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              className={labelClasses}
              htmlFor="new-user-password"
            >
              Contraseña (mínimo 8 caracteres)
            </label>

            <input
              className={inputClasses}
              id="new-user-password"
              onChange={(event) =>
                setPassword(event.target.value)
              }
              type="password"
              value={password}
            />
          </div>
        </div>

        <button
          className="glass-interactive mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-terracotta px-5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={
            isCreating ||
            !email.trim() ||
            password.length < 8
          }
          onClick={() => void handleCreate()}
          type="button"
        >
          {isCreating
            ? "Creando"
            : "Crear usuario"}
          <UserPlus
            aria-hidden="true"
            size={14}
            strokeWidth={1.8}
          />
        </button>

        {createError ? (
          <p
            className="mt-3 flex items-center gap-2 text-xs text-[#ffb5a0]"
            role="alert"
          >
            <CircleAlert
              aria-hidden="true"
              size={14}
            />
            {createError}
          </p>
        ) : null}
      </div>
    </div>
  );
}