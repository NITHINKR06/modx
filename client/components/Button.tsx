import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-300 ease-out inline-flex items-center justify-center gap-2 cursor-pointer";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:shadow-primary/50 active:scale-95",
    secondary:
      "bg-gradient-to-r from-accent to-blue-400 text-white hover:shadow-lg hover:shadow-accent/50 active:scale-95",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/10 active:scale-95",
    glass:
      "glass text-foreground hover:border-primary/50 active:scale-95",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
