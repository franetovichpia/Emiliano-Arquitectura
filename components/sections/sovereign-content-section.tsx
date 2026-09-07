import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
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
import { Container } from "@/app/container";
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
    "border-red-200/20 bg-[#3b1715] text-red-100",
  whatsapp:
    "border-emerald-200/20 bg-[#123d30] text-emerald-100",
  telegram:
    "border-sky-200/20 bg-[#173c55] text-sky-100",
  instagram:
    "border-rose-200/20 bg-[#56213f] text-rose-100",
  dropbox:
    "border-blue-200/20 bg-[#173c69] text-blue-100",
  google:
    "border-amber-200/20 bg-[#4b3a1b] text-amber-100",
  map:
    "border-lime-200/20 bg-[#2b4024] text-lime-100",
  email:
    "border-orange-200/20 bg-[#512b1c] text-orange-100",
  document:
    "border-stone-200/20 bg-[#403c34] text-stone-100",
};

function getPlatform(
  link: SovereignContentLink,
): Platform {
  const source =
    `${link.type} ${link.href}`.toLowerCase();

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

function getPlatformName(
  platform: Platform,
) {
  const names: Record<Platform, string> = {
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

  return names[platform];
}

function PlatformIcon({
  platform,
}: {
  platform: Platform;
}) {
  const className = "size-5";

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
        strokeWidth={1.5}
      />
    );
  }

  if (platform === "email") {
    return (
      <Mail
        aria-hidden="true"
        className={className}
        strokeWidth={1.5}
      />
    );
  }

  return (
    <FileText
      aria-hidden="true"
      className={className}
      strokeWidth={1.5}
    />
  );
}

