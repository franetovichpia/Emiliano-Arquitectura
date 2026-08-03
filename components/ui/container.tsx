import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div className={cn("container-shell", className)} {...props}>
      {children}
    </div>
  );
}