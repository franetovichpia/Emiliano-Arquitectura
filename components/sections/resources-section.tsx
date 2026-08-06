import Link from "next/link";
import {
  ArrowUpRight,
  Download,
  FileText,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  resources,
  type ResourceIcon,
} from "@/data/resources";
import { cn } from "@/utils/cn";

type ResourceIconProps = {
  icon: ResourceIcon;
};

function ResourceIconComponent({
  icon,
}: ResourceIconProps) {
  if (icon === "download") {
    return (
      <Download
        aria-hidden="true"
        size={23}
        strokeWidth={1.4}
      />
    );
  }

  return (
    <FileText
      aria-hidden="true"
      size={23}
      strokeWidth={1.4}
    />
  );
}

export function ResourcesSection() {
  return (
    <section
      aria-labelledby="resources-heading"
      className="relative isolate overflow-hidden bg-forest-deep text-ivory"
      id="recursos"
    >
      <div
        aria-hidden="true"
        className="topographic-field absolute inset-0 opacity-35"
      />

      <div
        aria-hidden="true"
        className="absolute -left-48 top-20 size-[34rem] rounded-full bg-terracotta/10 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-48 bottom-0 size-[34rem] rounded-full bg-sage/10 blur-[9rem]"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        {/* Encabezado */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Material disponible"
                id="resources-heading"
                title="Investigaciones y recursos."
                tone="dark"
              />
            </Reveal>
          </div>

          <div className="flex items-end lg:col-span-7 lg:pl-8">
            <Reveal delay={0.08}>
              <div className="max-w-3xl">
                <p className="font-sans text-[clamp(1.55rem,2.7vw,3rem)] font-light leading-relaxed tracking-[-0.025em] text-paper">
                  Territorio, alternativas y autoconstrucción.
                </p>

                <p className="mt-6 max-w-2xl text-sm leading-8 text-ivory/55 sm:text-base">
                  Documentos y materiales para consultar o descargar.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Recursos */}
        <div className="mt-20 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {resources.map((resource, index) => {
            const columnClass =
              index === 0
                ? "lg:col-span-7"
                : "lg:col-span-5";

            return (
              <Reveal
                className={cn("h-full", columnClass)}
                delay={0.08 + index * 0.08}
                key={resource.title}
              >
                <article className="glass-surface-dark glass-interactive group relative flex h-full min-h-[31rem] flex-col overflow-hidden rounded-[2rem] p-7 sm:p-9 lg:p-10">
                  <div
                    aria-hidden="true"
                    className="absolute -right-12 -top-16 font-sans text-[14rem] font-light leading-none tracking-[-0.08em] text-white/[0.025]"
                  >
                    {resource.number}
                  </div>

                  <div
                    aria-hidden="true"
                    className="absolute bottom-[22%] right-[10%] h-[35%] w-[48%] rotate-6 border border-white/10"
                  >
                    <div className="absolute -left-[22%] top-[25%] h-[75%] w-[60%] border border-sage/15" />
                  </div>

                  {/* Encabezado de la tarjeta */}
                  <div className="relative flex items-start justify-between">
                    <div className="grid size-13 place-items-center rounded-full border border-white/15 bg-white/[0.07] text-sage backdrop-blur-xl transition-colors duration-300 group-hover:border-terracotta/40 group-hover:text-terracotta">
                      <ResourceIconComponent
                        icon={resource.icon}
                      />
                    </div>

                    <span className="text-[0.65rem] font-medium tracking-[0.16em] text-ivory/30">
                      {resource.number}
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="relative mt-auto pt-20">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-sage">
                      {resource.format}
                    </p>

                    <h3 className="mt-5 max-w-xl font-sans text-[clamp(1.8rem,3vw,3.25rem)] font-light leading-snug tracking-[-0.03em] text-paper">
                      {resource.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-ivory/55 sm:text-base">
                      {resource.subtitle}
                    </p>

                    <div className="mt-8 border-t border-white/10 pt-5">
                      {resource.href ? (
                        <Link
                          aria-label={`${resource.action}: ${resource.title}`}
                          className="group/link inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-sage"
                          href={resource.href}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {resource.action}

                          <ArrowUpRight
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                            size={15}
                            strokeWidth={1.6}
                          />
                        </Link>
                      ) : (
                        <span className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ivory/35">
                          Archivo o enlace pendiente
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}