function MiniResourceCard({
  link,
}: {
  link: SovereignContentLink;
}) {
  const platform = getPlatform(link);
  const opensNewTab =
    !link.href.startsWith("mailto:");

  return (
    <Link
      aria-label={`${link.label}. Abrir en ${getPlatformName(platform)}`}
      className="group flex min-h-20 items-center gap-3 rounded-[1rem] border border-forest-deep/10 bg-paper p-3.5 shadow-[0_0.75rem_2rem_rgb(0_0_0/0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-terracotta/30 hover:shadow-[0_1rem_2.5rem_rgb(0_0_0/0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
      href={link.href}
      rel={
        opensNewTab
          ? "noopener noreferrer"
          : undefined
      }
      target={
        opensNewTab
          ? "_blank"
          : undefined
      }
    >
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-[0.8rem] border ${platformStyles[platform]}`}
      >
        <PlatformIcon platform={platform} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-terracotta">
          {link.type}
        </span>

        <span className="mt-1 block text-sm font-medium leading-5 text-forest-deep">
          {link.label}
        </span>
      </span>

      <ArrowUpRight
        aria-hidden="true"
        className="shrink-0 text-forest-deep/30 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-terracotta"
        size={15}
        strokeWidth={1.5}
      />
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
        className="absolute -left-40 top-40 size-[28rem] rounded-full bg-sage/[0.08] blur-3xl"
      />

      <Container className="relative py-20 sm:py-24 lg:py-28">
        {/* Encabezado compacto */}
        <Reveal>
          <div className="max-w-4xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-terracotta">
              Contenido soberano
            </p>

            <h2
              className="mt-4 font-serif text-[clamp(2.4rem,4vw,4.6rem)] font-medium leading-[0.95] tracking-[-0.04em] text-forest-deep"
              id="sovereign-content-heading"
            >
              Salud soberana y educación soberana.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 space-y-4 lg:mt-14">
          {sovereignContentGroups.map(
            (group, groupIndex) => {
              const isDark =
                group.theme === "dark";

              const GroupIcon =
                group.icon === "health"
                  ? HeartPulse
                  : BookOpen;

              return (
                <Reveal
                  delay={
                    0.06 +
                    groupIndex * 0.06
                  }
                  key={group.title}
                >
                  <article
                    className={
                      isDark
                        ? "relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-forest-deep p-5 text-ivory shadow-[0_1.5rem_4rem_rgb(0_0_0/0.16)] sm:p-6 lg:p-7"
                        : "relative overflow-hidden rounded-[1.5rem] border border-forest-deep/10 bg-sand/40 p-5 text-forest-deep shadow-[0_1.5rem_4rem_rgb(9_40_31/0.07)] backdrop-blur-md sm:p-6 lg:p-7"
                    }
                  >
                    <div
                      aria-hidden="true"
                      className={
                        isDark
                          ? "absolute -right-20 -top-20 size-52 rounded-full border border-sage/10"
                          : "absolute -right-20 -top-20 size-52 rounded-full border border-forest-deep/10"
                      }
                    />

                    {/* Encabezado del área */}
                    <div className="relative flex items-center justify-between gap-5 border-b border-current/10 pb-5">
                      <div>
                        <p
                          className={
                            isDark
                              ? "text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-sage"
                              : "text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-terracotta"
                          }
                        >
                          Área {group.number}
                        </p>

                        <h3 className="mt-2 font-sans text-[clamp(1.4rem,2.5vw,2.3rem)] font-light leading-tight tracking-[-0.03em]">
                          {group.title}
                        </h3>
                      </div>

                      <div
                        className={
                          isDark
                            ? "grid size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-sage"
                            : "grid size-10 shrink-0 place-items-center rounded-full border border-forest-deep/10 bg-white/40 text-terracotta"
                        }
                      >
                        <GroupIcon
                          aria-hidden="true"
                          size={18}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    {/* Recursos del área */}
                    <div className="relative mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {group.items.map(
                        (item) => {
                          const hasLinks =
                            Boolean(
                              item.links?.length,
                            );

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
                                    ? "h-full rounded-[1.15rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-md"
                                    : "h-full rounded-[1.15rem] border border-forest-deep/10 bg-white/35 p-5 backdrop-blur-md"
                                }
                              >
                                <div className="flex items-start justify-between gap-5">
                                  <div>
                                    <p
                                      className={
                                        isDark
                                          ? "text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-sage"
                                          : "text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-terracotta"
                                      }
                                    >
                                      {item.action}
                                    </p>

                                    <h4 className="mt-2 font-sans text-lg font-light leading-snug tracking-[-0.02em] sm:text-xl">
                                      {item.title}
                                    </h4>
                                  </div>

                                  <span
                                    className={
                                      isDark
                                        ? "text-xs tracking-[0.15em] text-ivory/25"
                                        : "text-xs tracking-[0.15em] text-forest-deep/25"
                                    }
                                  >
                                    {item.number}
                                  </span>
                                </div>

                                {hasLinks ? (
                                  <details className="group mt-5">
                                    <summary
                                      className={
                                        isDark
                                          ? "flex min-h-10 cursor-pointer list-none items-center justify-between gap-4 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ivory transition duration-300 hover:border-sage/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage [&::-webkit-details-marker]:hidden"
                                          : "flex min-h-10 cursor-pointer list-none items-center justify-between gap-4 rounded-full border border-forest-deep/10 bg-white/40 px-4 py-2.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-forest-deep transition duration-300 hover:border-terracotta/40 hover:bg-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta [&::-webkit-details-marker]:hidden"
                                      }
                                    >
                                      <span>
                                        Ver más recursos
                                      </span>

                                      <ChevronDown
                                        aria-hidden="true"
                                        className="transition-transform duration-300 group-open:rotate-180"
                                        size={16}
                                        strokeWidth={1.5}
                                      />
                                    </summary>

                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                      {item.links?.map(
                                        (link) => (
                                          <MiniResourceCard
                                            key={
                                              link.href
                                            }
                                            link={
                                              link
                                            }
                                          />
                                        ),
                                      )}
                                    </div>
                                  </details>
                                ) : item.href ? (
                                  <Link
                                    className={
                                      isDark
                                        ? "group/link mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ivory transition duration-300 hover:border-sage/40 hover:bg-white/10 hover:text-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                                        : "group/link mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-forest-deep/10 bg-white/35 px-4 py-2.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-forest-deep transition duration-300 hover:border-terracotta/40 hover:bg-white/60 hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                                    }
                                    href={item.href}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                  >
                                    Abrir recurso

                                    <ArrowUpRight
                                      aria-hidden="true"
                                      className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                      size={14}
                                      strokeWidth={1.5}
                                    />
                                  </Link>
                                ) : null}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            },
          )}
        </div>
      </Container>
    </section>
  );
}