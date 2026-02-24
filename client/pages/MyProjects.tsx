import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import {
    Rocket,
    Search,
    Filter,
    MoreHorizontal,
    ExternalLink,
    Github,
    Calendar,
    Users,
} from "lucide-react";

interface Project {
    name: string;
    description: string;
    status: "In Progress" | "Planning" | "Completed" | "On Hold";
    team: number;
    progress: number;
    tech: string[];
    updated: string;
    image: string;
}

const MyProjects: React.FC = () => {
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const projects: Project[] = [
        {
            name: "AI Learning Platform",
            description: "Adaptive AI tutor that personalizes learning paths for students",
            status: "In Progress",
            team: 5,
            progress: 75,
            tech: ["React", "Python", "TensorFlow"],
            updated: "2 hours ago",
            image: "🤖",
        },
        {
            name: "Eco Dashboard",
            description: "Real-time environmental impact tracking and visualization",
            status: "In Progress",
            team: 3,
            progress: 60,
            tech: ["Next.js", "D3.js", "PostgreSQL"],
            updated: "5 hours ago",
            image: "🌱",
        },
        {
            name: "Community Connect",
            description: "Social platform for student collaboration and networking",
            status: "Planning",
            team: 4,
            progress: 25,
            tech: ["React Native", "Firebase", "Node.js"],
            updated: "1 day ago",
            image: "🤝",
        },
        {
            name: "Neural Networks",
            description: "Advanced ML framework for education and research",
            status: "In Progress",
            team: 6,
            progress: 85,
            tech: ["Python", "PyTorch", "CUDA"],
            updated: "4 hours ago",
            image: "🧠",
        },
        {
            name: "Student Calendar",
            description: "Smart scheduling app with AI event suggestions",
            status: "Completed",
            team: 2,
            progress: 100,
            tech: ["Flutter", "Dart", "Firebase"],
            updated: "1 week ago",
            image: "📅",
        },
        {
            name: "Code Review Bot",
            description: "Automated code review assistant using GPT models",
            status: "On Hold",
            team: 3,
            progress: 40,
            tech: ["TypeScript", "OpenAI API", "GitHub API"],
            updated: "3 days ago",
            image: "🤖",
        },
    ];

    const statusColors: Record<string, string> = {
        "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        Planning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        "On Hold": "bg-foreground/10 text-foreground/60",
    };

    const filteredProjects = projects.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 reveal">
                    <div>
                        <h1 className="text-4xl font-black text-foreground mb-2">
                            My Projects
                        </h1>
                        <p className="text-foreground/70">
                            {projects.length} projects · {projects.filter((p) => p.status === "In Progress").length} active
                        </p>
                    </div>
                    <Link to="/dashboard/upload">
                        <MagneticButton variant="primary" size="md">
                            <Rocket size={18} /> New Project
                        </MagneticButton>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search projects..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300"
                        />
                    </div>
                    <div className="flex gap-2">
                        {["all", "In Progress", "Planning", "Completed", "On Hold"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === f
                                        ? "bg-primary text-white"
                                        : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
                                    }`}
                            >
                                {f === "all" ? "All" : f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredProjects.map((project, idx) => (
                        <TiltCard
                            key={idx}
                            variant="glass"
                            className="p-8 reveal cursor-pointer group"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                                        {project.image}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                            {project.name}
                                        </h3>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[project.status]}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>

                            <p className="text-sm text-foreground/60 mb-4">{project.description}</p>

                            {/* Tech tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tech.map((t) => (
                                    <span key={t} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* Progress */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-1.5">
                                    <span className="text-foreground/60">Progress</span>
                                    <span className="font-semibold text-foreground">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-foreground/10 rounded-full h-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between text-sm text-foreground/50">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Users size={14} /> {project.team}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} /> {project.updated}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-1.5 hover:text-primary transition-colors">
                                        <Github size={16} />
                                    </button>
                                    <button className="p-1.5 hover:text-primary transition-colors">
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MyProjects;
