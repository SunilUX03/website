import { ReactNode } from "react";
import clsx from "clsx";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto w-full max-w-[1200px] px-6 md:px-10", className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  as: As = "section",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  id?: string;
}) {
  return (
    <As id={id} className={clsx("py-xxl md:py-section", className)}>
      {children}
    </As>
  );
}
