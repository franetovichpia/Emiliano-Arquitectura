"use client";

import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { cn } from "@/utils/cn";

type Breakpoint = "md" | "lg";

type StackCardsProps = {
  children: ReactNode;
  /** Clases del contenedor (la grilla de siempre). */
  className?: string;
  /** Clases extra por card, en orden (por ejemplo, columnas en desktop). */
  itemClassNames?: readonly string[];
  /** Fondo opaco detrás de cada card mientras se apila. */
  underlayClassName?: string;
  /** Hasta qué ancho se apilan (debajo de md o de lg). */
  below?: Breakpoint;
};

// Las clases tienen que estar escritas completas para que
// Tailwind las detecte.
const stickyClasses: Record<Breakpoint, string> = {
  md: "max-md:sticky max-md:top-[var(--stack-top)]",
  lg: "max-lg:sticky max-lg:top-[var(--stack-top)]",
};

const mediaQueries: Record<Breakpoint, string> = {
  md: "(max-width: 767.98px)",
  lg: "(max-width: 1023.98px)",
};

const STACK_TOP_REM = 5.5;
const STACK_STEP_REM = 0.85;

function useMatchMedia(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const update = () => {
      setMatches(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, [query]);

  return matches;
}

/**
 * En mobile, cada card queda fija arriba al hacer scroll y la
 * siguiente se le apoya encima. Mientras la tapan, la de abajo
 * se achica y se oscurece un poco; al volver a subir, recupera
 * su tamaño. En desktop se ve la grilla normal.
 */
export function StackCards({
  children,
  className,
  itemClassNames,
  underlayClassName,
  below = "lg",
}: StackCardsProps) {
  const items = Children.toArray(children);

  // Cada card se guarda acá cuando se monta, para que la
  // anterior pueda seguir su posición.
  const [elements, setElements] = useState<
    readonly (HTMLDivElement | null)[]
  >([]);

  const registerItem = useCallback(
    (index: number, element: HTMLDivElement | null) => {
      setElements((current) => {
        if (current[index] === element) {
          return current;
        }

        const next = [...current];
        next[index] = element;
        return next;
      });
    },
    [],
  );

  const isStacked = useMatchMedia(mediaQueries[below]);
  const shouldReduceMotion = useReducedMotion();
  const animate = isStacked && !shouldReduceMotion;

  return (
    <div className={className}>
      {items.map((child, index) => (
        <StackCardItem
          animate={animate}
          below={below}
          className={itemClassNames?.[index]}
          index={index}
          key={index}
          nextElement={elements[index + 1] ?? null}
          registerItem={registerItem}
          remaining={items.length - 1 - index}
          underlayClassName={underlayClassName}
        >
          {child}
        </StackCardItem>
      ))}
    </div>
  );
}

type StackCardItemProps = {
  children: ReactNode;
  index: number;
  remaining: number;
  below: Breakpoint;
  animate: boolean;
  className?: string;
  underlayClassName?: string;
  nextElement: HTMLDivElement | null;
  registerItem: (
    index: number,
    element: HTMLDivElement | null,
  ) => void;
};

function StackCardItem({
  children,
  index,
  remaining,
  below,
  animate,
  className,
  underlayClassName,
  nextElement,
  registerItem,
}: StackCardItemProps) {
  const setItemRef = useCallback(
    (element: HTMLDivElement | null) => {
      registerItem(index, element);
    },
    [registerItem, index],
  );

  // Solo se sigue el scroll cuando la card siguiente ya está en
  // la página (si no, motion avisa que el ref no existe).
  const nextRef = useMemo(
    () => ({ current: nextElement }),
    [nextElement],
  );

  // 0 cuando la card siguiente entra por abajo de la pantalla,
  // 1 cuando ya llegó arriba y tapa a esta.
  const { scrollYProgress } = useScroll({
    target: nextElement ? nextRef : undefined,
    offset: ["start end", "start 20%"],
  });

  // Cuantas más cards quedan por apilarse encima, un poquito
  // más chica queda, para que se lea como una pila.
  const minScale = Math.max(0.86, 0.95 - remaining * 0.015);

  const scale = useTransform(scrollYProgress, [0, 1], [1, minScale]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.72]);
  const filter = useTransform(
    brightness,
    (value) => `brightness(${value})`,
  );

  const style = {
    "--stack-top": `${STACK_TOP_REM + index * STACK_STEP_REM}rem`,
  } as CSSProperties;

  const isAnimated = animate && nextElement !== null;

  return (
    <div
      className={cn(stickyClasses[below], className)}
      ref={setItemRef}
      style={style}
    >
      <motion.div
        className={cn("h-full origin-top", underlayClassName)}
        style={
          isAnimated
            ? {
                scale,
                filter,
              }
            : undefined
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
