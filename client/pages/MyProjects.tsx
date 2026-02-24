import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import {
    Rocket,
    Search,
    MoreHorizontal,
    ExternalLink,
    Github,
    Calendar,
    Users,
    LucideIcon,
    Folder,
    Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProjects, type ProjectData, deleteProject } from "@/lib/firestore";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
    "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Planning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "On Hold": "bg-foreground/10 text-foreground/60",
};

const MyProjects: React.FC = () => {
    const { user } = useAuth();
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchProjects = async () => {
            try {
                const data = await getUserProjects(user.uid);
                setProjects(data);
            } catch (err: any) {
                console.error("Error fetching projects:", err);
                toast.error("Failed to load projects");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [user]);

    const filteredProjects = projects.filter((p) => {
        const matchesSearch =
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleDelete = async (id: string) => {
        if (!id) return;
        try {
            await deleteProject(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
            toast.success("Project deleted");
        } catch (err: any) {
            toast.error("Failed to delete project");
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 reveal">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-foreground mb-2">
                            My Projects
                        </h1>
                        <p className="text-foreground/70">
                            {projects.length} project{projects.length !== 1 ? "s" : ""} ·{" "}
                            {projects.filter((p) => p.status === "In Progress").length} active
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
                    <div className="flex gap-2 flex-wrap">
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

                {/* Loading state */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-primary" />
                    </div>
                )}

                {/* Empty state */}
                {!loading && projects.length === 0 && (
                    <TiltCard variant="glass" className="p-6 md:p-12 text-center">
                        <Folder size={48} className="text-foreground/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">No projects yet</h3>
                        <p className="text-foreground/60 mb-6">Start building something amazing!</p>
                        <Link to="/dashboard/upload">
                            <MagneticButton variant="primary" size="md">
                                <Rocket size={18} /> Create Your First Project
                            </MagneticButton>
                        </Link>
                    </TiltCard>
                )}

                {/* Projects Grid */}
                {!loading && filteredProjects.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredProjects.map((project, idx) => (
                            <TiltCard
                                key={project.id || idx}
                                variant="glass"
                                className="p-4 md:p-8 reveal cursor-pointer group"
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="group-hover:scale-110 transition-transform duration-300">
                                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                                                <Rocket size={20} className="text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                {project.title}
                                            </h3>
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[project.status] || statusColors["Planning"]}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative group/menu">
                                        <button className="p-2 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-border/50 shadow-lg overflow-hidden z-20 hidden group-hover/menu:block">
                                            <button
                                                onClick={() => project.id && handleDelete(project.id)}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-foreground/60 mb-4">{project.shortDesc}</p>

                                {/* Images preview */}
                                {project.images && project.images.length > 0 && (
                                    <div className="flex gap-2 mb-4 overflow-x-auto">
                                        {project.images.slice(0, 3).map((img, i) => (
                                            <img key={i} src={img} alt="" className="w-16 h-12 rounded-lg object-cover border border-border" />
                                        ))}
                                        {project.images.length > 3 && (
                                            <div className="w-16 h-12 rounded-lg bg-foreground/10 flex items-center justify-center text-xs text-foreground/60 font-medium">
                                                +{project.images.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Tech tags */}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.map((t) => (
                                            <span key={t} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}

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
                                        {project.teamMembers && project.teamMembers.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Users size={14} /> {project.teamMembers.length}
                                            </span>
                                        )}
                                        {project.createdAt && (
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />{" "}
                                                {project.createdAt.toDate?.()
                                                    ? new Date(project.createdAt.toDate()).toLocaleDateString()
                                                    : "Recently"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {project.githubLink && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:text-primary transition-colors">
                                                <Github size={16} />
                                            </a>
                                        )}
                                        {project.demoLink && (
                                            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:text-primary transition-colors">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                )}

                {/* No results for search */}
                {!loading && projects.length > 0 && filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <Search size={32} className="text-foreground/20 mx-auto mb-3" />
                        <p className="text-foreground/60">No projects match your search.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyProjects;
