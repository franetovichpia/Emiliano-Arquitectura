import {
  Boxes,
  Building2,
  FileText,
  GraduationCap,
  Ruler,
  ScanLine,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/app/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { professionalServices } from "@/data/services";

const serviceIcons = {
  construction: Building2,
  documentation: FileText,
  plans: Ruler,
  bim: Boxes,
  visualization: ScanLine,
  training: GraduationCap,
} as const;

export function ServicesSection() {
  return (
    <section
      aria-labelledby="services-heading"
      className="relative isolate scroll-mt-28 overflow-hidden bg-blueprint-deep text-paper"
      id="servicios"
    >
      <div
        aria-hidden="true"
        className="absolute -right-40 top-24 size-[28rem] rounded-full bg-sage/[0.08] blur-[8rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -left-40 bottom-0 size-[26rem] rounded-full bg-terracotta/[0.08] blur-[8rem]"
      />

      <Container className="relative py-20 sm:py-24 lg:py-28">
        {/* Encabezado */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Áreas de trabajo"
                id="services-heading"
                title="Servicios profesionales."
                tone="dark"
              />
            </Reveal>
          </div>

          <div className="flex items-end lg:col-span-7 lg:pl-6">
            <Reveal delay={0.08}>
              <div className="max-w-3xl">
                <p className="font-sans text-[clamp(1.4rem,2.3vw,2.5rem)] font-light leading-relaxed tracking-[-0.025em] text-paper">
                  Proyecto, documentación, obra y sistemas BIM.
                </p>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-ivory/60 sm:text-base">
                  Una práctica profesional que integra herramientas técnicas,
                  representación arquitectónica y procesos colaborativos.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Tarjetas compactas */}
        <div className="mt-14 grid grid-cols-1 gap-3 sm:mt-16 md:grid-cols-2 xl:grid-cols-3">
          {professionalServices.map((service, index) => {
            const Icon = serviceIcons[service.icon];

            return (
              <Reveal
                className="h-full"
                delay={0.05 + index * 0.04}
                key={service.title}
              >
                <article className="glass-interactive group flex h-full min-h-[16rem] flex-col rounded-[1.5rem] border border-white/15 bg-white/[0.055] p-6 shadow-[0_1.5rem_4rem_rgb(0_0_0/0.1)] backdrop-blur-xl hover:border-sage/35 hover:bg-white/[0.085] sm:min-h-[17rem] sm:p-7">
                  <div className="flex items-start justify-between">
                    <div className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/[0.07] text-sage transition-colors duration-300 group-hover:border-terracotta/40 group-hover:text-terracotta">
                      <Icon
                        aria-hidden="true"
                        size={18}
                        strokeWidth={1.4}
                      />
                    </div>

                    <span className="text-[0.6rem] font-medium tracking-[0.16em] text-ivory/30">
                      {service.number}
                    </span>
                  </div>

                  <div className="mt-auto pt-10">
                    <h3 className="font-sans text-xl font-light leading-snug tracking-[-0.025em] text-paper sm:text-2xl">
                      {service.title}
                    </h3>

                    <p className="mt-4 max-w-sm text-sm leading-6 text-ivory/55">
                      {service.description}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mt-6 h-px w-full origin-left scale-x-25 bg-terracotta/60 transition-transform duration-500 group-hover:scale-x-100"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Solicitud de proyecto */}
        <Reveal
          className="mt-12"
          delay={0.14}
        >
          <div className="glass-surface-dark overflow-hidden rounded-[1.5rem] p-7 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sage">
                  Proyecto integral
                </p>

                <h3 className="mt-4 max-w-4xl font-sans text-[clamp(1.6rem,2.8vw,3rem)] font-light leading-relaxed tracking-[-0.03em] text-paper">
                  Consultoría en proyectos integrativos y soberanos.
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-ivory/55 sm:text-base">
                  Arquitectura, BIM y procesos colaborativos al servicio del
                  habitar y del Bien Común.
                </p>
              </div>

              <div className="flex lg:col-span-4 lg:justify-end">
                <ButtonLink
                  href="#contacto"
                  showArrow
                >
                  Solicitar proyecto integral
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}