import { z } from "zod";

export const CONTACT_LIMITS = {
  name: 80,
  email: 120,
  organization: 120,
  service: 60,
  message: 2000,
} as const;

export const contactServiceOptions = [
  {
    value: "proyecto-integral",
    label: "Proyecto integral",
  },
  {
    value: "direccion-obra",
    label: "Dirección de obra",
  },
  {
    value: "documentacion",
    label: "Documentación técnica",
  },
  {
    value: "consultoria-bim",
    label: "Consultoría BIM",
  },
  {
    value: "implementacion-bim",
    label: "Implementación BIM",
  },
  {
    value: "formacion-bim",
    label: "Formación BIM",
  },
  {
    value: "otro",
    label: "Otra consulta",
  },
] as const;

const validServiceValues = new Set<string>(
  contactServiceOptions.map(
    (option) => option.value,
  ),
);

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre.")
    .max(
      CONTACT_LIMITS.name,
      `El nombre no puede superar los ${CONTACT_LIMITS.name} caracteres.`,
    ),

  email: z
    .string()
    .trim()
    .min(
      1,
      "Ingresá tu correo electrónico.",
    )
    .email(
      "Ingresá un correo electrónico válido.",
    )
    .max(
      CONTACT_LIMITS.email,
      `El correo no puede superar los ${CONTACT_LIMITS.email} caracteres.`,
    ),

  organization: z
    .string()
    .trim()
    .max(
      CONTACT_LIMITS.organization,
      `El nombre no puede superar los ${CONTACT_LIMITS.organization} caracteres.`,
    )
    .optional(),

  service: z
    .string()
    .trim()
    .min(
      1,
      "Seleccioná un tipo de consulta.",
    )
    .max(
      CONTACT_LIMITS.service,
      "El tipo de consulta no es válido.",
    )
    .refine(
      (value) =>
        validServiceValues.has(value),
      {
        message:
          "Seleccioná un tipo de consulta válido.",
      },
    ),

  message: z
    .string()
    .trim()
    .min(
      20,
      "El mensaje debe contener al menos 20 caracteres.",
    )
    .max(
      CONTACT_LIMITS.message,
      `El mensaje no puede superar los ${CONTACT_LIMITS.message} caracteres.`,
    ),

  consent: z
    .boolean()
    .refine((value) => value, {
      message:
        "Debés aceptar el tratamiento de los datos.",
    }),

  website: z
    .string()
    .max(
      0,
      "No fue posible validar la consulta.",
    )
    .optional(),
});

export function getContactServiceLabel(
  value: string,
) {
  return (
    contactServiceOptions.find(
      (option) =>
        option.value === value,
    )?.label ?? value
  );
}

export type ContactFormValues = z.infer<
  typeof contactSchema
>;