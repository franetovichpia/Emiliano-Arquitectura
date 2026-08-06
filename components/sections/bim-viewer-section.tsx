import {
  Boxes,
  Maximize2,
  Ruler,
  ScanLine,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const viewerCapabilities = [
  {
    icon: Boxes,
    label: "Navegación orbital",
  },
  {
    icon: ScanLine,
    label: "Selección de elementos",
  },
  {
    icon: Ruler,
    label: "Mediciones",
  },
  {
    icon: Maximize2,
    label: "Pantalla completa",
  },
] as const;

export function BimViewerSection() {
  return (
    <section
      aria-labelledby="bim-viewer-heading"
      className="relative overflow-hidden bg-paper text-forest-deep"
      id="visor-bim"
    >
      <div
        aria-hidden="true"
        className="absolute -right-40 top-0 size-[34rem] rounded-full bg-sage/20 blur-[9rem]"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Visualización arquitectónica"
                id="bim-viewer-heading"
                title="Visor IFC interactivo."
              />
            </Reveal>
          </div>

          <div className="flex items-end lg:col-span-7 lg:pl-8">
            <Reveal delay={0.08}>
              <div className="max-w-3xl">
                <p className="font-sans text-[clamp(1.55rem,2.7vw,3rem)] font-light leading-relaxed tracking-[-0.025em] text-forest-deep">
                  Arquitectura explorada desde el modelo.
                </p>

                <p className="mt-6 max-w-2xl text-sm leading-8 text-forest-deep/60 sm:text-base">
                  Un proyecto seleccionado podrá recorrerse desde el navegador
                  mediante una experiencia OpenBIM optimizada.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal
          className="mt-14"
          delay={0.12}
          distance={32}
        >
          <ul
            aria-label="Funciones previstas del visor"
            className="mb-5 flex flex-wrap gap-2"
          >
            {viewerCapabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <li
                  className="inline-flex items-center gap-2 rounded-full border border-forest-deep/10 bg-white/35 px-4 py-2 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-forest-deep/55 backdrop-blur-xl"
                  key={capability.label}
                >
                  <Icon
                    aria-hidden="true"
                    size={14}
                    strokeWidth={1.5}
                  />

                  {capability.label}
                </li>
              );
            })}
          </ul>

          <article className="relative min-h-[27rem] overflow-hidden rounded-[1.75rem] border border-white/15 bg-forest-deep text-ivory shadow-[0_2rem_6rem_rgb(11_38_55/0.2)] sm:min-h-[34rem]">
            <div
              aria-hidden="true"
              className="architectural-grid absolute inset-0 opacity-35"
            />

            <div
              aria-hidden="true"
              className="absolute -left-32 bottom-0 size-[28rem] rounded-full bg-sage/10 blur-[8rem]"
            />

            <div
              aria-hidden="true"
              className="absolute -right-28 top-0 size-[25rem] rounded-full bg-terracotta/10 blur-[8rem]"
            />

            <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-sage backdrop-blur-xl sm:left-7 sm:top-7">
              <Boxes
                aria-hidden="true"
                size={15}
                strokeWidth={1.5}
              />

              Experiencia OpenBIM
            </div>

            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
              viewBox="0 0 1200 650"
            >
              <g
                opacity="0.55"
                stroke="#faf7ef"
                strokeWidth="1.25"
              >
                <path d="M115 520 310 170 735 82 1068 255 1040 520Z" />
                <path d="M310 170 346 520" />
                <path d="M735 82 723 520" />
                <path d="M1068 255 910 520" />

                <path d="M276 230 1031 299" />
                <path d="M241 295 1000 356" />
                <path d="M205 361 970 414" />
                <path d="M170 425 939 470" />

                <path d="M360 201 424 520" />
                <path d="M446 183 498 520" />
                <path d="M534 165 572 520" />
                <path d="M622 146 648 520" />
                <path d="M711 128 721 520" />
                <path d="M794 133 786 520" />
                <path d="M872 174 850 520" />
                <path d="M948 214 905 520" />
              </g>

              <g
                opacity="0.38"
                stroke="#83aebe"
                strokeDasharray="7 10"
                strokeWidth="1"
              >
                <path d="M95 555H1085" />
                <path d="M133 585H1038" />
                <path d="M310 120V590" />
                <path d="M735 50V590" />
              </g>

              <path
                d="M115 520 310 170 735 82"
                stroke="#879d7d"
                strokeWidth="3"
              />

              <path
                d="M735 82 1068 255 1040 520"
                stroke="#c66f4e"
                strokeWidth="3"
              />

              <g
                fill="#faf7ef"
                fontFamily="sans-serif"
                fontSize="13"
                letterSpacing="3"
                opacity="0.5"
              >
                <text x="104" y="610">
                  MODELO ARQUITECTÓNICO
                </text>

                <text x="905" y="610">
                  OPENBIM
                </text>
              </g>
            </svg>

            <div className="absolute inset-x-5 bottom-5 z-10 sm:inset-x-7 sm:bottom-7">
              <div className="flex max-w-xl flex-col gap-5 rounded-[1.4rem] border border-white/15 bg-forest-deep/80 p-5 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between sm:p-6">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-sage">
                    Modelo interactivo
                  </p>

                  <p className="mt-3 font-serif text-2xl leading-tight text-paper sm:text-3xl">
                    Proyecto pendiente de selección.
                  </p>

                  <p className="mt-3 max-w-md text-xs leading-6 text-ivory/55 sm:text-sm">
                    El modelo se incorporará después de definir con Emiliano
                    qué proyecto será presentado.
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-terracotta/35 bg-terracotta/10 px-4 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-terracotta">
                  En preparación
                </span>
              </div>
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}