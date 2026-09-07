"use client";

import { useState } from "react";
import {
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  CircleAlert,
  Send,
} from "lucide-react";

import {
  CONTACT_LIMITS,
  contactSchema,
  contactServiceOptions,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { cn } from "@/utils/cn";

const inputClasses =
  "min-h-13 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 text-sm text-paper outline-none backdrop-blur-xl transition-colors duration-300 placeholder:text-ivory/30 hover:border-white/25 focus:border-terracotta focus:bg-white/[0.1] focus:ring-2 focus:ring-terracotta/20";

const labelClasses =
  "mb-3 block text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-sage";

const errorClasses =
  "text-xs leading-5 text-[#ffb5a0]";

type SubmissionStatus =
  | "idle"
  | "success"
  | "error";

type CharacterCountProps = {
  current: number;
  maximum: number;
  id: string;
};

function CharacterCount({
  current,
  maximum,
  id,
}: CharacterCountProps) {
  const isNearLimit =
    current >= maximum * 0.9;

  return (
    <span
      className={cn(
        "ml-auto shrink-0 text-[0.65rem] tabular-nums text-ivory/30",
        isNearLimit &&
          "text-[#ffb5a0]",
      )}
      id={id}
    >
      {current}/{maximum}
    </span>
  );
}

function getResponseMessage(
  payload: unknown,
) {
  if (
    !payload ||
    typeof payload !== "object"
  ) {
    return null;
  }

  const message = (
    payload as {
      message?: unknown;
    }
  ).message;

  return typeof message === "string"
    ? message
    : null;
}

export function ContactForm() {
  const [
    submissionStatus,
    setSubmissionStatus,
  ] = useState<SubmissionStatus>("idle");

  const [
    submissionMessage,
    setSubmissionMessage,
  ] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
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
      website: "",
    },
  });

  const nameValue =
    useWatch({
      control,
      name: "name",
    }) ?? "";

  const emailValue =
    useWatch({
      control,
      name: "email",
    }) ?? "";

  const organizationValue =
    useWatch({
      control,
      name: "organization",
    }) ?? "";

  const messageValue =
    useWatch({
      control,
      name: "message",
    }) ?? "";

  const onSubmit: SubmitHandler<
    ContactFormValues
  > = async (values) => {
    setSubmissionStatus("idle");
    setSubmissionMessage(null);

    try {
      const response = await fetch(
        "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      const payload: unknown =
        await response
          .json()
          .catch(() => null);

      const responseMessage =
        getResponseMessage(payload);

      if (!response.ok) {
        throw new Error(
          responseMessage ??
            "No fue posible enviar la consulta.",
        );
      }

      setSubmissionStatus("success");

      setSubmissionMessage(
        responseMessage ??
          "Tu consulta fue enviada correctamente.",
      );

      reset();
    } catch (error: unknown) {
      setSubmissionStatus("error");

      setSubmissionMessage(
        error instanceof Error
          ? error.message
          : "No fue posible enviar la consulta. Intentá nuevamente.",
      );
    }
  };

  return (
    <form
      className="relative rounded-[2rem] border border-white/15 bg-white/[0.06] p-6 shadow-[0_2rem_6rem_rgb(0_0_0/0.2)] backdrop-blur-2xl sm:p-8 lg:p-10"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Campo antispam */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-website">
          Sitio web
        </label>

        <input
          autoComplete="off"
          id="contact-website"
          tabIndex={-1}
          type="text"
          {...register("website")}
        />
      </div>

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
                ? "contact-name-error contact-name-count"
                : "contact-name-count"
            }
            aria-invalid={Boolean(
              errors.name,
            )}
            autoComplete="name"
            className={inputClasses}
            id="contact-name"
            maxLength={
              CONTACT_LIMITS.name
            }
            placeholder="Tu nombre"
            type="text"
            {...register("name")}
          />

          <div className="mt-2 flex min-h-5 items-start gap-3">
            {errors.name ? (
              <p
                className={errorClasses}
                id="contact-name-error"
                role="alert"
              >
                {errors.name.message}
              </p>
            ) : null}

            <CharacterCount
              current={nameValue.length}
              id="contact-name-count"
              maximum={
                CONTACT_LIMITS.name
              }
            />
          </div>
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
                ? "contact-email-error contact-email-count"
                : "contact-email-count"
            }
            aria-invalid={Boolean(
              errors.email,
            )}
            autoComplete="email"
            className={inputClasses}
            id="contact-email"
            inputMode="email"
            maxLength={
              CONTACT_LIMITS.email
            }
            placeholder="nombre@correo.com"
            type="email"
            {...register("email")}
          />

          <div className="mt-2 flex min-h-5 items-start gap-3">
            {errors.email ? (
              <p
                className={errorClasses}
                id="contact-email-error"
                role="alert"
              >
                {errors.email.message}
              </p>
            ) : null}

            <CharacterCount
              current={emailValue.length}
              id="contact-email-count"
              maximum={
                CONTACT_LIMITS.email
              }
            />
          </div>
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
                ? "contact-organization-error contact-organization-count"
                : "contact-organization-count"
            }
            aria-invalid={Boolean(
              errors.organization,
            )}
            autoComplete="organization"
            className={inputClasses}
            id="contact-organization"
            maxLength={
              CONTACT_LIMITS.organization
            }
            placeholder="Empresa, estudio o comunidad"
            type="text"
            {...register(
              "organization",
            )}
          />

          <div className="mt-2 flex min-h-5 items-start gap-3">
            {errors.organization ? (
              <p
                className={errorClasses}
                id="contact-organization-error"
                role="alert"
              >
                {
                  errors.organization
                    .message
                }
              </p>
            ) : null}

            <CharacterCount
              current={
                organizationValue.length
              }
              id="contact-organization-count"
              maximum={
                CONTACT_LIMITS.organization
              }
            />
          </div>
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
            aria-invalid={Boolean(
              errors.service,
            )}
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

            {contactServiceOptions.map(
              (option) => (
                <option
                  className="bg-forest-deep text-paper"
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ),
            )}
          </select>

          <div className="mt-2 min-h-5">
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
              ? "contact-message-error contact-message-count"
              : "contact-message-help contact-message-count"
          }
          aria-invalid={Boolean(
            errors.message,
          )}
          className={cn(
            inputClasses,
            "min-h-44 resize-y py-4 leading-7",
          )}
          id="contact-message"
          maxLength={
            CONTACT_LIMITS.message
          }
          placeholder="Contanos brevemente qué necesitás, el tipo de proyecto y sus objetivos."
          rows={7}
          {...register("message")}
        />

        <div className="mt-2 flex min-h-5 items-start gap-3">
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
              className="text-xs leading-5 text-ivory/30"
              id="contact-message-help"
            >
              Mínimo 20 caracteres.
            </p>
          )}

          <CharacterCount
            current={messageValue.length}
            id="contact-message-count"
            maximum={
              CONTACT_LIMITS.message
            }
          />
        </div>
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
            aria-invalid={Boolean(
              errors.consent,
            )}
            className="mt-1 size-4 shrink-0 accent-terracotta"
            type="checkbox"
            {...register("consent")}
          />

          <span className="text-xs leading-6 text-ivory/50">
            Acepto que los datos ingresados sean utilizados para responder esta consulta.
          </span>
        </label>

        {errors.consent ? (
          <p
            className={cn(
              errorClasses,
              "mt-2",
            )}
            id="contact-consent-error"
            role="alert"
          >
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      {/* Resultado */}
      {submissionStatus !== "idle" &&
      submissionMessage ? (
        <div
          className={cn(
            "mt-7 flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6",
            submissionStatus ===
              "success"
              ? "border-sage/25 bg-sage/10 text-sage"
              : "border-[#ffb5a0]/25 bg-[#ffb5a0]/10 text-[#ffb5a0]",
          )}
          role={
            submissionStatus ===
            "success"
              ? "status"
              : "alert"
          }
        >
          {submissionStatus ===
          "success" ? (
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 shrink-0"
              size={18}
              strokeWidth={1.6}
            />
          ) : (
            <CircleAlert
              aria-hidden="true"
              className="mt-0.5 shrink-0"
              size={18}
              strokeWidth={1.6}
            />
          )}

          <p>{submissionMessage}</p>
        </div>
      ) : null}

      {/* Envío */}
      <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[0.62rem] uppercase leading-5 tracking-[0.12em] text-ivory/30">
          Los campos marcados con * son obligatorios
        </p>

        <button
          className="glass-interactive inline-flex min-h-13 items-center justify-center gap-3 rounded-full border border-white/20 bg-terracotta px-7 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_1rem_3rem_rgb(184_98_69/0.24)] hover:border-white/35 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          type="submit"
        >
          <span>
            {isSubmitting
              ? "Enviando"
              : "Enviar consulta"}
          </span>

          {isSubmitting ? (
            <Loader2Icon />
          ) : (
            <Send
              aria-hidden="true"
              size={16}
              strokeWidth={1.6}
            />
          )}
        </button>
      </div>
    </form>
  );
}

function Loader2Icon() {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
    />
  );
}