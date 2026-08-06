import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre.")
    .max(80, "El nombre no puede superar los 80 caracteres."),

  email: z
    .string()
    .trim()
    .min(1, "Ingresá tu correo electrónico.")
    .email("Ingresá un correo electrónico válido.")
    .max(120, "El correo no puede superar los 120 caracteres."),

  organization: z
    .string()
    .trim()
    .max(120, "El nombre no puede superar los 120 caracteres.")
    .optional(),

  service: z
    .string()
    .trim()
    .min(1, "Seleccioná un tipo de consulta."),

  message: z
    .string()
    .trim()
    .min(20, "El mensaje debe contener al menos 20 caracteres.")
    .max(2000, "El mensaje no puede superar los 2000 caracteres."),

  consent: z
    .boolean()
    .refine((value) => value, {
      message: "Debés aceptar el tratamiento de los datos.",
    }),
});

export type ContactFormValues = z.infer<
  typeof contactSchema
>;