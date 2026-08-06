import {
  ArrowUpRight,
  MoveRight,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";

const newFormsUrl =
  process.env.NEXT_PUBLIC_NEW_FORMS_URL;

export function NewFormsTeaserSection() {
  return (
    <section
      aria-labelledby="new-forms-heading"
      className="relative isolate overflow-hidden bg-forest-deep text-ivory"
      id="nuevas-formas"
    >
      <div
        aria-hidden="true"
        className="absolute -left-40 top-0 size-[32rem] rounded-full bg-sage/10 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-40 bottom-0 size-[32rem] rounded-full bg-terracotta/10 blur-[9rem]"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Contenido principal */}
          <div className="lg:col-span-6">
            <Reveal>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
                Otra línea del proyecto
              </p>

              <h2
                className="mt-7 max-w-[8ch] font-serif text-[clamp(3.5rem,7vw,7.8rem)] font-medium leading-[0.84] tracking-[-0.045em] text-paper"
                id="new-forms-heading"
              >
                Nuevas

                <span className="block italic text-sage">
                  formas
                </span>

                <span className="block">de...</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-9 max-w-xl font-sans text-[clamp(1.15rem,1.8vw,1.7rem)] font-light leading-relaxed text-ivory/70">
                Una experiencia independiente vinculada al universo de
                Emiliano Gabriel Rossotti.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              {newFormsUrl ? (
                <a
                  aria-label="Visitar Nuevas formas de..."
                  className="glass-interactive mt-10 inline-flex min-h-12 items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-paper backdrop-blur-xl hover:border-sage/50 hover:bg-white/15"
                  href={newFormsUrl}
                >
                  Conocer la propuesta

                  <ArrowUpRight
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.6}
                  />
                </a>
              ) : (
                <span
                  aria-label="Nuevas formas de..., próximamente"
                  className="mt-10 inline-flex min-h-12 cursor-default items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-6 text-[0.63rem] font-semibold uppercase tracking-[0.15em] text-ivory/45"
                  role="status"
                >
                  Próximamente

                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-terracotta"
                  />
                </span>
              )}
            </Reveal>
          </div>

          {/* Gráfico conceptual */}
          <Reveal
            className="lg:col-span-6"
            delay={0.12}
            distance={34}
          >
            <div className="group relative min-h-[25rem] overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.045] p-6 backdrop-blur-xl sm:min-h-[31rem] sm:p-8">
              <div className="absolute right-6 top-6 z-10 flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-ivory/35">
                <span>Continuar</span>

                <MoveRight
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.4}
                />
              </div>

              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 700 520"
              >
                {/* Línea arquitectura */}
                <path
                  className="transition-opacity duration-500 group-hover:opacity-100"
                  d="M-40 425C130 422 156 85 358 110C508 129 515 322 750 264"
                  opacity="0.68"
                  stroke="#faf7ef"
                  strokeLinecap="round"
                  strokeWidth="2"
                />

                {/* Línea naturaleza */}
                <path
                  className="transition-opacity duration-500 group-hover:opacity-100"
                  d="M-38 460C125 455 202 167 371 181C528 193 541 381 742 330"
                  opacity="0.68"
                  stroke="#879d7d"
                  strokeLinecap="round"
                  strokeWidth="3"
                />

                {/* Línea transformación */}
                <path
                  className="transition-opacity duration-500 group-hover:opacity-100"
                  d="M-42 492C153 500 244 252 402 257C544 262 594 440 748 401"
                  opacity="0.7"
                  stroke="#c66f4e"
                  strokeLinecap="round"
                  strokeWidth="3"
                />

                {/* Numeración */}
                <g
                  fill="#faf7ef"
                  fontFamily="sans-serif"
                  fontSize="12"
                  letterSpacing="4"
                  opacity="0.35"
                >
                  <text x="38" y="68">
                    01
                  </text>

                  <text x="328" y="68">
                    02
                  </text>

                  <text x="620" y="68">
                    03
                  </text>
                </g>

                {/* Guías verticales */}
                <g
                  opacity="0.2"
                  stroke="#faf7ef"
                  strokeDasharray="5 10"
                  strokeWidth="1"
                >
                  <path d="M52 85V460" />
                  <path d="M350 85V460" />
                  <path d="M648 85V460" />
                </g>
              </svg>

              <div className="absolute bottom-6 left-6 right-6 z-10 border-t border-white/15 pt-5 sm:bottom-8 sm:left-8 sm:right-8">
                <div className="flex items-center justify-between gap-5">
                  <p className="max-w-sm text-xs uppercase leading-6 tracking-[0.13em] text-ivory/45">
                    Tres líneas para una experiencia conceptual
                  </p>

                  <span className="font-serif text-3xl italic text-sage">
                    …
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}