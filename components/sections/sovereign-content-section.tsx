import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  ExternalLink,
  FileText,
  HeartPulse,
  Mail,
  MapPinned,
} from "lucide-react";
import {
  FaDropbox,
  FaGoogle,
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  sovereignContentGroups,
  type SovereignContentLink,
} from "@/data/sovereign-content";

type Platform =
  | "youtube"
  | "whatsapp"
  | "telegram"
  | "instagram"
  | "dropbox"
  | "google"
  | "map"
  | "email"
  | "document";

const platformStyles: Record<Platform, string> = {
  youtube:
    "border-red-200/20 bg-[linear-gradient(135deg,#451916_0%,#171312_100%)] text-red-100",
  whatsapp:
    "border-emerald-200/20 bg-[linear-gradient(135deg,#123d30_0%,#111c17_100%)] text-emerald-100",
  telegram:
    "border-sky-200/20 bg-[linear-gradient(135deg,#173c55_0%,#111d25_100%)] text-sky-100",
  instagram:
    "border-rose-200/20 bg-[linear-gradient(135deg,#56213f_0%,#31182b_55%,#171313_100%)] text-rose-100",
  dropbox:
    "border-blue-200/20 bg-[linear-gradient(135deg,#173c69_0%,#121a29_100%)] text-blue-100",
  google:
    "border-amber-200/20 bg-[linear-gradient(135deg,#4b3a1b_0%,#211b12_100%)] text-amber-100",
  map:
    "border-lime-200/20 bg-[linear-gradient(135deg,#2b4024_0%,#151e14_100%)] text-lime-100",
  email:
    "border-orange-200/20 bg-[linear-gradient(135deg,#512b1c_0%,#231713_100%)] text-orange-100",
  document:
    "border-stone-200/20 bg-[linear-gradient(135deg,#403c34_0%,#1b1916_100%)] text-stone-100",
};

function getPlatform(link: SovereignContentLink): Platform {
  const source = `${link.type} ${link.href}`.toLowerCase();

  if (
    source.includes("youtube") ||
    source.includes("youtu.be")
  ) {
    return "youtube";
  }

  if (source.includes("whatsapp")) {
    return "whatsapp";
  }

  if (
    source.includes("telegram") ||
    source.includes("t.me")
  ) {
    return "telegram";
  }

  if (source.includes("instagram")) {
    return "instagram";
  }

  if (source.includes("dropbox")) {
    return "dropbox";
  }

  if (
    source.includes("google") ||
    source.includes("formulario")
  ) {
    return "google";
  }

  if (
    source.includes("mapa") ||
    source.includes("openstreetmap")
  ) {
    return "map";
  }

  if (
    source.includes("correo") ||
    source.includes("mailto:")
  ) {
    return "email";
  }

  return "document";
}

function getPlatformName(platform: Platform) {
  const platformNames: Record<Platform, string> = {
    youtube: "YouTube",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    instagram: "Instagram",
    dropbox: "Dropbox",
    google: "Google Forms",
    map: "Mapa interactivo",
    email: "Correo electrónico",
    document: "Documento",
  };

  return platformNames[platform];
}

function PlatformIcon({ platform }: { platform: Platform }) {
  const className = "size-8 sm:size-9";

  if (platform === "youtube") {
    return (
      <FaYoutube
        aria-hidden="true"
        className={className}
      />
    );
  }

  if (platform === "whatsapp") {
    return (
      <FaWhatsapp
        aria-hidden="true"
        className={className}
      />
    );
  }

  if (platform === "telegram") {
    return (
      <FaTelegramPlane
        aria-hidden="true"
        className={className}
      />
    );
  }

  if (platform === "instagram") {
    return (
      <FaInstagram
        aria-hidden="true"
        className={className}
      />
    );
  }

  if (platform === "dropbox") {
    return (
      <FaDropbox
        aria-hidden="true"
        className={className}
      />
    );
  }

  if (platform === "google") {
    return (
      <FaGoogle
        aria-hidden="true"
        className={className}
      />
    );
  }

  if (platform === "map") {
    return (
      <MapPinned
        aria-hidden="true"
        className={className}
        strokeWidth={1.4}
      />
    );
  }

  if (platform === "email") {
    return (
      <Mail
        aria-hidden="true"
        className={className}
        strokeWidth={1.4}
      />
    );
  }

  return (
    <FileText
      aria-hidden="true"
      className={className}
      strokeWidth={1.4}
    />
  );
}

