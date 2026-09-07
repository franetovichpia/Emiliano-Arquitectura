"use client";

import type { ReactNode } from "react";
import {
  useEffect,
  useState,
} from "react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] =
    useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 768px)",
    );

    const updateViewport = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateViewport();

    mediaQuery.addEventListener(
      "change",
      updateViewport,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateViewport,
      );
    };
  }, []);

  const shouldAnimate =
    isDesktop && !shouldReduceMotion;

  return (
    <motion.div
      className={className}
      initial={false}
      transition={{
        delay: shouldAnimate ? delay : 0,
        duration: shouldAnimate ? 0.65 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{
        amount: 0.08,
        margin: "0px 0px -5% 0px",
        once: true,
      }}
      whileInView={
        shouldAnimate
          ? {
              opacity: [0.86, 1],
              y: [
                Math.min(distance, 18),
                0,
              ],
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}