import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import { AvatarIcon } from "@/components/IconAvatar";
import { TrendingUp, Users, Rocket, Calendar, Activity, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProjects, type ProjectData } from "@/lib/firestore";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserProjects(user.uid)
      .then(setProjects)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [user]);

  const total = projects.length;
  const inProg = projects.filter((p) => p.status === "In Progress").length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const planning = projects.filter((p) => p.status === "Planning").length;
  const teamCount = projects.reduce((a, p) => a + (p.teamMembers?.length || 0), 0);
  const recent = projects.slice(0, 4);

  const stats = [
    { icon: Rocket, label: "Total Projects", value: total, sub: `${inProg} in progress`, color: "from-primary to-blue-600" },
    { icon: Users, label: "Team Members", value: teamCount, sub: "Across projects", color: "from-accent to-blue-400" },
    { icon: TrendingUp, label: "In Progress", value: inProg, sub: `${completed} completed`, color: "from-purple-500 to-pink-500" },
    { icon: Calendar, label: "Planning", value: planning, sub: "Ready to start", color: "from-orange-500 to-red-500" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="reveal">
          <h1 className="text-2xl md:text-4xl font-black text-foreground mb-1 md:mb-2">Dashboard</h1>
          <p className="text-sm md:text-base text-foreground/70">Welcome back! Here's your project overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {stats.map((s, i) => (
            <TiltCard key={i} variant="gradient" className="p-3 md:p-6 reveal" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`w-9 h-9 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2 md:mb-4 glow-soft`}>
                <s.icon size={20} className="text-white" />
              </div>
              <p className="text-xs md:text-sm text-foreground/70 mb-0.5 md:mb-1">{s.label}</p>
              <h3 className="text-xl md:text-3xl font-bold text-foreground">{s.value}</h3>
              <p className="text-xs text-accent mt-1 md:mt-2 hidden sm:block">{s.sub}</p>
            </TiltCard>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 reveal">
            <TiltCard variant="glass" className="p-4 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-foreground">Recent Projects</h2>
                <Link to="/dashboard/projects" className="text-primary font-semibold text-sm md:text-base inline-flex items-center gap-0.5">View All →</Link>
              </div>
              {recent.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-foreground/50 mb-4">No projects yet</p>
                  <Link to="/dashboard/upload"><MagneticButton variant="primary" size="md"><Rocket size={16} /> Create First Project</MagneticButton></Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recent.map((p, i) => (
                    <div key={p.id || i} className="p-4 border border-border/50 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{p.title}</h3>
                          <p className="text-sm text-foreground/70">{p.teamMembers?.length || 0} team members</p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${p.status === "In Progress" ? "bg-blue-100 text-primary dark:bg-blue-900/30" : p.status === "Completed" ? "bg-green-100 text-green-700" : "bg-foreground/10 text-foreground/70"}`}>{p.status}</span>
                      </div>
                      <div className="w-full bg-foreground/10 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style={{ width: `${p.progress}%` }} />
                      </div>
                      <p className="text-xs text-foreground/60 mt-2">{p.progress}% complete</p>
                    </div>
                  ))}
                </div>
              )}
            </TiltCard>
          </div>

          {/* Overview sidebar */}
          <div className="reveal">
            <TiltCard variant="glass" className="p-4 md:p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-foreground">Overview</h2>
                <Activity size={20} className="text-primary" />
              </div>
              <div className="space-y-4">
                {[{ l: "Completed", c: completed }, { l: "In Progress", c: inProg }, { l: "Planning", c: planning }, { l: "On Hold", c: projects.filter((x) => x.status === "On Hold").length }].map((it, i) => (
                  <div key={i} className="pb-4 border-b border-border/50 last:border-0">
                    <div className="flex justify-between mb-2"><span className="text-sm font-medium text-foreground">{it.l}</span><span className="text-sm text-foreground/70">{it.c}</span></div>
                    <div className="w-full bg-foreground/10 rounded-full h-2">
                      <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: total ? `${(it.c / total) * 100}%` : "0%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>
        </div>

        {/* CTA */}
        <TiltCard variant="gradient" className="p-4 md:p-8 text-center reveal">
          <h2 className="text-lg md:text-2xl font-bold text-foreground mb-2 md:mb-4">Start a New Project</h2>
          <p className="text-sm md:text-base text-foreground/70 mb-4 md:mb-6">Create and manage your next innovation</p>
          <Link to="/dashboard/upload"><MagneticButton variant="primary" size="lg">New Project</MagneticButton></Link>
        </TiltCard>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
