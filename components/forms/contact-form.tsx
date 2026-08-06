"use client";

import { useState } from "react";
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Send,
} from "lucide-react";

import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { cn } from "@/utils/cn";

const inputClasses =
  "min-h-13 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 text-sm text-paper outline-none backdrop-blur-xl transition-colors duration-300 placeholder:text-ivory/30 hover:border-white/25 focus:border-terracotta focus:bg-white/[0.1] focus:ring-2 focus:ring-terracotta/20";

const labelClasses =
  "mb-3 block text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-sage";

const errorClasses =
  "mt-2 text-xs leading-5 text-[#ffb5a0]";

type SubmissionStatus =
  | "idle"
  | "validated";

export function ContactForm() {
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      service: "",
      message: "",
      consent: false,
    },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = () => {
    setSubmissionStatus("validated");
  };

  return (
    <form
      className="rounded-[2rem] border border-white/15 bg-white/[0.06] p-6 shadow-[0_2rem_6rem_rgb(0_0_0/0.2)] backdrop-blur-2xl sm:p-8 lg:p-10"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-terracotta">
            Formulario de contacto
          </p>

          <h3 className="mt-4 font-sans text-2xl font-light tracking-[-0.025em] text-paper sm:text-3xl">
            Contanos sobre tu proyecto.
          </h3>
        </div>

        <span
          aria-hidden="true"
          className="hidden text-[0.65rem] font-medium tracking-[0.16em] text-ivory/30 sm:block"
        >
          01 — 05
        </span>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Nombre */}
        <div>
          <label
            className={labelClasses}
            htmlFor="contact-name"
          >
            Nombre completo *
          </label>

          <input
            aria-describedby={
              errors.name
                ? "contact-name-error"
                : undefined
            }
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            className={inputClasses}
            id="contact-name"
            placeholder="Tu nombre"
            type="text"
            {...register("name")}
          />

          {errors.name ? (
            <p
              className={errorClasses}
              id="contact-name-error"
              role="alert"
            >
              {errors.name.message}
            </p>
          ) : null}
        </div>

        {/* Correo */}
        <div>
          <label
            className={labelClasses}
            htmlFor="contact-email"
          >
            Correo electrónico *
          </label>

          <input
            aria-describedby={
              errors.email
                ? "contact-email-error"
                : undefined
            }
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className={inputClasses}
            id="contact-email"
            inputMode="email"
            placeholder="nombre@correo.com"
            type="email"
            {...register("email")}
          />

          {errors.email ? (
            <p
              className={errorClasses}
              id="contact-email-error"
              role="alert"
            >
              {errors.email.message}
            </p>
          ) : null}
        </div>

        {/* Organización */}
        <div>
          <label
            className={labelClasses}
            htmlFor="contact-organization"
          >
            Organización
          </label>

          <input
            aria-describedby={
              errors.organization
                ? "contact-organization-error"
                : undefined
            }
            aria-invalid={Boolean(errors.organization)}
            autoComplete="organization"
            className={inputClasses}
            id="contact-organization"
            placeholder="Empresa, estudio o comunidad"
            type="text"
            {...register("organization")}
          />

          {errors.organization ? (
            <p
              className={errorClasses}
              id="contact-organization-error"
              role="alert"
            >
              {errors.organization.message}
            </p>
          ) : null}
        </div>

        {/* Tipo de consulta */}
        <div>
          <label
            className={labelClasses}
            htmlFor="contact-service"
          >
            Tipo de consulta *
          </label>

          <select
            aria-describedby={
              errors.service
                ? "contact-service-error"
                : undefined
            }
            aria-invalid={Boolean(errors.service)}
            className={cn(
              inputClasses,
              "appearance-none",
            )}
            id="contact-service"
            {...register("service")}
          >
            <option
              className="bg-forest-deep text-paper"
              value=""
            >
              Seleccionar
            </option>

            <option
              className="bg-forest-deep text-paper"
              value="proyecto-integral"
            >
              Proyecto integral
            </option>

            <option
              className="bg-forest-deep text-paper"
              value="direccion-obra"
            >
              Dirección de obra
            </option>

            <option
              className="bg-forest-deep text-paper"
              value="documentacion"
            >
              Documentación técnica
            </option>

            <option
              className="bg-forest-deep text-paper"
              value="consultoria-bim"
            >
              Consultoría BIM
            </option>

            <option
              className="bg-forest-deep text-paper"
              value="implementacion-bim"
            >
              Implementación BIM
            </option>

            <option
              className="bg-forest-deep text-paper"
              value="formacion-bim"
            >
              Formación BIM
            </option>

            <option
              className="bg-forest-deep text-paper"
              value="otro"
            >
              Otra consulta
            </option>
          </select>

          {errors.service ? (
            <p
              className={errorClasses}
              id="contact-service-error"
              role="alert"
            >
              {errors.service.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Mensaje */}
      <div className="mt-6">
        <label
          className={labelClasses}
          htmlFor="contact-message"
        >
          Mensaje *
        </label>

        <textarea
          aria-describedby={
            errors.message
              ? "contact-message-error"
              : "contact-message-help"
          }
          aria-invalid={Boolean(errors.message)}
          className={cn(
            inputClasses,
            "min-h-44 resize-y py-4 leading-7",
          )}
          id="contact-message"
          placeholder="Contanos brevemente qué necesitás, el tipo de proyecto y sus objetivos."
          rows={7}
          {...register("message")}
        />

        {errors.message ? (
          <p
            className={errorClasses}
            id="contact-message-error"
            role="alert"
          >
            {errors.message.message}
          </p>
        ) : (
          <p
            className="mt-2 text-xs text-ivory/30"
            id="contact-message-help"
          >
            Mínimo 20 caracteres.
          </p>
        )}
      </div>

      {/* Consentimiento */}
      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            aria-describedby={
              errors.consent
                ? "contact-consent-error"
                : undefined
            }
            aria-invalid={Boolean(errors.consent)}
            className="mt-1 size-4 shrink-0 accent-terracotta"
            type="checkbox"
            {...register("consent")}
          />

          <span className="text-xs leading-6 text-ivory/50">
            Acepto que los datos ingresados sean utilizados para responder esta
            consulta.
          </span>
        </label>

        {errors.consent ? (
          <p
            className={errorClasses}
            id="contact-consent-error"
            role="alert"
          >
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      {/* Estado de desarrollo */}
      {submissionStatus === "validated" ? (
        <div
          className="mt-7 flex items-start gap-3 rounded-2xl border border-sage/25 bg-sage/10 p-4 text-sm leading-6 text-sage"
          role="status"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 shrink-0"
            size={18}
            strokeWidth={1.6}
          />

          <p>
            Los datos son válidos. El envío se activará cuando conectemos el
            servicio de correo.
          </p>
        </div>
      ) : null}

      {/* Envío */}
      <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[0.62rem] uppercase leading-5 tracking-[0.12em] text-ivory/30">
          Integración de correo pendiente
        </p>

        <button
          className="glass-interactive inline-flex min-h-13 items-center justify-center gap-3 rounded-full border border-white/20 bg-terracotta px-7 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_1rem_3rem_rgb(184_98_69/0.24)] hover:border-white/35 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          type="submit"
        >
          <span>
            {isSubmitting
              ? "Validando"
              : "Validar consulta"}
          </span>

          <Send
            aria-hidden="true"
            size={16}
            strokeWidth={1.6}
          />
        </button>
      </div>
    </form>
  );
}