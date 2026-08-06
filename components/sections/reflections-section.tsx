import Link from "next/link";
import {
  ArrowUpRight,
  Mic,
} from "lucide-react";
import {
  FaTelegramPlane,
  FaYoutube,
} from "react-icons/fa";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  reflections,
  type ReflectionPlatform,
} from "@/data/reflections";
import { cn } from "@/utils/cn";

type ReflectionIconProps = {
  platform: ReflectionPlatform;
};

function ReflectionIcon({
  platform,
}: ReflectionIconProps) {
  if (platform === "youtube") {
    return (
      <FaYoutube
        aria-hidden="true"
        size={17}
      />
    );
  }

  if (platform === "telegram") {
    return (
      <FaTelegramPlane
        aria-hidden="true"
        size={16}
      />
    );
  }

  return (
    <Mic
      aria-hidden="true"
      size={17}
      strokeWidth={1.5}
    />
  );
}

const iconClasses: Record<ReflectionPlatform, string> = {
  youtube:
    "border-terracotta/45 bg-terracotta/15 text-[#e9a58c]",
  podcast:
    "border-sand/30 bg-sand/10 text-sand",
  telegram:
    "border-sage/40 bg-sage/10 text-[#bccab5]",
};

const lineClasses: Record<ReflectionPlatform, string> = {
  youtube: "bg-terracotta/70",
  podcast: "bg-sand/60",
  telegram: "bg-sage/65",
};

export function ReflectionsSection() {
  return (
    <section
      aria-labelledby="reflections-heading"
      className="relative isolate overflow-hidden bg-paper text-forest-deep"
      id="reflexiones"
    >
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-px w-full bg-forest-deep/10"
      />

      <div
        aria-hidden="true"
        className="absolute right-0 top-24 h-72 w-72 rounded-full border border-blueprint-line/10"
      />

      <Container className="relative py-20 sm:py-24 lg:py-28">
        {/* Encabezado */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Pensamiento y comunicación"
                id="reflections-heading"
                title="Reflexiones."
              />
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <Reveal delay={0.08}>
              <div className="max-w-2xl">
                <p className="font-sans text-[clamp(1.35rem,2.1vw,2.2rem)] font-light leading-relaxed tracking-[-0.025em] text-forest-deep">
                  Arquitectura, soberanía y Bien Común.
                </p>

                <p className="mt-4 text-sm leading-7 text-forest-deep/60">
                  Canal de YouTube, Podcast Metafórico y Canal de
                  Telegram.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Tres cards iguales */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reflections.map((reflection, index) => (
            <Reveal
              className="h-full"
              delay={0.06 + index * 0.07}
              key={reflection.title}
            >
              <article className="glass-surface-dark glass-interactive group relative flex h-full min-h-[14rem] flex-col overflow-hidden rounded-[1.3rem] p-5 text-ivory sm:p-6">
                {/* Plano lineal de fondo */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgb(131_174_190/0.5)_1px,transparent_1px),linear-gradient(90deg,rgb(131_174_190/0.5)_1px,transparent_1px)] [background-size:32px_32px]"
                />

                <div
                  aria-hidden="true"
                  className="absolute -right-6 -top-7 font-sans text-[6rem] font-light leading-none tracking-[-0.08em] text-ivory/[0.035]"
                >
                  {reflection.number}
                </div>

                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-2/3",
                    lineClasses[reflection.platform],
                  )}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div
                    className={cn(
                      "grid size-9 place-items-center rounded-full border",
                      iconClasses[reflection.platform],
                    )}
                  >
                    <ReflectionIcon
                      platform={reflection.platform}
                    />
                  </div>

                  <span className="text-[0.58rem] font-medium tracking-[0.16em] text-ivory/30">
                    {reflection.number}
                  </span>
                </div>

                <div className="relative z-10 mt-auto pt-8">
                  <p
                    className={cn(
                      "text-[0.56rem] font-semibold uppercase tracking-[0.17em]",
                      reflection.platform === "youtube" &&
                        "text-[#e9a58c]",
                      reflection.platform === "podcast" &&
                        "text-sand",
                      reflection.platform === "telegram" &&
                        "text-[#bccab5]",
                    )}
                  >
                    {reflection.format}
                  </p>

                  <h3 className="mt-2.5 max-w-sm font-sans text-xl font-light leading-snug tracking-[-0.025em] text-ivory sm:text-2xl">
                    {reflection.title}
                  </h3>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    {reflection.href ? (
                      <Link
                        aria-label={`Abrir ${reflection.title}`}
                        className="group/link inline-flex items-center gap-2 text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-ivory/55 transition-colors duration-300 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                        href={reflection.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Acceder al contenido

                        <ArrowUpRight
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                          size={14}
                          strokeWidth={1.6}
                        />
                      </Link>
                    ) : (
                      <span className="text-[0.55rem] font-medium uppercase tracking-[0.14em] text-ivory/35">
                        Enlace pendiente
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}