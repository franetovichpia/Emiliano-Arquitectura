import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/utils/cn";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "outline" | "light";
  showArrow?: boolean;
};

const variants = {
  primary:
    "border-terracotta bg-terracotta text-ivory hover:border-clay hover:bg-clay",
  outline:
    "border-forest/30 bg-transparent text-forest hover:border-forest hover:bg-forest/5",
  light:
    "border-ivory/30 bg-transparent text-ivory hover:border-ivory hover:bg-white/10",
};

export function ButtonLink({
  children,
  className,
  showArrow = false,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-3 rounded-full border px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] no-underline transition-all duration-300 hover:-translate-y-0.5",
        variants[variant],
        className,
      )}
      {...props}
    >
      <span>{children}</span>

      {showArrow && (
        <ArrowUpRight
          aria-hidden="true"
          size={16}
          strokeWidth={1.7}
        />
      )}
    </a>
  );
}
