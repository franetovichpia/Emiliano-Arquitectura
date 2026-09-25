import type { ReactNode } from "react";
import { Link } from "next-view-transitions";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/utils/cn";

type ButtonLinkVariant =
  | "primary"
  | "light"
  | "outline";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
  variant?: ButtonLinkVariant;
  showArrow?: boolean;
  ariaLabel?: string;
};

const variantClasses: Record<ButtonLinkVariant, string> = {
  primary:
    "border-white/20 bg-terracotta/90 text-white shadow-[0_1rem_2.5rem_rgb(184_98_69/0.22)] hover:border-white/35 hover:bg-terracotta",

  light:
    "border-white/20 bg-white/10 text-ivory shadow-[0_1rem_3rem_rgb(0_0_0/0.14)] hover:border-white/35 hover:bg-white/15",

  outline:
    "border-forest-deep/15 bg-white/35 text-forest-deep shadow-[0_1rem_3rem_rgb(24_27_23/0.08)] hover:border-terracotta/45 hover:bg-white/60",
};

export function ButtonLink({
  children,
  href,
  className,
  variant = "primary",
  showArrow = false,
  ariaLabel,
}: ButtonLinkProps) {
  return (
    <Link
      aria-label={ariaLabel}
      className={cn(
        "glass-interactive group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.13em] backdrop-blur-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta",
        variantClasses[variant],
        className,
      )}
      href={href}
    >
      <span>{children}</span>

      {showArrow ? (
        <ArrowUpRight
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          size={16}
          strokeWidth={1.7}
        />
      ) : null}
    </Link>
  );
}