import React from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import { Section } from "@/components/Section";
import { AvatarIcon } from "@/components/IconAvatar";
import { Heart, Target, Eye, GraduationCap, ArrowRight, Rocket } from "lucide-react";

const About: React.FC = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Founder & President",
      bio: "Visionary leader passionate about student innovation",
    },
    {
      name: "Alex Kumar",
      role: "Vice President",
      bio: "Tech innovator with 5+ projects shipped",
    },
    {
      name: "Jessica Park",
      role: "Design Lead",
      bio: "Creative designer focused on user experience",
    },
    {
      name: "Michael Zhang",
      role: "Engineering Lead",
      bio: "Full-stack developer and architecture expert",
    },
    {
      name: "Emma Johnson",
      role: "Community Manager",
      bio: "Building connections and fostering collaboration",
    },
    {
      name: "David Singh",
      role: "Outreach Lead",
      bio: "Bridging gaps between students and industry",
    },
  ];

  const milestones = [
    {
      year: "2021",
      title: "Founded",
      description:
        "MODX was founded with a vision to empower student innovators",
    },
    {
      year: "2021",
      title: "First Members",
      description: "Grew from 10 to 50 passionate members in first semester",
    },
    {
      year: "2022",
      title: "Hackathon Success",
      description: "Hosted first MODX Hackathon with 150+ participants",
    },
    {
      year: "2022",
      title: "5 Projects",
      description: "Shipped 5 major projects with 100k+ total users",
    },
    {
      year: "2023",
      title: "National Recognition",
      description: "Recognized as Top 10 College Innovation Clubs",
    },
    {
      year: "2024",
      title: "Industry Partnerships",
      description: "Partnered with leading tech companies for mentorship",
    },
  ];

  const howItWorks = [
    { step: 1, title: "Form Team", desc: "Find like-minded students and build your dream team" },
    { step: 2, title: "Build", desc: "Collaborate, code, design and bring your idea to life" },
    { step: 3, title: "Present", desc: "Showcase your project to peers, mentors, and industry" },
    { step: 4, title: "Publish", desc: "Launch your project and add it to your portfolio" },
  ];

  const facultyMembers = [
    { name: "Dr. Robert Williams", role: "Faculty Advisor", department: "Computer Science" },
    { name: "Prof. Anita Patel", role: "Coordinator", department: "Innovation & Design" },
    { name: "Dr. Mark Thompson", role: "Mentor", department: "AI & Machine Learning" },
  ];

  return (
    <div className="w-full min-h-screen bg-background dark:bg-slate-950">
      <Navigation />

      {/* Hero Section */}
      <Section className="pt-32 pb-12">
        <div className="text-center reveal">
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6">
            About MODX
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            A student-led innovation lab dedicated to transforming ideas into
            reality
          </p>
        </div>
      </Section>

      {/* Mission Section */}
      <Section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Target,
              title: "Our Mission",
              description:
                "Empower students to innovate, collaborate, and create technology that matters",
            },
            {
              icon: Eye,
              title: "Our Vision",
              description:
                "A world where every student has the tools and community to bring their ideas to life",
            },
            {
              icon: Heart,
              title: "Our Values",
              description:
                "Innovation, collaboration, integrity, and continuous learning",
            },
          ].map((item, idx) => (
            <TiltCard key={idx} variant="glass" className="p-8 text-center reveal">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4 glow-soft">
                <item.icon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-foreground/70">{item.description}</p>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section className="py-12">
        <div className="mb-12 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">How It Works</h2>
          <p className="text-xl text-foreground/70">From idea to published project in four steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {howItWorks.map((item, idx) => (
            <div key={idx} className="relative reveal" style={{ animationDelay: `${idx * 0.1}s` }}>
              <TiltCard variant="gradient" className="p-8 text-center cursor-pointer group">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white font-black text-xl group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.desc}</p>
              </TiltCard>
              {idx < 3 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-foreground/20">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Story Section */}
      <Section>
        <div className="mb-12 reveal">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-lg text-foreground/80 leading-relaxed">
            <p>
              In 2021, a group of passionate students realized something was
              missing. While they were bursting with ideas and energy, there was
              no dedicated space for them to collaborate, experiment, and turn
              those ideas into reality.
            </p>
            <p>
              That's when MODX was born. What started as a small group of 10
              friends has grown into a thriving community of 150+ members from
              diverse backgrounds—engineers, designers, product managers,
              entrepreneurs, and visionaries.
            </p>
            <p>
              Today, MODX stands as a beacon of innovation on campus. We've
              shipped 45+ projects, hosted multiple hackathons, and built
              partnerships with industry leaders. But more importantly, we've
              created a culture where ideas flourish and dreamers become doers.
            </p>
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <div className="mb-12 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Timeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {milestones.map((milestone, idx) => (
            <TiltCard
              key={idx}
              variant="gradient"
              className="p-8 reveal cursor-pointer"
              style={{ animationDelay: `${(idx % 2) * 0.1}s` }}
            >
              <div className="text-sm font-semibold text-accent mb-2">
                {milestone.year}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {milestone.title}
              </h3>
              <p className="text-foreground/70">{milestone.description}</p>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* Team Section */}
      <Section>
        <div className="mb-12 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Meet the Team
          </h2>
          <p className="text-xl text-foreground/70">
            Brilliant minds driving innovation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <TiltCard
              key={idx}
              variant="glass"
              className="p-8 text-center reveal cursor-pointer group"
              style={{ animationDelay: `${(idx % 3) * 0.1}s` }}
            >
              <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                <AvatarIcon name={member.name} size="xl" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-semibold text-accent mb-3">
                {member.role}
              </p>
              <p className="text-foreground/70 text-sm">{member.bio}</p>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* Impact Stats */}
      <Section className="py-16">
        <TiltCard variant="gradient" className="p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Members", value: "150+" },
              { label: "Projects Shipped", value: "45+" },
              { label: "Hackathons Hosted", value: "8" },
              { label: "Team Partnerships", value: "12+" },
            ].map((stat, idx) => (
              <div key={idx} className="reveal">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </TiltCard>
      </Section>

      {/* Faculty / Coordinators */}
      <Section>
        <div className="mb-12 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">Faculty & Coordinators</h2>
          <p className="text-xl text-foreground/70">Guiding and mentoring the next generation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facultyMembers.map((member, idx) => (
            <TiltCard key={idx} variant="glass" className="p-8 text-center reveal cursor-pointer group" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300"><AvatarIcon name={member.name} size="xl" /></div>
              <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
              <p className="text-sm font-semibold text-accent mb-1">{member.role}</p>
              <p className="text-xs text-foreground/50">{member.department}</p>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* Join Section */}
      <Section className="py-16">
        <div className="text-center reveal">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
            Whether you're a developer, designer, entrepreneur, or just curious,
            there's a place for you in MODX
          </p>
          <MagneticButton variant="primary" size="lg">
            Get Involved
          </MagneticButton>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default About;
