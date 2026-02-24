import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  animated = false,
  ...props
}) => {
  return (
    <section
      className={cn(
        "w-full py-20 md:py-32 px-4 md:px-6",
        animated && "reveal",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
};
