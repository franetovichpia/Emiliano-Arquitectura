import type { Metadata } from "next";
import { Compass } from "lucide-react";

import { Container } from "@/app/container";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#071d31] text-[#f7f2e8]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(140, 190, 215, 0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(140, 190, 215, 0.22) 1px, transparent 1px)
          `,
          backgroundSize: "5rem 5rem",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-20 size-[38rem] rounded-full border border-[#7fb0c8]/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 size-[32rem] rounded-full bg-[#c56f4e]/10 blur-[9rem]"
      />

      <Container className="relative py-32 text-center sm:py-36">
        <div className="mx-auto grid size-16 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-[#d17c5b] backdrop-blur-xl">
          <Compass
            aria-hidden="true"
            size={26}
            strokeWidth={1.5}
          />
        </div>

        <p className="mt-7 text-[0.63rem] font-semibold uppercase tracking-[0.19em] text-[#d17c5b]">
          Error 404
        </p>

        <h1 className="mt-4 font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.04em] text-[#f7f2e8]">
          Esta página no existe.
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/55 sm:text-base">
          El enlace puede estar roto o la página se movió.
          Volvé al inicio para seguir explorando.
        </p>

        <div className="mt-10 flex justify-center">
          <ButtonLink
            href="/"
            variant="primary"
          >
            Volver a la página principal
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}