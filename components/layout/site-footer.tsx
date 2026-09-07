import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
  PanelsTopLeft,
} from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa";

import { Container } from "@/app/container";
import {
  footerNavigation,
  mainNavigation,
} from "@/data/navigation";
import {
  professionalLinks,
  type ProfessionalLinkIcon,
} from "@/data/professional-links";

type ProfessionalIconProps = {
  icon: ProfessionalLinkIcon;
};

function ProfessionalIcon({
  icon,
}: ProfessionalIconProps) {
  if (icon === "linkedin") {
    return (
      <FaLinkedinIn
        aria-hidden="true"
        size={17}
      />
    );
  }

  if (icon === "facebook") {
    return (
      <FaFacebookF
        aria-hidden="true"
        size={16}
      />
    );
  }

  return (
    <PanelsTopLeft
      aria-hidden="true"
      size={18}
      strokeWidth={1.5}
    />
  );
}

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-ivory">
      <div
        aria-hidden="true"
        className="absolute -left-48 bottom-0 size-[32rem] rounded-full bg-terracotta/10 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-48 top-0 size-[32rem] rounded-full bg-sage/10 blur-[9rem]"
      />

      <Container className="relative py-10 sm:py-14">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl sm:p-9 lg:p-12">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            {/* Identidad */}
            <div className="lg:col-span-5">
              <Link
                aria-label="Volver al inicio"
                className="group inline-flex items-center gap-4 rounded-xl"
                href="#inicio"
              >
                <span className="grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/[0.06] font-serif text-xl text-paper transition-colors duration-300 group-hover:border-terracotta/40 group-hover:text-terracotta">
                  EGR
                </span>

                <span>
                  <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.17em] text-paper">
                    Emiliano Gabriel Rossotti
                  </span>

                  <span className="mt-2 block text-[0.62rem] uppercase tracking-[0.14em] text-ivory/40">
                    Arquitecto utopista
                  </span>
                </span>
              </Link>

              <p className="mt-10 max-w-xl font-sans text-[clamp(1.45rem,2.5vw,2.6rem)] font-light leading-relaxed tracking-[-0.025em] text-paper">
                Consultor en Proyectos Integrativos y Soberanos.
              </p>

              <p className="mt-7 max-w-lg text-sm leading-7 text-ivory/45">
                Arquitecto UBA · Asesor BIM · Maestro Mayor de Obras
              </p>
            </div>

            {/* Navegación */}
            <div className="lg:col-span-3">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-sage">
                Navegación
              </p>

              <nav
                aria-label="Navegación del pie de página"
                className="mt-7"
              >
                <ul className="space-y-4">
                  {mainNavigation.map((item) => (
                    <li key={item.href}>
                      <Link
                        className="text-sm font-light text-ivory/55 transition-colors duration-300 hover:text-paper"
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-9 border-t border-white/10 pt-7">
                <ul className="space-y-4">
                  {footerNavigation.map((item) => (
                    <li key={item.href}>
                      <Link
                        className="text-xs text-ivory/35 transition-colors duration-300 hover:text-sage"
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Experiencia profesional */}
            <div className="lg:col-span-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-sage">
                Experiencia profesional
              </p>

              <div className="mt-7 space-y-3">
                {professionalLinks.map((item) => (
                  <div
                    className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5"
                    key={item.label}
                  >
                    {item.href ? (
                      <Link
                        aria-label={`Abrir ${item.label}`}
                        className="group flex items-center gap-4"
                        href={item.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-sage">
                          <ProfessionalIcon icon={item.icon} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-paper">
                            {item.label}
                          </span>

                          <span className="mt-1 block text-xs text-ivory/35">
                            {item.description}
                          </span>
                        </span>

                        <ArrowUpRight
                          aria-hidden="true"
                          className="text-ivory/35 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          size={16}
                          strokeWidth={1.5}
                        />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-sage">
                          <ProfessionalIcon icon={item.icon} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-paper">
                            {item.label}
                          </span>

                          <span className="mt-1 block text-xs text-ivory/35">
                            {item.description}
                          </span>
                        </span>

                        <span className="text-[0.55rem] font-medium uppercase tracking-[0.12em] text-ivory/25">
                          Pendiente
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Link
                aria-label="Volver al inicio de la página"
                className="glass-interactive mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.05] px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ivory/55 hover:border-sage/35 hover:text-sage"
                href="#inicio"
              >
                Volver arriba

                <ArrowUp
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1.6}
                />
              </Link>
            </div>
          </div>

          {/* Parte inferior */}
          <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 text-[0.6rem] tracking-[0.13em] text-ivory/25 sm:flex-row sm:items-center sm:justify-between">
            <p className="uppercase">
              © {currentYear} Emiliano Gabriel Rossotti
            </p>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              <p className="uppercase">
                Todos los derechos reservados
              </p>

              <span
                aria-hidden="true"
                className="hidden h-3 w-px bg-white/15 sm:block"
              />

              <Link
                aria-label="Visitar el portfolio de Novaire Studio"
                className="group inline-flex items-center gap-2 uppercase text-ivory/35 transition-colors duration-300 hover:text-sage"
                href="https://novaire-psi.vercel.app/"
                rel="noreferrer"
                target="_blank"
              >
                <span>
                  Desarrollado por{" "}
                  <strong className="font-semibold text-ivory/55 transition-colors duration-300 group-hover:text-sage">
                    Novaire Studio
                  </strong>
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  size={13}
                  strokeWidth={1.6}
                />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}