import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { MagneticButton } from "@/components/MagneticButton";
import { TiltCard } from "@/components/TiltCard";
import { HeroSection } from "@/components/HeroSection";
import { Section } from "@/components/Section";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Zap,
  Lightbulb,
  Users,
  Rocket,
  Award,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const Index: React.FC = () => {
  const [stats, setStats] = useState([
    { label: "Active Members", value: 0 },
    { label: "Projects Shipped", value: 0 },
    { label: "Innovation Awards", value: 0 },
  ]);

  // Animate counters
  useEffect(() => {
    const targets = [150, 45, 12];
    const intervals: NodeJS.Timeout[] = [];

    targets.forEach((target, idx) => {
      let current = 0;
      const increment = Math.ceil(target / 50);
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setStats((prev) => {
          const newStats = [...prev];
          newStats[idx].value = current;
          return newStats;
        });
      }, 30);
      intervals.push(interval);
    });

    return () => intervals.forEach((int) => clearInterval(int));
  }, []);

  const projects = [
    {
      title: "AI Learning Platform",
      description:
        "Adaptive AI tutor that personalizes learning paths for students",
      category: "AI/ML",
      image: "🤖",
    },
    {
      title: "Eco Dashboard",
      description: "Real-time environmental impact tracking and visualization",
      category: "Sustainability",
      image: "🌱",
    },
    {
      title: "Community Connect",
      description: "Social platform for student collaboration and networking",
      category: "Social Tech",
      image: "🤝",
    },
    {
      title: "Neural Networks",
      description: "Advanced ML framework for education and research",
      category: "Research",
      image: "🧠",
    },
  ];

  const timeline = [
    { year: "2021", event: "Club Founded", description: "Started with 10 members" },
    {
      year: "2022",
      event: "First Hackathon",
      description: "150+ participants, 5 winning projects",
    },
    {
      year: "2023",
      event: "National Recognition",
      description: "Top 10 college innovation clubs",
    },
    {
      year: "2024",
      event: "Industry Partnerships",
      description: "Collaborated with tech leaders",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Club President",
      text: "MODX transformed how we approach innovation. It's not just a club, it's a movement.",
      avatar: "👩‍💼",
    },
    {
      name: "Alex Kumar",
      role: "Project Lead",
      text: "The most supportive community I've been part of. Ideas flourish here.",
      avatar: "👨‍💻",
    },
    {
      name: "Jessica Park",
      role: "Designer",
      text: "Where creativity meets technology. Every day brings new possibilities.",
      avatar: "👩‍🎨",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-background dark:bg-slate-950">
      <Navigation />

      {/* Cinematic Hero Section */}
      <HeroSection
        title="MODX – Where Students Build the Future"
        subtitle="Where Ideas Become Reality. Join the most innovative student community pushing the boundaries of technology and creativity."
        primaryCTA={{ text: "Explore Projects", icon: <Rocket size={20} />, onClick: () => navigate("/features") }}
        secondaryCTA={{ text: "Login", icon: <Users size={20} />, onClick: () => navigate("/login") }}
      />

      {/* Features Grid */}
      <Section className="pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              desc: "Quick iteration and rapid prototyping",
            },
            {
              icon: Lightbulb,
              title: "Pure Innovation",
              desc: "Creative freedom without limits",
            },
            {
              icon: Users,
              title: "Collaboration",
              desc: "Work with brilliant minds",
            },
          ].map((item, idx) => (
            <TiltCard key={idx} variant="glass" className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center glow-soft">
                  <item.icon size={28} className="text-white" />
                </div>
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-foreground/70 text-sm">{item.desc}</p>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center reveal" style={{
              animationDelay: `${idx * 0.1}s`,
            }}>
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {stat.value}+
              </div>
              <p className="text-lg text-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Featured Projects */}
      <Section>
        <div className="mb-12 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Showcasing the innovations that are changing the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <TiltCard
              key={idx}
              variant="gradient"
              className="p-8 overflow-hidden reveal cursor-pointer group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="p-4">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {project.image}
                </div>
                <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
                  <span className="text-sm font-semibold text-primary">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {project.title}
                </h3>
                <p className="text-foreground/70 mb-6">{project.description}</p>
                <Link to="/features" className="text-primary font-semibold inline-flex items-center gap-1.5 transition-all duration-300 group/btn hover:gap-2.5">
                  Learn More <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* How It Works - Timeline */}
      <Section className="relative">
        <div className="mb-12 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Our Journey
          </h2>
          <p className="text-xl text-foreground/70">
            From humble beginnings to leading innovation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex gap-8 mb-12 reveal" style={{
              animationDelay: `${idx * 0.15}s`,
            }}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl mb-4 glow-soft">
                  {idx + 1}
                </div>
                {idx < timeline.length - 1 && (
                  <div className="w-1 h-24 bg-gradient-to-b from-primary to-transparent" />
                )}
              </div>
              <TiltCard variant="glass" className="flex-1 p-6">
                <div className="text-sm font-semibold text-accent mb-1">
                  {item.year}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {item.event}
                </h3>
                <p className="text-foreground/70">{item.description}</p>
              </TiltCard>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <div className="mb-12 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            What Members Say
          </h2>
          <p className="text-xl text-foreground/70">
            Real voices from our incredible community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <TiltCard
              key={idx}
              variant="glass"
              className="p-8 flex flex-col reveal cursor-pointer"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-bold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-foreground/70">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-foreground/80 italic flex-1">
                "{testimonial.text}"
              </p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-3xl" />
        <div className="relative z-10 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Ready to Join the Innovation?
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
            Become part of the next generation of innovators and creators
          </p>
          <Link to="/register">
            <MagneticButton variant="primary" size="lg">
              <Rocket size={20} /> Get Started Today
            </MagneticButton>
          </Link>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default Index;
