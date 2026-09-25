"use client";

import { useEffect } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

import { Container } from "@/app/container";
import { ButtonLink } from "@/components/ui/button-link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
          <TriangleAlert
            aria-hidden="true"
            size={26}
            strokeWidth={1.5}
          />
        </div>

        <p className="mt-7 text-[0.63rem] font-semibold uppercase tracking-[0.19em] text-[#d17c5b]">
          Algo salió mal
        </p>

        <h1 className="mt-4 font-serif text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.95] tracking-[-0.04em] text-[#f7f2e8]">
          No pudimos cargar esta página.
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/55 sm:text-base">
          Probá de nuevo en un momento. Si el
          problema sigue, volvé al inicio.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-white/20 bg-terracotta/90 px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.13em] text-white shadow-[0_1rem_2.5rem_rgb(184_98_69/0.22)] backdrop-blur-xl transition hover:border-white/35 hover:bg-terracotta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
            onClick={reset}
            type="button"
          >
            <RefreshCw
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-rotate-45"
              size={16}
              strokeWidth={1.7}
            />
            Reintentar
          </button>

          <ButtonLink
            href="/"
            variant="light"
          >
            Volver al inicio
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}