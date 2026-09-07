import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/app/container";

const newFormsUrl =
  process.env.NEXT_PUBLIC_NEW_FORMS_URL;

export function NewFormsTeaserSection() {
  return (
    <section
      aria-labelledby="new-forms-heading"
      className="relative isolate overflow-hidden border-y border-white/10 bg-blueprint-deep text-paper"
      id="nuevas-formas"
    >
      <div
        aria-hidden="true"
        className="absolute -right-32 top-1/2 size-[24rem] -translate-y-1/2 rounded-full bg-sage/[0.07] blur-[8rem]"
      />

      <Container className="relative py-14 sm:py-16 lg:py-20">
        <div className="overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.045] shadow-[0_1.5rem_5rem_rgb(0_0_0/0.12)] backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
            {/* Presentación secundaria */}
            <div className="flex flex-col justify-center p-7 sm:p-9 lg:col-span-7 lg:p-10">
              <Reveal>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
                  Otra línea del proyecto
                </p>

                <h2
                  className="mt-4 max-w-3xl font-serif text-[clamp(2.5rem,4.2vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.04em] text-paper"
                  id="new-forms-heading"
                >
                  Nuevas{" "}
                  <span className="italic text-sage">
                    formas
                  </span>{" "}
                  de...
                </h2>
              </Reveal>

              <Reveal delay={0.08}>
                <p className="mt-5 max-w-2xl text-sm font-light leading-7 text-ivory/60 sm:text-base">
                  Una experiencia independiente vinculada al universo de
                  Emiliano Gabriel Rossotti.
                </p>
              </Reveal>

              <Reveal delay={0.14}>
                {newFormsUrl ? (
                  <a
                    aria-label="Visitar Nuevas formas de..."
                    className="glass-interactive mt-7 inline-flex min-h-11 w-fit items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] px-5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-paper backdrop-blur-xl hover:border-sage/45 hover:bg-white/10"
                    href={newFormsUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Conocer la propuesta

                    <ArrowUpRight
                      aria-hidden="true"
                      size={15}
                      strokeWidth={1.6}
                    />
                  </a>
                ) : (
                  <span
                    aria-label="Nuevas formas de..., próximamente"
                    className="mt-7 inline-flex min-h-11 w-fit cursor-default items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-5 text-[0.61rem] font-semibold uppercase tracking-[0.14em] text-ivory/40"
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

            {/* Tres líneas conceptuales */}
            <Reveal
              className="border-t border-white/10 lg:col-span-5 lg:border-l lg:border-t-0"
              delay={0.1}
              distance={24}
            >
              <div className="relative min-h-[12rem] overflow-hidden bg-black/[0.06] sm:min-h-[14rem] lg:h-full lg:min-h-[17rem]">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 700 260"
                >
                  <g
                    opacity="0.12"
                    stroke="#faf7ef"
                    strokeDasharray="5 10"
                    strokeWidth="1"
                  >
                    <path d="M120 25V235" />
                    <path d="M350 25V235" />
                    <path d="M580 25V235" />
                  </g>

                  <path
                    d="M-30 205C110 205 155 47 335 60C490 71 520 174 730 137"
                    opacity="0.68"
                    stroke="#faf7ef"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />

                  <path
                    d="M-30 228C115 225 190 89 365 102C510 113 555 207 730 182"
                    opacity="0.65"
                    stroke="#879d7d"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />

                  <path
                    d="M-30 247C145 250 225 137 400 142C545 147 600 233 730 219"
                    opacity="0.72"
                    stroke="#c66f4e"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                </svg>

                <div className="absolute inset-x-6 bottom-5 flex items-end justify-between border-t border-white/10 pt-4 sm:inset-x-7">
                  <p className="max-w-[16rem] text-[0.58rem] font-medium uppercase leading-5 tracking-[0.14em] text-ivory/35">
                    Tres líneas para una experiencia conceptual
                  </p>

                  <span className="font-serif text-2xl italic text-sage/70">
                    …
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}