import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/app/container";

export const metadata: Metadata = {
  title: "Política de Privacidad | Emiliano Gabriel Rossotti",
  description:
    "Qué datos se recopilan a través del formulario de contacto, para qué se utilizan y cómo ejercer tus derechos.",
};

const sections = [
  {
    title: "Qué datos recopilamos",
    body: "Cuando completás el formulario de contacto recopilamos el nombre, el correo electrónico, la organización (si la indicás), el tipo de consulta y el mensaje que escribís.",
  },
  {
    title: "Para qué los usamos",
    body: "Esos datos se utilizan exclusivamente para responder tu consulta. No se usan con fines publicitarios ni se incorporan a listas de envío sin tu consentimiento explícito.",
  },
  {
    title: "Con quién los compartimos",
    body: "No vendemos ni compartimos tus datos con terceros. La información queda almacenada de forma privada y solo es accesible para Emiliano Gabriel Rossotti.",
  },
  {
    title: "Tus derechos",
    body: "De acuerdo con la Ley N.º 25.326 de Protección de Datos Personales de la República Argentina, tenés derecho a acceder, rectificar o solicitar la eliminación de tus datos en cualquier momento. La Agencia de Acceso a la Información Pública (AAIP), www.argentina.gob.ar/aaip, es el órgano de control de esta ley y el canal habilitado para recibir reclamos.",
  },
  {
    title: "Cómo ejercer tus derechos",
    body: "Para solicitar acceso, corrección o eliminación de tus datos, escribinos a través del formulario de contacto indicando tu pedido, o directamente por correo electrónico.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-paper text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 size-[28rem] rounded-full bg-sage/10 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 size-[24rem] rounded-full bg-terracotta/10 blur-[8rem]"
      />

      <Container className="relative py-28 sm:py-32">
        <Link
          className="group inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-ink/50 transition-colors duration-300 hover:text-ink"
          href="/#contacto"
        >
          <ArrowLeft
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-1"
            size={15}
            strokeWidth={1.6}
          />
          Volver al formulario de contacto
        </Link>

        <p className="mt-10 text-[0.62rem] font-semibold uppercase tracking-[0.19em] text-terracotta">
          Protección de datos personales
        </p>

        <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.04em] text-ink">
          Política de Privacidad
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-ink/60 sm:text-base">
          Esta página explica qué información recopilamos a través del
          formulario de contacto de este sitio, para qué la usamos y qué
          derechos tenés sobre tus datos, en línea con la Ley N.º 25.326 de
          Protección de Datos Personales de la República Argentina.
        </p>

        <div className="mt-14 space-y-10 border-t border-ink/10 pt-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-serif text-xl text-ink sm:text-2xl">
                {section.title}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/60">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-14 max-w-2xl text-xs leading-6 text-ink/40">
          Última actualización: octubre de 2026.
        </p>
      </Container>
    </main>
  );
}