"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/app/container";
import {
  communityNavigation,
  mainNavigation,
} from "@/data/navigation";
import { cn } from "@/utils/cn";

export function SiteHeader() {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] =
    useState(false);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const isCommunityPage =
    pathname.startsWith(
      "/proyectos-integrativos",
    );

  const navigation = isCommunityPage
    ? communityNavigation
    : mainNavigation;

  const action = isCommunityPage
    ? {
        label: "Sitio profesional",
        href: "/#inicio",
      }
    : {
        label: "Solicitar proyecto",
        href: "/#contacto",
      };

  const mobileMenuTitle = isCommunityPage
    ? "Proyectos integrativos"
    : "Navegación profesional";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] pt-3 sm:pt-4">
      <Container className="pointer-events-auto">
        <div
          className={cn(
            "relative flex min-h-16 items-center justify-between rounded-[1.2rem] border px-3 py-2 transition-all duration-500 sm:px-4",
            isScrolled
              ? "glass-surface border-white/50 shadow-[0_1rem_3rem_rgb(11_38_55/0.14)]"
              : "border-white/30 bg-paper/80 shadow-[0_0.75rem_2.5rem_rgb(11_38_55/0.1)] backdrop-blur-xl",
          )}
        >
          {/* Identidad */}
          <Link
            aria-label="Emiliano Gabriel Rossotti, ir a la página principal"
            className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            href="/#inicio"
            onClick={closeMenu}
          >
            <span className="grid size-11 place-items-center rounded-xl border border-forest-deep/15 bg-white/40 font-serif text-lg text-forest-deep backdrop-blur-xl transition-colors duration-300 group-hover:border-terracotta/40 group-hover:bg-white/65">
              EGR
            </span>

            <span className="hidden leading-tight sm:block">
              <span className="block text-[0.67rem] font-semibold uppercase tracking-[0.16em] text-forest-deep">
                Emiliano Gabriel
              </span>

              <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.16em] text-forest-deep/55">
                Rossotti
              </span>
            </span>
          </Link>

          {/* Navegación desktop */}
          <nav
            aria-label={
              isCommunityPage
                ? "Navegación de proyectos integrativos"
                : "Navegación profesional"
            }
            className="hidden lg:block"
          >
            <ul className="flex items-center gap-0.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="relative rounded-full px-3 py-3 text-[0.63rem] font-medium uppercase tracking-[0.11em] text-forest-deep/65 transition-colors duration-300 after:absolute after:bottom-2 after:left-3 after:h-px after:w-0 after:bg-terracotta after:transition-all after:duration-300 hover:text-forest-deep hover:after:w-[calc(100%-1.5rem)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                    href={item.href}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Acciones */}
          <div className="flex shrink-0 items-center gap-2">
            <ButtonLink
              className="hidden min-h-10 px-4 lg:inline-flex"
              href={action.href}
              showArrow
            >
              {action.label}
            </ButtonLink>

            <button
              aria-controls="mobile-navigation"
              aria-expanded={isMenuOpen}
              aria-label={
                isMenuOpen
                  ? "Cerrar menú"
                  : "Abrir menú"
              }
              className={cn(
                "glass-interactive grid size-11 place-items-center rounded-full border backdrop-blur-xl lg:hidden",
                isMenuOpen
                  ? "border-forest-deep bg-forest-deep text-ivory"
                  : "border-forest-deep/15 bg-white/40 text-forest-deep",
              )}
              onClick={() => {
                setIsMenuOpen(
                  (currentValue) =>
                    !currentValue,
                );
              }}
              type="button"
            >
              {isMenuOpen ? (
                <X
                  aria-hidden="true"
                  size={20}
                  strokeWidth={1.7}
                />
              ) : (
                <Menu
                  aria-hidden="true"
                  size={20}
                  strokeWidth={1.7}
                />
              )}
            </button>
          </div>

          {/* Menú mobile */}
          {isMenuOpen ? (
            <div
              className="absolute left-0 right-0 top-[calc(100%+0.65rem)] max-h-[calc(100svh-7rem)] overflow-y-auto rounded-[1.35rem] border border-blueprint-line/20 bg-blueprint-deep/98 text-ivory shadow-[0_2rem_5rem_rgb(0_0_0/0.38)] backdrop-blur-2xl lg:hidden"
              id="mobile-navigation"
            >
              <nav
                aria-label={
                  isCommunityPage
                    ? "Navegación móvil de proyectos integrativos"
                    : "Navegación móvil profesional"
                }
                className="p-4 sm:p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-5 px-3 py-2">
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-sage">
                    {mobileMenuTitle}
                  </p>

                  <Link
                    className="shrink-0 text-[0.55rem] uppercase tracking-[0.15em] text-ivory/35"
                    href="/admin/login"
                    onClick={closeMenu}
                  >
                    Emiliano Rossotti
                  </Link>
                </div>

                <ul className="flex flex-col">
                  {navigation.map(
                    (item, index) => (
                      <li
                        className="border-b border-white/10 last:border-b-0"
                        key={item.href}
                      >
                        <Link
                          className="group flex items-center justify-between rounded-xl px-3 py-3.5 font-sans text-xl font-light tracking-[-0.025em] text-paper transition-colors duration-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                          href={item.href}
                          onClick={closeMenu}
                        >
                          <span>{item.label}</span>

                          <span className="text-[0.56rem] font-medium uppercase tracking-[0.14em] text-sage/60 transition-colors group-hover:text-sage">
                            {String(
                              index + 1,
                            ).padStart(2, "0")}
                          </span>
                        </Link>
                      </li>
                    ),
                  )}
                </ul>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <ButtonLink
                    className="flex min-h-11 w-full"
                    href={action.href}
                    showArrow
                  >
                    {action.label}
                  </ButtonLink>
                </div>

                {isCommunityPage ? (
                  <p className="mt-4 px-3 text-xs leading-5 text-ivory/40">
                    Volver a los servicios, proyectos
                    profesionales y contacto de Emiliano.
                  </p>
                ) : null}
              </nav>
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}