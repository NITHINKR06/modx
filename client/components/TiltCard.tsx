import React, { useRef, useState } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    const rotateX = (y / centerY) * 8;
    const rotateY = (x / centerX) * -8;

    setTilt({ x: rotateX, y: rotateY });
    setShine({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setShine({ x: 0, y: 0 });
  };

  const baseStyles = "rounded-2xl border border-border/50 overflow-hidden relative";

  const variants = {
    default: "bg-card/95 backdrop-blur-sm",
    glass: "glass-premium",
    gradient:
      "bg-gradient-to-br from-white/80 to-blue-50/50 backdrop-blur-sm border-white/30",
  };

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], "group", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.2s ease-out",
      }}
      {...props}
    >
      {/* Shine effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${shine.x}px ${shine.y}px, white, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
