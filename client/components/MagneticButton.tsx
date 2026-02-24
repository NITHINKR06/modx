import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMousePosition } from "@/hooks/useMousePosition";

interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  magnetic?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  magnetic = true,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const mousePos = useMousePosition();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = mousePos.x - centerX;
    const distY = mousePos.y - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < 100) {
      const force = 1 - distance / 100;
      setOffset({
        x: (distX / distance) * force * 15,
        y: (distY / distance) * force * 15,
      });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const baseStyles =
    "font-semibold rounded-lg transition-all duration-300 ease-out inline-flex items-center justify-center gap-2 cursor-pointer relative";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-2xl hover:shadow-primary/40 active:scale-95",
    secondary:
      "bg-gradient-to-r from-accent to-blue-400 text-white hover:shadow-2xl hover:shadow-accent/40 active:scale-95",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/10 active:scale-95",
    glass: "glass-premium text-foreground hover:border-primary/50 active:scale-95",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        "magnetic-btn",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
