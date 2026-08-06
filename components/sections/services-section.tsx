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
import { Container } from "@/components/ui/container";
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
      className="relative isolate overflow-hidden bg-forest-deep text-ivory"
      id="servicios"
    >
      {/* Fondos decorativos */}
      <div
        aria-hidden="true"
        className="architectural-grid absolute inset-0 opacity-[0.08]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-40 top-24 size-[34rem] rounded-full bg-sage/10 blur-[8rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -left-40 bottom-0 size-[30rem] rounded-full bg-terracotta/10 blur-[8rem]"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        {/* Encabezado */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
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

          <div className="flex items-end lg:col-span-7 lg:pl-8">
            <Reveal delay={0.08}>
              <div className="max-w-3xl">
                <p className="font-sans text-[clamp(1.55rem,2.7vw,3rem)] font-light leading-relaxed tracking-[-0.025em] text-paper">
                  Proyecto, documentación, obra y sistemas BIM.
                </p>

                <p className="mt-6 max-w-2xl text-sm leading-8 text-ivory/60 sm:text-base">
                  Una práctica profesional que integra herramientas técnicas,
                  representación arquitectónica y procesos colaborativos.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Tarjetas de servicios */}
        <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {professionalServices.map((service, index) => {
            const Icon = serviceIcons[service.icon];

            return (
              <Reveal
                className="h-full"
                delay={0.06 + index * 0.05}
                key={service.title}
              >
                <article className="glass-interactive group flex h-full min-h-[21rem] flex-col rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-7 shadow-[0_2rem_5rem_rgb(0_0_0/0.12)] backdrop-blur-2xl hover:border-sage/35 hover:bg-white/[0.09] sm:p-9">
                  <div className="flex items-start justify-between">
                    <div className="grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.07] text-sage transition-colors duration-300 group-hover:border-terracotta/40 group-hover:text-terracotta">
                      <Icon
                        aria-hidden="true"
                        size={21}
                        strokeWidth={1.4}
                      />
                    </div>

                    <span className="text-[0.65rem] font-medium tracking-[0.16em] text-ivory/30">
                      {service.number}
                    </span>
                  </div>

                  <div className="mt-auto pt-16">
                    <h3 className="font-sans text-2xl font-light leading-snug tracking-[-0.025em] text-paper sm:text-3xl">
                      {service.title}
                    </h3>

                    <p className="mt-5 max-w-sm text-sm leading-7 text-ivory/55">
                      {service.description}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mt-8 h-px w-full origin-left scale-x-25 bg-terracotta/60 transition-transform duration-500 group-hover:scale-x-100"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Solicitud de proyecto */}
        <Reveal
          className="mt-16"
          delay={0.16}
        >
          <div className="glass-surface-dark overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sage">
                  Proyecto integral
                </p>

                <h3 className="mt-6 max-w-4xl font-sans text-[clamp(1.8rem,3.4vw,3.8rem)] font-light leading-relaxed tracking-[-0.03em] text-paper">
                  Consultoría en proyectos participativos y soberanos.
                </h3>

                <p className="mt-6 max-w-2xl text-sm leading-8 text-ivory/55 sm:text-base">
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