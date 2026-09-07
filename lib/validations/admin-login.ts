import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Ingresá tu correo electrónico.")
    .email("Ingresá un correo electrónico válido."),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export type AdminLoginFormValues = z.infer<
  typeof adminLoginSchema
>;