function getLinkDescription(link: SovereignContentLink) {
  const label = link.label.toLocaleLowerCase("es");

  if (label.includes("video introductorio")) {
    return "Presentación audiovisual introductoria de ActivaTArgentina.";
  }

  if (
    label.includes("objetivos") &&
    label.includes("participación")
  ) {
    return "Documento con los objetivos y acuerdos de participación.";
  }

  if (
    label.includes("coordinar grupos") ||
    label.includes("coordinadores")
  ) {
    return "Acuerdos para coordinar los grupos de integración.";
  }

  if (
    label.includes("inscripción") ||
    label.includes("cuatro acuerdos")
  ) {
    return "Formulario de inscripción a los cuatro acuerdos fundamentales.";
  }

  if (label.includes("activación nacional")) {
    return "Acceso al grupo nacional de activación en WhatsApp.";
  }

  if (
    label.includes("grupos de integración") &&
    !label.includes("mapa")
  ) {
    return "Espacio de comunicación de los grupos de integración.";
  }

  if (label.includes("mapa")) {
    return "Mapa territorial de los grupos de integración.";
  }

  if (
    label.includes("información") ||
    label.includes("noticias") ||
    label.includes("novedades")
  ) {
    return "Canal de información, noticias y novedades.";
  }

  if (label.includes("youtube")) {
    return "Canal audiovisual oficial de ActivaTArgentina.";
  }

  if (label.includes("activatargentina")) {
    return "Perfil de ActivaTArgentina en Instagram.";
  }

  if (
    label.includes("@") ||
    link.href.startsWith("mailto:")
  ) {
    return "Canal de contacto por correo electrónico.";
  }

  return `Acceso al recurso ${link.label}.`;
}

