import {
  Check,
  MessageSquareText,
} from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/app/container";
import { SectionHeading } from "@/components/ui/section-heading";

const contactAreas = [
  "Proyectos integrales",
  "Dirección y documentación de obra",
  "Consultoría e implementación BIM",
  "Proyectos integrativos y soberanos",
] as const;

export function ContactSection() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden bg-forest-deep text-ivory"
      id="contacto"
    >
      <div
        aria-hidden="true"
        className="architectural-grid absolute inset-0 opacity-[0.06]"
      />

      <div
        aria-hidden="true"
        className="absolute -left-48 top-20 size-[36rem] rounded-full bg-terracotta/10 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-48 bottom-0 size-[34rem] rounded-full bg-sage/10 blur-[9rem]"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Información */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <SectionHeading
                  eyebrow="Contacto"
                  id="contact-heading"
                  title="Contacto profesional."
                  tone="dark"
                />
              </Reveal>

              <Reveal
                className="mt-12"
                delay={0.08}
              >
                <p className="max-w-xl font-sans text-[clamp(1.5rem,2.5vw,2.8rem)] font-light leading-relaxed tracking-[-0.025em] text-paper">
                  Solicitar un servicio de proyecto integral.
                </p>
              </Reveal>

              <Reveal
                className="mt-12"
                delay={0.16}
              >
                <div className="border-t border-white/10 pt-8">
                  <div className="flex items-center gap-3 text-sage">
                    <MessageSquareText
                      aria-hidden="true"
                      size={20}
                      strokeWidth={1.5}
                    />

                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em]">
                      Áreas de consulta
                    </p>
                  </div>

                  <ul className="mt-7 space-y-4">
                    {contactAreas.map((area) => (
                      <li
                        className="flex items-start gap-3 text-sm leading-7 text-ivory/60"
                        key={area}
                      >
                        <Check
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-terracotta"
                          size={16}
                          strokeWidth={1.8}
                        />

                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Formulario */}
          <Reveal
            className="lg:col-span-7"
            delay={0.12}
            distance={32}
          >
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
