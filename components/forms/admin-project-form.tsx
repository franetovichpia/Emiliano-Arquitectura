"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Save } from "lucide-react";
import { z } from "zod";

import { cn } from "@/utils/cn";

const zodiacLabels: Record<string, string> = {
  aries: "Aries",
  tauro: "Tauro",
  geminis: "Géminis",
  cancer: "Cáncer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  escorpio: "Escorpio",
  sagitario: "Sagitario",
  capricornio: "Capricornio",
  acuario: "Acuario",
  piscis: "Piscis",
};

const formSchema = z.object({
  title: z.string().trim().min(2, "Ingresá un título."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Solo minúsculas, números y guiones.",
    ),
  categorySlug: z.string().min(1, "Elegí una categoría."),
  zodiacSign: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function slugify(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputClasses =
  "min-h-13 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 text-sm text-paper outline-none backdrop-blur-xl transition-colors duration-300 placeholder:text-ivory/30 hover:border-white/25 focus:border-terracotta focus:bg-white/[0.1] focus:ring-2 focus:ring-terracotta/20";

const labelClasses =
  "mb-3 block text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-sage";

const errorClasses =
  "text-xs leading-5 text-[#ffb5a0]";

type AdminProjectFormProps = {
  categories: {
    slug: string;
    name: string;
  }[];
};

export function AdminProjectForm({
  categories,
}: AdminProjectFormProps) {
  const router = useRouter();

  const [isSlugTouched, setIsSlugTouched] =
    useState(false);

  const [formError, setFormError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      slug: "",
      categorySlug: categories[0]?.slug ?? "",
      zodiacSign: "",
    },
  });

  const categorySlug = watch("categorySlug");
  const slugValue = watch("slug");

  const onSubmit: SubmitHandler<FormValues> =
    async (values) => {
      setFormError(null);

      try {
        const response = await fetch(
          "/api/admin/projects",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...values,
              zodiacSign:
                values.zodiacSign || undefined,
            }),
          },
        );

        const payload: unknown = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          const message =
            payload &&
            typeof payload === "object" &&
            "error" in payload &&
            typeof (
              payload as { error?: unknown }
            ).error === "string"
              ? (payload as { error: string })
                  .error
              : "No fue posible crear el proyecto.";

          throw new Error(message);
        }

        router.push("/admin/projects?created=1");
        router.refresh();
      } catch (error: unknown) {
        setFormError(
          error instanceof Error
            ? error.message
            : "No fue posible crear el proyecto.",
        );
      }
    };

  return (
    <form
      className="w-full max-w-xl rounded-[2rem] border border-white/15 bg-white/[0.06] p-8 shadow-[0_2rem_6rem_rgb(0_0_0/0.35)] backdrop-blur-2xl sm:p-10"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-terracotta">
        Nuevo proyecto
      </p>

      <h1 className="mt-4 font-sans text-2xl font-light tracking-[-0.025em] text-paper sm:text-3xl">
        Crear proyecto
      </h1>

      <div className="mt-8 space-y-6">
        <div>
          <label
            className={labelClasses}
            htmlFor="project-title"
          >
            Título
          </label>

          <input
            aria-invalid={Boolean(errors.title)}
            className={inputClasses}
            id="project-title"
            placeholder="Nombre del proyecto"
            type="text"
            {...register("title", {
              onChange: (event) => {
                if (!isSlugTouched) {
                  setValue(
                    "slug",
                    slugify(
                      event.target.value,
                    ),
                    { shouldValidate: true },
                  );
                }
              },
            })}
          />

          {errors.title ? (
            <p
              className={cn(
                errorClasses,
                "mt-2",
              )}
              role="alert"
            >
              {errors.title.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className={labelClasses}
            htmlFor="project-slug"
          >
            URL (slug)
          </label>

          <input
            aria-invalid={Boolean(errors.slug)}
            className={inputClasses}
            id="project-slug"
            placeholder="mi-proyecto"
            type="text"
            {...register("slug", {
              onChange: () =>
                setIsSlugTouched(true),
            })}
          />

          <p className="mt-2 text-xs text-ivory/35">
            Va a quedar en /modelos/
            {slugValue || "..."}
          </p>

          {errors.slug ? (
            <p
              className={cn(
                errorClasses,
                "mt-2",
              )}
              role="alert"
            >
              {errors.slug.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className={labelClasses}
            htmlFor="project-category"
          >
            Categoría
          </label>

          <select
            className={cn(
              inputClasses,
              "appearance-none",
            )}
            id="project-category"
            {...register("categorySlug")}
          >
            {categories.map((category) => (
              <option
                className="bg-forest-deep text-paper"
                key={category.slug}
                value={category.slug}
              >
                {category.name}
              </option>
            ))}
          </select>

          {errors.categorySlug ? (
            <p
              className={cn(
                errorClasses,
                "mt-2",
              )}
              role="alert"
            >
              {errors.categorySlug.message}
            </p>
          ) : null}
        </div>

        {categorySlug === "astrocasas" ? (
          <div>
            <label
              className={labelClasses}
              htmlFor="project-zodiac"
            >
              Signo zodiacal
            </label>

            <select
              className={cn(
                inputClasses,
                "appearance-none",
              )}
              id="project-zodiac"
              {...register("zodiacSign")}
            >
              <option
                className="bg-forest-deep text-paper"
                value=""
              >
                Seleccionar
              </option>

              {Object.entries(
                zodiacLabels,
              ).map(([value, label]) => (
                <option
                  className="bg-forest-deep text-paper"
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {formError ? (
        <div
          className="mt-6 flex items-start gap-3 rounded-2xl border border-[#ffb5a0]/25 bg-[#ffb5a0]/10 p-4 text-sm leading-6 text-[#ffb5a0]"
          role="alert"
        >
          <CircleAlert
            aria-hidden="true"
            className="mt-0.5 shrink-0"
            size={18}
            strokeWidth={1.6}
          />

          <p>{formError}</p>
        </div>
      ) : null}

      <button
        className="glass-interactive mt-8 inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-terracotta px-7 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_1rem_3rem_rgb(184_98_69/0.24)] hover:border-white/35 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        <span>
          {isSubmitting
            ? "Creando"
            : "Crear proyecto"}
        </span>

        {isSubmitting ? (
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
          />
        ) : (
          <Save
            aria-hidden="true"
            size={16}
            strokeWidth={1.6}
          />
        )}
      </button>
    </form>
  );
}