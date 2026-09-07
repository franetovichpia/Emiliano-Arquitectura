"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ProjectListItem = {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  status: string;
  createdAt: string;
};

type ProjectsListClientProps = {
  projects: ProjectListItem[];
};

const statusLabels: Record<string, string> = {
  borrador: "Borrador",
  publicado: "Publicado",
  archivado: "Archivado",
};

const statusOptions = [
  { value: "todos", label: "Todos los estados" },
  { value: "borrador", label: "Borrador" },
  { value: "publicado", label: "Publicado" },
  { value: "archivado", label: "Archivado" },
];

const sortOptions = [
  { value: "newest", label: "Más nuevo primero" },
  { value: "oldest", label: "Más viejo primero" },
  { value: "title-asc", label: "Título: A-Z" },
  { value: "title-desc", label: "Título: Z-A" },
];

const selectClasses =
  "min-h-11 rounded-xl border border-white/15 bg-white/[0.07] px-4 text-xs text-paper outline-none focus:border-terracotta";

export function ProjectsListClient({
  projects,
}: ProjectsListClientProps) {
  const [statusFilter, setStatusFilter] =
    useState("todos");

  const [sortOption, setSortOption] =
    useState("newest");

  const visibleProjects = useMemo(() => {
    const filtered =
      statusFilter === "todos"
        ? projects
        : projects.filter(
            (project) =>
              project.status === statusFilter,
          );

    return [...filtered].sort((a, b) => {
      if (sortOption === "title-asc") {
        return a.title.localeCompare(
          b.title,
          "es",
        );
      }

      if (sortOption === "title-desc") {
        return b.title.localeCompare(
          a.title,
          "es",
        );
      }

      const aTime = new Date(
        a.createdAt,
      ).getTime();

      const bTime = new Date(
        b.createdAt,
      ).getTime();

      return sortOption === "oldest"
        ? aTime - bTime
        : bTime - aTime;
    });
  }, [projects, statusFilter, sortOption]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          className={selectClasses}
          onChange={(event) =>
            setStatusFilter(
              event.target.value,
            )
          }
          value={statusFilter}
        >
          {statusOptions.map((option) => (
            <option
              className="bg-forest-deep text-paper"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <select
          className={selectClasses}
          onChange={(event) =>
            setSortOption(event.target.value)
          }
          value={sortOption}
        >
          {sortOptions.map((option) => (
            <option
              className="bg-forest-deep text-paper"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-3">
        {visibleProjects.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-sm text-white/50">
            No hay proyectos que coincidan
            con este filtro.
          </p>
        ) : (
          visibleProjects.map((project) => (
            <Link
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-white/25 hover:bg-white/[0.07]"
              href={`/admin/projects/${project.id}`}
              key={project.id}
            >
              <div className="min-w-0">
                <p className="truncate text-base font-medium text-paper">
                  {project.title}
                </p>

                <p className="mt-1 text-xs text-white/40">
                  /{project.slug} ·{" "}
                  {project.categorySlug}
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white/70">
                {statusLabels[
                  project.status
                ] ?? project.status}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}