import React from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient";
  children: React.ReactNode;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  variant = "default",
  className,
  children,
  ...props
}) => {
  const baseStyles = "rounded-2xl border border-border/50 overflow-hidden relative";

  const variants = {
    default: "bg-card/95 backdrop-blur-sm",
    glass: "glass-premium",
    gradient:
      "bg-gradient-to-br from-white/80 to-blue-50/50 backdrop-blur-sm border-white/30",
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};
