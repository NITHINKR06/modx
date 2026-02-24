import React, { useState, useEffect } from "react";
import { MagneticButton } from "./MagneticButton";
import { useMousePosition } from "@/hooks/useMousePosition";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryCTA: { text: string; icon?: React.ReactNode; onClick?: () => void };
  secondaryCTA: { text: string; icon?: React.ReactNode; onClick?: () => void };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const mousePos = useMousePosition();

  useEffect(() => {
    setAnimationPhase(1);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center pt-20">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-gradient opacity-40" />

      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 tech-grid opacity-30" />

      {/* Spotlight effect following cursor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(62, 87, 223, 0.15), transparent 80%)`,
          transition: "background 0.1s ease-out",
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full filter blur-3xl shape-float-1" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full filter blur-3xl shape-float-2" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-300/15 rounded-full filter blur-3xl shape-float-3" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
        {/* Animated Title */}
        <div className={`mb-8 transition-all duration-1000 ${animationPhase ? "opacity-100" : "opacity-0 translate-y-10"
          }`}>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-foreground mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent animate-blur-in">
              {title}
            </span>
          </h1>
        </div>

        {/* Animated Subtitle */}
        <div className={`mb-12 transition-all duration-1000 delay-200 ${animationPhase ? "opacity-100" : "opacity-0 translate-y-10"
          }`}>
          <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-300 ${animationPhase ? "opacity-100" : "opacity-0 translate-y-10"
          }`}>
          <MagneticButton variant="primary" size="lg" onClick={primaryCTA.onClick}>
            {primaryCTA.icon}
            {primaryCTA.text}
          </MagneticButton>
          <MagneticButton variant="secondary" size="lg" onClick={secondaryCTA.onClick}>
            {secondaryCTA.icon}
            {secondaryCTA.text}
          </MagneticButton>
        </div>
      </div>

      {/* Gradient Divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
};
