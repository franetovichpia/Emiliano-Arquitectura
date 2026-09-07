import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  contactSchema,
  getContactServiceLabel,
} from "@/lib/validations/contact";

export const runtime = "nodejs";

const MAX_REQUEST_LENGTH = 12_000;

type ApiResponse = {
  message: string;
};

function response(
  message: string,
  status: number,
) {
  return NextResponse.json<ApiResponse>(
    {
      message,
    },
    {
      status,
    },
  );
}

export async function POST(
  request: Request,
) {
  let body: unknown;

  try {
    const rawBody =
      await request.text();

    if (
      rawBody.length >
      MAX_REQUEST_LENGTH
    ) {
      return response(
        "La consulta supera el tamaño permitido.",
        413,
      );
    }

    body = JSON.parse(rawBody);
  } catch {
    return response(
      "No fue posible interpretar la consulta.",
      400,
    );
  }

  const parsed =
    contactSchema.safeParse(body);

  if (!parsed.success) {
    return response(
      "Revisá los campos del formulario.",
      400,
    );
  }

  const {
    name,
    email,
    organization,
    service,
    message,
    website,
  } = parsed.data;

  /*
   * Si un bot completa este campo invisible,
   * respondemos sin enviar ningún correo.
   */
  if (website) {
    return response(
      "Consulta recibida correctamente.",
      200,
    );
  }

  const apiKey =
    process.env.RESEND_API_KEY;

  const toEmail =
    process.env.CONTACT_TO_EMAIL;

  const fromEmail =
    process.env.CONTACT_FROM_EMAIL;

  if (
    !apiKey ||
    !toEmail ||
    !fromEmail
  ) {
    return response(
      "El envío todavía no está habilitado. Intentá nuevamente más tarde.",
      503,
    );
  }

  const resend = new Resend(apiKey);

  const serviceLabel =
    getContactServiceLabel(service);

  const emailContent = [
    "Nueva consulta recibida desde el sitio web.",
    "",
    `Nombre: ${name}`,
    `Correo: ${email}`,
    `Organización: ${
      organization ||
      "No indicada"
    }`,
    `Tipo de consulta: ${serviceLabel}`,
    "",
    "Mensaje:",
    message,
  ].join("\n");

  try {
    const { error } =
      await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        replyTo: email,
        subject: `Nueva consulta web — ${serviceLabel}`,
        text: emailContent,
      });

    if (error) {
      return response(
        "No fue posible enviar la consulta. Intentá nuevamente.",
        502,
      );
    }

    return response(
      "Tu consulta fue enviada correctamente.",
      200,
    );
  } catch {
    return response(
      "No fue posible enviar la consulta. Intentá nuevamente.",
      500,
    );
  }
}