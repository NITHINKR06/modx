import React from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import { Section } from "@/components/Section";
import {
  Zap,
  Brain,
  Shield,
  BarChart3,
  Users,
  Cpu,
  Workflow,
  Lock,
  Globe,
  Palette,
  Code,
  Rocket,
} from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience blazing-fast performance and instant feedback",
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Smart recommendations and intelligent automation",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Enterprise-grade security for your data and projects",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Deep insights with comprehensive analytics dashboard",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Real-time teamwork across the globe",
    },
    {
      icon: Cpu,
      title: "Scalable",
      description: "Grows with your ambitions, no limits",
    },
    {
      icon: Workflow,
      title: "Automation",
      description: "Smart workflows to boost productivity",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your privacy is our top priority",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Available everywhere, anytime",
    },
    {
      icon: Palette,
      title: "Customizable",
      description: "Tailor everything to your needs",
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Modern APIs and great documentation",
    },
    {
      icon: Rocket,
      title: "Always Improving",
      description: "Regular updates with new capabilities",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background dark:bg-slate-950">
      <Navigation />

      {/* Hero Section */}
      <Section className="pt-32 pb-12">
        <div className="text-center reveal">
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6">
            Powerful Features
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Everything you need to innovate, collaborate, and create amazing
            projects
          </p>
        </div>
      </Section>

      {/* Features Grid */}
      <Section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <TiltCard
              key={idx}
              variant="glass"
              className="p-8 flex flex-col reveal cursor-pointer group"
              style={{ animationDelay: `${(idx % 3) * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6 glow-soft group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-foreground/70 flex-1">{feature.description}</p>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* Feature Highlights */}
      <Section>
        <div className="mb-12 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Why Choose MODX?
          </h2>
        </div>

        <div className="space-y-12">
          {[
            {
              title: "Collaborative Innovation",
              description:
                "Work seamlessly with your team in real-time. Share ideas, feedback, and resources instantly. Our platform brings everyone together in one powerful workspace.",
              icon: Users,
            },
            {
              title: "Advanced Security",
              description:
                "Enterprise-grade encryption and security measures protect your intellectual property. We comply with all major data protection regulations.",
              icon: Shield,
            },
            {
              title: "Scale Without Limits",
              description:
                "From personal projects to large-scale initiatives, our infrastructure scales effortlessly to support your growth.",
              icon: Rocket,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row gap-8 items-center reveal group cursor-pointer"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-lg text-foreground/70">{item.description}</p>
              </div>
              <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0 glow-soft group-hover:scale-110 transition-transform duration-300">
                <item.icon size={64} className="text-primary/40" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing Mention */}
      <Section className="py-16">
        <TiltCard variant="gradient" className="p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Flexible Plans for Everyone
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Start free and scale as you grow. No credit card required for the
            basic plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton variant="primary" size="lg">
              View Pricing
            </MagneticButton>
            <MagneticButton variant="secondary" size="lg">
              Start Free Trial
            </MagneticButton>
          </div>
        </TiltCard>
      </Section>

      <Footer />
    </div>
  );
};

export default Features;
