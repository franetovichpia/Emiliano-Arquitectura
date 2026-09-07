"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleAlert,
  LogIn,
} from "lucide-react";

import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "@/lib/validations/admin-login";
import { cn } from "@/utils/cn";

const inputClasses =
  "min-h-13 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 text-sm text-paper outline-none backdrop-blur-xl transition-colors duration-300 placeholder:text-ivory/30 hover:border-white/25 focus:border-terracotta focus:bg-white/[0.1] focus:ring-2 focus:ring-terracotta/20";

const labelClasses =
  "mb-3 block text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-sage";

const errorClasses =
  "text-xs leading-5 text-[#ffb5a0]";

export function AdminLoginForm() {
  const router = useRouter();

  const [formError, setFormError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<
    AdminLoginFormValues
  > = async (values) => {
    setFormError(null);

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
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
          typeof (payload as { error?: unknown })
            .error === "string"
            ? (payload as { error: string }).error
            : "No fue posible iniciar sesión.";

        throw new Error(message);
      }

      router.push("/admin");
      router.refresh();
    } catch (error: unknown) {
      setFormError(
        error instanceof Error
          ? error.message
          : "No fue posible iniciar sesión.",
      );
    }
  };

  return (
    <form
      className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/[0.06] p-8 shadow-[0_2rem_6rem_rgb(0_0_0/0.35)] backdrop-blur-2xl sm:p-10"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-terracotta">
        Panel de administración
      </p>

      <h1 className="mt-4 font-sans text-2xl font-light tracking-[-0.025em] text-paper sm:text-3xl">
        Iniciar sesión
      </h1>

      <div className="mt-8 space-y-6">
        <div>
          <label
            className={labelClasses}
            htmlFor="admin-email"
          >
            Correo electrónico
          </label>

          <input
            aria-invalid={Boolean(errors.email)}
            autoComplete="username"
            className={inputClasses}
            id="admin-email"
            placeholder="nombre@correo.com"
            type="email"
            {...register("email")}
          />

          {errors.email ? (
            <p
              className={cn(errorClasses, "mt-2")}
              role="alert"
            >
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className={labelClasses}
            htmlFor="admin-password"
          >
            Contraseña
          </label>

          <input
            aria-invalid={Boolean(
              errors.password,
            )}
            autoComplete="current-password"
            className={inputClasses}
            id="admin-password"
            type="password"
            {...register("password")}
          />

          {errors.password ? (
            <p
              className={cn(errorClasses, "mt-2")}
              role="alert"
            >
              {errors.password.message}
            </p>
          ) : null}
        </div>
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
            ? "Ingresando"
            : "Ingresar"}
        </span>

        {isSubmitting ? (
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
          />
        ) : (
          <LogIn
            aria-hidden="true"
            size={16}
            strokeWidth={1.6}
          />
        )}
      </button>
    </form>
  );
}