import { cn } from "@/utils/cn";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  id?: string;
  className?: string;
  tone?: "light" | "dark";
};

export function SectionHeading({
  eyebrow,
  title,
  id,
  className,
  tone = "light",
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div className={cn("max-w-2xl", className)}>
      <p
        className={cn(
          "text-[0.68rem] font-semibold uppercase tracking-[0.2em]",
          isDark ? "text-sage" : "text-terracotta",
        )}
      >
        {eyebrow}
      </p>

      <h2
        className={cn(
          "mt-5 font-serif text-[clamp(2.7rem,4.2vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.025em]",
          isDark ? "text-paper" : "text-forest-deep",
        )}
        id={id}
      >
        {title}
      </h2>
    </div>
  );
}