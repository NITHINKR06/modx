import React from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import { Section } from "@/components/Section";
import {
  Users,
  Rocket,
  Lightbulb,
  Briefcase,
  ArrowRight,
} from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Form cross-functional teams with fellow students. Share ideas, assign tasks, and build together in real-time. Our platform brings engineers, designers, and project managers into one seamless workspace.",
      highlights: ["Real-time collaboration", "Role-based access", "Task management", "Team chat"],
    },
    {
      icon: Rocket,
      title: "Project Showcasing",
      description:
        "Publish your finished projects for the entire MODX community and beyond. Attach demos, screenshots, tech stacks, and GitHub repos so recruiters and mentors can see your best work.",
      highlights: ["Public project pages", "Image galleries", "Live demo links", "GitHub integration"],
    },
    {
      icon: Lightbulb,
      title: "Innovation Hub",
      description:
        "A dedicated space to pitch ideas, get feedback, and find collaborators. From hackathon concepts to semester-long builds, the Innovation Hub is where every project starts.",
      highlights: ["Idea pitching", "Community voting", "Mentor matching", "Hackathon support"],
    },
    {
      icon: Briefcase,
      title: "Student Portfolio Building",
      description:
        "Every project you complete on MODX automatically becomes part of your professional portfolio. Share your MODX profile link with employers to prove your real-world experience.",
      highlights: ["Auto-generated portfolio", "Shareable profile link", "Skills tracking", "Achievement badges"],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background dark:bg-slate-950">
      <Navigation />

      {/* Hero Section */}
      <Section className="pt-32 pb-12">
        <div className="text-center reveal">
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6">
            What MODX Offers
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Everything students need to innovate, collaborate, and build a
            professional portfolio
          </p>
        </div>
      </Section>

      {/* Features Grid — 2x2 */}
      <Section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <TiltCard
              key={idx}
              variant="glass"
              className="p-6 md:p-10 flex flex-col reveal cursor-pointer group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6 glow-soft group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-foreground/70 mb-6 flex-1">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.highlights.map((h) => (
                  <span
                    key={h}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16">
        <TiltCard variant="gradient" className="p-6 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Join MODX and turn your ideas into real projects. No experience
            required — just bring your curiosity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <MagneticButton variant="primary" size="lg">
                <Rocket size={20} /> Get Started
              </MagneticButton>
            </Link>
            <Link to="/about">
              <MagneticButton variant="secondary" size="lg">
                Learn More <ArrowRight size={18} />
              </MagneticButton>
            </Link>
          </div>
        </TiltCard>
      </Section>

      <Footer />
    </div>
  );
};

export default Features;
