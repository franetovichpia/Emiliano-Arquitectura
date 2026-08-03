"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { navigationItems } from "@/data/navigation";
import { cn } from "@/utils/cn";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-forest/10 bg-ivory/90 shadow-[0_8px_30px_rgb(14_35_29/0.08)] backdrop-blur-xl"
          : "border-transparent bg-ivory",
      )}
    >
      <Container className="flex min-h-20 items-center justify-between gap-5">
        <a
          aria-label="Emiliano Gabriel Rossotti — Inicio"
          className="group flex items-center gap-3 no-underline"
          href="#inicio"
          onClick={closeMenu}
        >
          <span className="grid size-11 place-items-center border border-forest/30 font-serif text-lg font-semibold text-forest transition-colors group-hover:bg-forest group-hover:text-ivory">
            EGR
          </span>

          <span className="hidden max-w-32 text-[0.65rem] font-semibold uppercase leading-[1.35] tracking-[0.11em] text-forest sm:block">
            Emiliano Gabriel Rossotti
          </span>
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden xl:block"
        >
          <ul className="flex list-none items-center gap-6 p-0">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  className="text-[0.67rem] font-semibold uppercase tracking-[0.11em] text-smoke no-underline transition-colors hover:text-forest"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink
            className="hidden lg:inline-flex"
            href="#contacto"
          >
            Solicitar proyecto
          </ButtonLink>

          <button
            aria-controls="menu-mobile"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            className="grid size-11 place-items-center rounded-full border border-forest/20 text-forest xl:hidden"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            {isOpen ? (
              <X aria-hidden="true" size={20} />
            ) : (
              <Menu aria-hidden="true" size={20} />
            )}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden border-t border-forest/10 bg-ivory xl:hidden"
            exit={{ opacity: 0, height: 0 }}
            id="menu-mobile"
            initial={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Container className="py-5">
              <nav aria-label="Navegación móvil">
                <ul className="grid list-none gap-1 p-0">
                  {navigationItems.map((item, index) => (
                    <li key={item.href}>
                      <a
                        className="flex items-center justify-between border-b border-forest/10 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-forest no-underline"
                        href={item.href}
                        onClick={closeMenu}
                      >
                        <span>{item.label}</span>

                        <span
                          aria-hidden="true"
                          className="font-serif text-sm text-moss"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <ButtonLink
                className="mt-6 w-full"
                href="#contacto"
                onClick={closeMenu}
                showArrow
              >
                Solicitar proyecto integral
              </ButtonLink>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}