function MiniResourceCard({
  link,
}: {
  link: SovereignContentLink;
}) {
  const platform = getPlatform(link);
  const opensNewTab = !link.href.startsWith("mailto:");

  return (
    <Link
      aria-label={`${link.label}. Abrir en ${getPlatformName(platform)}`}
      className="group/card block h-full rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4"
      href={link.href}
      rel={opensNewTab ? "noopener noreferrer" : undefined}
      target={opensNewTab ? "_blank" : undefined}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-forest-deep/10 bg-paper shadow-[0_1rem_3rem_rgb(0_0_0/0.12)] transition duration-500 group-hover/card:-translate-y-1 group-hover/card:shadow-[0_1.5rem_4rem_rgb(0_0_0/0.18)]">
        <div
          className={`relative flex min-h-36 items-center justify-between overflow-hidden border-b p-6 ${platformStyles[platform]}`}
        >
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-16 size-40 rounded-full border border-current opacity-10"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-20 right-14 size-36 rounded-full border border-current opacity-10"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(115deg,transparent_20%,rgb(255_255_255/0.1)_50%,transparent_80%)] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          />

          <div className="relative z-10 grid size-14 place-items-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md">
            <PlatformIcon platform={platform} />
          </div>

          <ArrowUpRight
            aria-hidden="true"
            className="relative z-10 transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:translate-x-1"
            size={22}
            strokeWidth={1.4}
          />

          <span className="absolute bottom-5 right-6 z-10 text-[0.58rem] font-semibold uppercase tracking-[0.16em] opacity-70">
            {getPlatformName(platform)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <span className="w-fit rounded-full border border-forest-deep/10 bg-white/50 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-terracotta">
            {link.type}
          </span>

          <h4 className="mt-5 font-sans text-lg font-medium leading-snug tracking-[-0.02em] text-forest-deep">
            {link.label}
          </h4>

          <p className="mt-3 text-sm leading-6 text-forest-deep/60">
            {getLinkDescription(link)}
          </p>

          <span className="mt-auto flex items-center gap-2 pt-7 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-forest-deep/50 transition-colors duration-300 group-hover/card:text-terracotta">
            Abrir recurso

            <ExternalLink
              aria-hidden="true"
              size={13}
              strokeWidth={1.5}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function SovereignContentSection() {
  return (
    <section
      aria-labelledby="sovereign-content-heading"
      className="relative scroll-mt-28 overflow-hidden bg-paper text-forest-deep"
      id="contenido-soberano"
    >
      <div
        aria-hidden="true"
        className="absolute -left-40 top-40 size-[32rem] rounded-full bg-sage/10 blur-3xl"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        <Reveal>
          <SectionHeading
            eyebrow="Contenido soberano"
            id="sovereign-content-heading"
            title="Salud soberana y educación soberana."
          />
        </Reveal>

        <div className="mt-16 space-y-6 lg:mt-20">
          {sovereignContentGroups.map((group, groupIndex) => {
            const isDark = group.theme === "dark";
            const GroupIcon =
              group.icon === "health"
                ? HeartPulse
                : BookOpen;

            return (
              <Reveal
                delay={0.08 + groupIndex * 0.08}
                key={group.title}
              >
                <div
                  className={
                    isDark
                      ? "relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-forest-deep p-6 text-ivory shadow-[0_2rem_6rem_rgb(0_0_0/0.2)] sm:p-8 lg:p-12"
                      : "relative overflow-hidden rounded-[2.25rem] border border-forest-deep/10 bg-sand/45 p-6 text-forest-deep shadow-[0_2rem_6rem_rgb(9_40_31/0.08)] backdrop-blur-md sm:p-8 lg:p-12"
                  }
                >
                  <div
                    aria-hidden="true"
                    className={
                      isDark
                        ? "absolute -right-24 -top-24 size-72 rounded-full border border-sage/15"
                        : "absolute -right-24 -top-24 size-72 rounded-full border border-forest-deep/10"
                    }
                  />

                  <div className="relative flex flex-col gap-8 border-b border-current/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p
                        className={
                          isDark
                            ? "text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sage"
                            : "text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-terracotta"
                        }
                      >
                        Área {group.number}
                      </p>

                      <h3 className="mt-5 font-sans text-[clamp(2rem,4vw,4rem)] font-light leading-none tracking-[-0.04em]">
                        {group.title}
                      </h3>
                    </div>

                    <div
                      className={
                        isDark
                          ? "grid size-14 place-items-center rounded-full border border-white/15 bg-white/5 text-sage backdrop-blur-md"
                          : "grid size-14 place-items-center rounded-full border border-forest-deep/10 bg-white/40 text-terracotta backdrop-blur-md"
                      }
                    >
                      <GroupIcon
                        aria-hidden="true"
                        size={23}
                        strokeWidth={1.4}
                      />
                    </div>
                  </div>

                  <div className="relative mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {group.items.map((item) => {
                      const hasLinks =
                        Boolean(item.links?.length);

                      return (
                        <div
                          className={
                            hasLinks
                              ? "lg:col-span-2"
                              : "h-full"
                          }
                          key={item.title}
                        >
                          <div
                            className={
                              isDark
                                ? "h-full rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-md sm:p-8"
                                : "h-full rounded-[1.75rem] border border-forest-deep/10 bg-white/35 p-6 backdrop-blur-md sm:p-8"
                            }
                          >
                            <div className="flex items-start justify-between gap-6">
                              <div>
                                <p
                                  className={
                                    isDark
                                      ? "text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-sage"
                                      : "text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-terracotta"
                                  }
                                >
                                  {item.action}
                                </p>

                                <h4 className="mt-4 font-sans text-2xl font-light leading-snug tracking-[-0.025em] sm:text-3xl">
                                  {item.title}
                                </h4>
                              </div>

                              <span
                                className={
                                  isDark
                                    ? "font-sans text-sm tracking-[0.16em] text-ivory/25"
                                    : "font-sans text-sm tracking-[0.16em] text-forest-deep/25"
                                }
                              >
                                {item.number}
                              </span>
                            </div>

                            {hasLinks ? (
                              <details className="group mt-9">
                                <summary
                                  className={
                                    isDark
                                      ? "flex cursor-pointer list-none items-center justify-between gap-6 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ivory transition duration-300 hover:border-sage/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage [&::-webkit-details-marker]:hidden"
                                      : "flex cursor-pointer list-none items-center justify-between gap-6 rounded-full border border-forest-deep/10 bg-white/40 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-forest-deep transition duration-300 hover:border-terracotta/40 hover:bg-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta [&::-webkit-details-marker]:hidden"
                                  }
                                >
                                  <span>
                                    Ver más recursos
                                  </span>

                                  <ChevronDown
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-open:rotate-180"
                                    size={18}
                                    strokeWidth={1.5}
                                  />
                                </summary>

                                <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                  {item.links?.map((link) => (
                                    <MiniResourceCard
                                      key={link.href}
                                      link={link}
                                    />
                                  ))}
                                </div>
                              </details>
                            ) : item.href ? (
                              <Link
                                className={
                                  isDark
                                    ? "group/link mt-9 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ivory transition duration-300 hover:border-sage/40 hover:bg-white/10 hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                                    : "group/link mt-9 inline-flex items-center gap-3 rounded-full border border-forest-deep/10 bg-white/35 px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-forest-deep transition duration-300 hover:border-terracotta/40 hover:bg-white/60 hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                                }
                                href={item.href}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                Abrir recurso

                                <ArrowUpRight
                                  aria-hidden="true"
                                  className="transition-transform duration-300 group-hover/link:-translate-y-1 group-hover/link:translate-x-1"
                                  size={16}
                                  strokeWidth={1.5}
                                />
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}