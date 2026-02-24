import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import { AvatarIcon } from "@/components/IconAvatar";
import {
  TrendingUp,
  Users,
  Rocket,
  Calendar,
  BarChart3,
  Activity,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const stats = [
    {
      icon: Rocket,
      label: "Total Projects",
      value: "12",
      change: "+3 this month",
      color: "from-primary to-blue-600",
    },
    {
      icon: Users,
      label: "Team Members",
      value: "48",
      change: "+8 new members",
      color: "from-accent to-blue-400",
    },
    {
      icon: TrendingUp,
      label: "In Progress",
      value: "7",
      change: "2 completed",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Calendar,
      label: "Events",
      value: "5",
      change: "Next: Hackathon",
      color: "from-orange-500 to-red-500",
    },
  ];

  const recentProjects = [
    {
      name: "AI Learning Platform",
      status: "In Progress",
      team: 5,
      progress: 75,
    },
    {
      name: "Eco Dashboard",
      status: "In Progress",
      team: 3,
      progress: 60,
    },
    {
      name: "Community Connect",
      status: "Planning",
      team: 4,
      progress: 25,
    },
    {
      name: "Neural Networks",
      status: "In Progress",
      team: 6,
      progress: 85,
    },
  ];

  const activityFeed = [
    {
      user: "Sarah Chen",
      action: "Started new project",
      project: "AI Learning Platform",
      time: "2 hours ago",
    },
    {
      user: "Alex Kumar",
      action: "Completed milestone",
      project: "Neural Networks",
      time: "4 hours ago",
    },
    {
      user: "Jessica Park",
      action: "Joined team",
      project: "Eco Dashboard",
      time: "6 hours ago",
    },
    {
      user: "Michael Zhang",
      action: "Pushed code",
      project: "Community Connect",
      time: "8 hours ago",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="reveal">
          <h1 className="text-4xl font-black text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-foreground/70">
            Welcome back! Here's your project overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <TiltCard
              key={idx}
              variant="gradient"
              className="p-6 reveal cursor-pointer group"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 glow-soft group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon size={24} className="text-white" />
              </div>
              <p className="text-sm text-foreground/70 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-foreground">
                  {stat.value}
                </h3>
              </div>
              <p className="text-xs text-accent mt-2">{stat.change}</p>
            </TiltCard>
          ))}
        </div>

        {/* Projects and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2 reveal">
            <TiltCard variant="glass" className="p-8 cursor-pointer">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Recent Projects
                </h2>
                <button className="text-primary font-semibold hover:gap-1 inline-flex items-center gap-0.5 transition-all duration-300">
                  View All →
                </button>
              </div>

              <div className="space-y-4">
                {recentProjects.map((project, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-border/50 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-foreground/70">
                          {project.team} team members
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${project.status === "In Progress"
                            ? "bg-blue-100 text-primary dark:bg-blue-900/30"
                            : "bg-foreground/10 text-foreground/70"
                          }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-foreground/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-foreground/60 mt-2">
                      {project.progress}% complete
                    </p>
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>

          {/* Activity Feed */}
          <div className="reveal">
            <TiltCard variant="glass" className="p-8 h-full cursor-pointer">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Activity</h2>
                <Activity size={20} className="text-primary" />
              </div>

              <div className="space-y-4">
                {activityFeed.map((activity, idx) => (
                  <div
                    key={idx}
                    className="pb-4 border-b border-border/50 last:border-0 hover:bg-primary/5 p-2 rounded transition-colors"
                  >
                    <div className="flex gap-3">
                      <AvatarIcon name={activity.user} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {activity.user}
                        </p>
                        <p className="text-xs text-foreground/70">
                          {activity.action}
                        </p>
                        <p className="text-xs text-accent font-medium">
                          {activity.project}
                        </p>
                        <p className="text-xs text-foreground/60 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 reveal">
          <TiltCard variant="glass" className="p-8 cursor-pointer">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Project Timeline
            </h2>
            <div className="space-y-4">
              {["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"].map(
                (quarter, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {quarter}
                      </span>
                      <span className="text-sm text-foreground/70">
                        {[8, 12, 15, 10][idx]} projects
                      </span>
                    </div>
                    <div className="w-full bg-foreground/10 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${[53, 80, 100, 67][idx]}%` }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </TiltCard>

          <TiltCard variant="glass" className="p-8 cursor-pointer">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Team Performance
            </h2>
            <div className="space-y-4">
              {[
                { name: "Engineering", value: 92 },
                { name: "Design", value: 88 },
                { name: "Product", value: 85 },
                { name: "Community", value: 95 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="text-sm text-primary font-semibold">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full bg-foreground/10 rounded-full h-2">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </div>

        {/* CTA Section */}
        <TiltCard variant="gradient" className="p-8 text-center reveal cursor-pointer">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Start a New Project
          </h2>
          <p className="text-foreground/70 mb-6">
            Create and manage your next innovation
          </p>
          <MagneticButton variant="primary" size="lg">
            New Project
          </MagneticButton>
        </TiltCard>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
