import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MagneticButton } from "@/components/MagneticButton";
import {
    Rocket,
    Search,
    Trash2,
    ExternalLink,
    Github,
    Calendar,
    Users,
    Folder,
    Tag,
    LayoutGrid,
    LayoutList,
    ChevronRight,
    ChevronLeft,
    Share2,
    Info,
    Layers,
    UserCircle2,
    X,
    ZoomIn,
    ArrowLeft,
    ArrowRight,
    Code2,
    Globe,
    User2,
    CheckCircle2,
    Clock,
    AlertCircle,
    PauseCircle,
    TrendingUp,
    ImageOff,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProjects, type ProjectData, deleteProject } from "@/lib/firestore";
import { toast } from "sonner";

/* ── Status config ──────────────────────────────────────────────────── */
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    "In Progress": { label: "In Progress", color: "bg-blue-500", icon: <Clock size={13} /> },
    Planning: { label: "Planning", color: "bg-amber-400", icon: <AlertCircle size={13} /> },
    Completed: { label: "Completed", color: "bg-emerald-500", icon: <CheckCircle2 size={13} /> },
    "On Hold": { label: "On Hold", color: "bg-slate-400", icon: <PauseCircle size={13} /> },
};

/* ── Fallback gradient pool ─────────────────────────────────────────── */
const cardGradients = [
    ["#4f46e5", "#818cf8"],
    ["#0ea5e9", "#38bdf8"],
    ["#ec4899", "#f472b6"],
    ["#f59e0b", "#fbbf24"],
    ["#10b981", "#34d399"],
    ["#8b5cf6", "#c084fc"],
];

/* ── Circular Progress SVG ──────────────────────────────────────────── */
const CircularProgress: React.FC<{ value: number; size?: number; stroke?: number; gradient?: string[] }> = ({
    value,
    size = 72,
    stroke = 6,
    gradient,
}) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    const gradId = `pg-${size}`;
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
                    strokeWidth={stroke} className="text-foreground/10" />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                    stroke={`url(#${gradId})`} strokeWidth={stroke}
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
                <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={gradient?.[0] ?? "#4f46e5"} />
                        <stop offset="100%" stopColor={gradient?.[1] ?? "#06b6d4"} />
                    </linearGradient>
                </defs>
            </svg>
            <span className="absolute text-sm font-bold text-foreground">{value}%</span>
        </div>
    );
};

/* ── Image Strip with mini-carousel ────────────────────────────────── */
const ImageStrip: React.FC<{ images: string[]; gradient: string[] }> = ({ images, gradient }) => {
    const [active, setActive] = useState(0);
    const total = images.length;

    useEffect(() => {
        if (total <= 1) return;
        const t = setInterval(() => setActive((p) => (p + 1) % total), 3500);
        return () => clearInterval(t);
    }, [total]);

    if (total === 0) {
        return (
            <div
                className="w-full h-48 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
            >
                <Rocket size={44} className="text-white/30" />
            </div>
        );
    }

    if (total === 1) {
        return (
            <div className="w-full h-48 overflow-hidden">
                <img src={images[0]} alt="project" className="w-full h-full object-cover" />
            </div>
        );
    }

    const visible = images.slice(0, 3);

    return (
        <div className="relative w-full h-48 overflow-hidden">
            <div className="flex h-full w-full gap-1">
                {visible.map((src, i) => (
                    <div
                        key={i}
                        className={`relative overflow-hidden flex-shrink-0 transition-all duration-500 cursor-pointer ${i === active
                            ? "flex-[2.5]"
                            : "flex-[1] opacity-70 hover:opacity-90"
                            }`}
                        onClick={() => setActive(i)}
                    >
                        <img src={src} alt={`img-${i}`} className="w-full h-full object-cover" />
                        {i !== active && <div className="absolute inset-0 bg-black/20" />}
                    </div>
                ))}
                {total > 3 && (
                    <div
                        className="flex-shrink-0 flex-[0.8] flex items-center justify-center bg-black/60 text-white font-bold text-base cursor-pointer hover:bg-black/70 transition-colors"
                        onClick={() => setActive(active < total - 1 ? active + 1 : 0)}
                    >
                        +{total - 3}
                    </div>
                )}
            </div>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                {Array.from({ length: Math.min(total, 4) }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`rounded-full transition-all duration-300 ${i === active
                            ? "w-4 h-1.5 bg-white"
                            : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

/* ── Project Detail Modal ───────────────────────────────────────────── */
interface ProjectModalProps {
    project: ProjectData;
    gradient: string[];
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, gradient, onClose }) => {
    const [imgIdx, setImgIdx] = useState(0);
    const [lightbox, setLightbox] = useState(false);
    const images = project.images ?? [];
    const status = statusConfig[project.status] ?? statusConfig["Planning"];

    const dateStr = project.createdAt?.toDate?.()
        ? new Date(project.createdAt.toDate()).toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
        })
        : "Recently";

    const prev = () => setImgIdx((p) => (p - 1 + images.length) % images.length);
    const next = () => setImgIdx((p) => (p + 1) % images.length);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") { if (lightbox) setLightbox(false); else onClose(); }
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [lightbox, imgIdx, images.length]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <>
            {/* ── Full-screen Overlay ── */}
            <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-background overflow-hidden">

                {/* ════ LEFT: Square Image Gallery ════ */}
                {/* aspect-square + h-full = width matches viewport height → perfect square like 1080×1080 */}
                <div className="relative flex flex-col bg-black flex-shrink-0 w-full aspect-square md:h-full md:w-auto md:aspect-square">

                    {/* Main image */}
                    <div className="relative flex-1 overflow-hidden">
                        {images.length > 0 ? (
                            <img
                                key={imgIdx}
                                src={images[imgIdx]}
                                alt={`${project.title} image ${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                                style={{ animation: "fadeImg 0.35s ease" }}
                            />
                        ) : (
                            <div
                                className="w-full h-full flex flex-col items-center justify-center gap-4"
                                style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
                            >
                                <Rocket size={64} className="text-white/30" />
                                <span className="text-white/40 text-sm font-medium">No images uploaded</span>
                            </div>
                        )}

                        {/* dark gradient bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }} />

                        {/* Top-left: close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/50 backdrop-blur-sm text-white text-sm font-semibold hover:bg-black/70 transition-all"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>

                        {/* Top-right: zoom + counter */}
                        {images.length > 0 && (
                            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                                    {imgIdx + 1} / {images.length}
                                </span>
                                <button
                                    onClick={() => setLightbox(true)}
                                    className="w-9 h-9 rounded-xl bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all"
                                    title="Full screen"
                                >
                                    <ZoomIn size={15} />
                                </button>
                            </div>
                        )}

                        {/* Status badge */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${status.color}`}>
                                {status.icon} {status.label}
                            </span>
                        </div>

                        {/* Prev / Next arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all"
                                >
                                    <ArrowRight size={18} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                        <div className="flex gap-2 p-3 bg-black/90 overflow-x-auto scrollbar-none flex-shrink-0">
                            {images.map((src, i) => (
                                <button
                                    key={i}
                                    onClick={() => setImgIdx(i)}
                                    className={`relative flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all duration-200 ${i === imgIdx
                                        ? "border-white scale-105"
                                        : "border-transparent opacity-50 hover:opacity-80 hover:border-white/40"
                                        }`}
                                >
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ════ RIGHT: Scrollable Details ════ */}
                <div className="flex-1 overflow-y-auto bg-background relative">

                    {/* Ambient glow */}
                    <div
                        className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-[0.04] blur-3xl"
                        style={{ background: gradient[0] }}
                    />

                    <div className="relative p-7 md:p-10 flex flex-col gap-8">

                        {/* ── Header ── */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white ${status.color}`}>
                                    {status.icon} {status.label}
                                </span>
                                {project.createdAt && (
                                    <span className="text-xs text-foreground/35 flex items-center gap-1">
                                        <Calendar size={11} /> {dateStr}
                                    </span>
                                )}
                            </div>

                            <h1
                                className="text-3xl md:text-4xl font-black leading-tight tracking-tight"
                                style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                            >
                                {project.title}
                            </h1>

                            <div className="flex items-center gap-2 text-sm">
                                <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                                    style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
                                >
                                    {(project.ownerName || "U").charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-foreground/60">{project.ownerName || "Unknown"}</span>
                            </div>

                            {project.shortDesc && (
                                <p className="text-foreground/55 text-sm leading-relaxed mt-1">{project.shortDesc}</p>
                            )}
                        </div>

                        {/* ── Progress ── */}
                        <div
                            className="rounded-2xl p-5 border border-border/50 relative overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${gradient[0]}08, ${gradient[1]}06)` }}
                        >
                            <div className="flex items-end justify-between mb-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/35 mb-1">Overall Progress</p>
                                    <p className="text-4xl font-black text-foreground leading-none">
                                        {project.progress}<span className="text-xl text-foreground/30 font-bold">%</span>
                                    </p>
                                </div>
                                <p className="text-xs text-foreground/40 pb-1 text-right max-w-[120px] leading-relaxed">
                                    {project.progress === 0 ? "Not started" : project.progress < 30 ? "Just getting started 🚀" : project.progress < 70 ? "In the zone 💪" : project.progress < 100 ? "Almost there! 🔥" : "Complete! 🎉"}
                                </p>
                            </div>

                            <div className="h-3 rounded-full bg-foreground/8 overflow-hidden">
                                <div
                                    className="h-full rounded-full relative overflow-hidden transition-all duration-1000"
                                    style={{ width: `${project.progress}%`, background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" style={{ animation: "shimmer 2.5s ease-in-out infinite" }} />
                                </div>
                            </div>
                            <div className="flex justify-between mt-1.5 px-0.5">
                                {[0, 25, 50, 75, 100].map(v => (
                                    <span key={v} className="text-[10px] text-foreground/20">{v}%</span>
                                ))}
                            </div>
                        </div>

                        {/* ── Quick Stats ── */}
                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: <Users size={14} />, value: project.teamMembers?.length || 0, label: "members" },
                                { icon: <ZoomIn size={14} />, value: images.length, label: "photos" },
                                { icon: <Tag size={14} />, value: project.technologies?.length || 0, label: "technologies" },
                            ].map(({ icon, value, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/40 hover:border-primary/20 transition-colors bg-foreground/2"
                                >
                                    <span style={{ color: gradient[0] }}>{icon}</span>
                                    <span className="text-sm font-black text-foreground">{value}</span>
                                    <span className="text-xs text-foreground/35">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* ── About ── */}
                        {project.detailedDesc && (
                            <div>
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-1 h-5 rounded-full" style={{ background: `linear-gradient(180deg, ${gradient[0]}, ${gradient[1]})` }} />
                                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-foreground/50">About this Project</h3>
                                </div>
                                <p className="text-foreground/60 text-sm leading-7 whitespace-pre-wrap">{project.detailedDesc}</p>
                            </div>
                        )}

                        {/* ── Tech Stack ── */}
                        {(project.technologies?.length ?? 0) > 0 && (
                            <div>
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-1 h-5 rounded-full" style={{ background: `linear-gradient(180deg, ${gradient[0]}, ${gradient[1]})` }} />
                                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-foreground/50">Tech Stack</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((t) => (
                                        <span
                                            key={t}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold hover:scale-105 transition-transform cursor-default"
                                            style={{
                                                background: `linear-gradient(135deg, ${gradient[0]}15, ${gradient[1]}10)`,
                                                color: gradient[0],
                                                border: `1px solid ${gradient[0]}28`,
                                            }}
                                        >
                                            <Code2 size={10} /> {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Team ── */}
                        {(project.teamMembers?.length ?? 0) > 0 && (
                            <div>
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-1 h-5 rounded-full" style={{ background: `linear-gradient(180deg, ${gradient[0]}, ${gradient[1]})` }} />
                                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-foreground/50">Team</h3>
                                    <span className="text-xs text-foreground/25">· {project.teamMembers.length} members</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {project.teamMembers.map((m, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/40 hover:border-primary/20 transition-all duration-200 hover:shadow-md"
                                            style={{ background: `linear-gradient(135deg, ${gradient[0]}06, transparent)` }}
                                        >
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                                                style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`, boxShadow: `0 4px 12px ${gradient[0]}40` }}
                                            >
                                                {m.name?.charAt(0)?.toUpperCase() || "?"}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-foreground truncate">{m.name}</p>
                                                <p className="text-xs text-foreground/40 truncate">{m.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── CTA Buttons ── */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
                            {project.demoLink && (
                                <a
                                    href={project.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] relative overflow-hidden group"
                                    style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`, boxShadow: `0 8px 30px ${gradient[0]}45` }}
                                >
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                                    <Globe size={15} /> Live Demo <ExternalLink size={12} className="opacity-70" />
                                </a>
                            )}
                            {project.githubLink && (
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-foreground/70 hover:text-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-2 hover:bg-foreground/4"
                                    style={{ borderColor: `${gradient[0]}35` }}
                                >
                                    <Github size={15} /> GitHub Repo
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Lightbox ── */}
            {lightbox && images.length > 0 && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.96)" }}
                    onClick={() => setLightbox(false)}
                >
                    <button
                        onClick={() => setLightbox(false)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all z-10"
                    >
                        <X size={18} />
                    </button>
                    {images.length > 1 && (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                                <ArrowLeft size={20} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); next(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                                <ArrowRight size={20} />
                            </button>
                        </>
                    )}
                    <img
                        src={images[imgIdx]}
                        alt="lightbox"
                        className="max-w-[95vw] max-h-[92vh] object-contain shadow-2xl"
                        style={{ borderRadius: 12 }}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {images.length > 1 && (
                        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
                            {images.map((_, i) => (
                                <button key={i} onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                                    className={`rounded-full transition-all duration-300 ${i === imgIdx ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`} />
                            ))}
                        </div>
                    )}
                    <div className="absolute bottom-12 left-0 right-0 text-center text-white/40 text-xs">
                        {imgIdx + 1} / {images.length}
                    </div>
                </div>
            )}

            <style>{`@keyframes fadeImg { from { opacity: 0; transform: scale(1.03); } to { opacity: 1; transform: scale(1); } }`}</style>
        </>
    );
};

/* ── Project Card ───────────────────────────────────────────────────── */
interface ProjectCardProps {
    project: ProjectData;
    index: number;
    onDelete: (id: string) => void;
    view: "grid" | "list";
    onOpen: (project: ProjectData) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onDelete, view, onOpen }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const status = statusConfig[project.status] ?? statusConfig["Planning"];
    const gradient = cardGradients[index % cardGradients.length];
    const images = project.images ?? [];

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirmDelete) {
            project.id && onDelete(project.id);
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
        }
    };

    const dateStr = project.createdAt?.toDate?.()
        ? new Date(project.createdAt.toDate()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "Recently";

    /* ── List view ── */
    if (view === "list") {
        return (
            <div
                className="group flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                onClick={() => onOpen(project)}
            >
                {/* Thumbnail */}
                <div className="w-full sm:w-20 h-20 sm:h-14 flex-shrink-0 rounded-xl overflow-hidden">
                    {images.length > 0 ? (
                        <img src={images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}>
                            <Rocket size={18} className="text-white/80" />
                        </div>
                    )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {project.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${status.color}`}>
                            {status.label}
                        </span>
                    </div>
                    <p className="text-sm text-foreground/55 line-clamp-1">{project.shortDesc}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        {project.technologies?.slice(0, 4).map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-primary/8 text-primary text-xs font-medium">{t}</span>
                        ))}
                    </div>
                </div>
                {/* Progress */}
                <div className="hidden md:block flex-shrink-0">
                    <CircularProgress value={project.progress} size={56} stroke={5} gradient={gradient} />
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 ml-auto sm:ml-0" onClick={(e) => e.stopPropagation()}>
                    {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all">
                            <Github size={15} />
                        </a>
                    )}
                    {project.demoLink && (
                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/5 transition-all">
                            <ExternalLink size={15} />
                        </a>
                    )}
                    <button onClick={handleDeleteClick}
                        className={`p-2 rounded-lg transition-all text-sm font-medium ${confirmDelete ? "bg-red-500 text-white" : "text-foreground/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"}`}>
                        {confirmDelete ? "Sure?" : <Trash2 size={15} />}
                    </button>
                </div>
            </div>
        );
    }

    /* ── Grid card ── */
    return (
        <div
            className="group flex flex-col rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 overflow-hidden transition-all duration-400 cursor-pointer"
            onClick={() => onOpen(project)}
        >
            {/* ── Top: Image strip with status badge ── */}
            <div className="relative">
                <div className="absolute top-3 left-3 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${status.color}`}>
                        {status.label}
                    </span>
                </div>
                <ImageStrip images={images} gradient={gradient} />
            </div>

            {/* ── Card Body ── */}
            <div className="flex flex-col flex-1 p-5">

                {/* Title + Progress */}
                <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1 tracking-tight">
                            {project.title}
                        </h3>
                        <p className="text-sm text-foreground/55 mt-0.5 line-clamp-1">
                            {project.shortDesc}
                        </p>
                    </div>
                    <div className="flex-shrink-0 mt-0.5">
                        <CircularProgress value={project.progress} gradient={gradient} />
                    </div>
                </div>

                {/* Meta info */}
                <div className="flex flex-col gap-1 mt-3 mb-3 text-xs text-foreground/50">
                    {project.teamMembers?.length > 0 && (
                        <span className="flex items-center gap-1.5">
                            <Users size={12} className="flex-shrink-0" />
                            {project.teamMembers.length} member{project.teamMembers.length !== 1 ? "s" : ""}
                        </span>
                    )}
                    <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="flex-shrink-0" />
                        Updated {dateStr}
                    </span>
                </div>

                {/* Tech tags */}
                {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.slice(0, 3).map((t) => (
                            <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/8 text-primary text-xs font-semibold">
                                <Tag size={9} />{t}
                            </span>
                        ))}
                        {project.technologies.length > 3 && (
                            <span className="px-2 py-0.5 rounded-lg bg-foreground/6 text-foreground/45 text-xs">
                                +{project.technologies.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* CTA Button */}
                <button
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
                >
                    View Details <ChevronRight size={13} />
                </button>

                {/* Divider */}
                <div className="border-t border-border/40 mt-4 pt-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button className="p-1.5 rounded-lg text-foreground/35 hover:text-primary hover:bg-primary/6 transition-all" title="Members">
                                <UserCircle2 size={16} />
                            </button>
                            <button className="p-1.5 rounded-lg text-foreground/35 hover:text-primary hover:bg-primary/6 transition-all" title="Share">
                                <Share2 size={16} />
                            </button>
                            {project.githubLink && (
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg text-foreground/35 hover:text-foreground hover:bg-foreground/6 transition-all" title="GitHub">
                                    <Github size={16} />
                                </a>
                            )}
                        </div>

                        {/* Delete */}
                        <button
                            onClick={handleDeleteClick}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${confirmDelete
                                ? "bg-red-500 text-white shadow shadow-red-400/30"
                                : "text-foreground/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                }`}
                        >
                            <Trash2 size={12} />
                            {confirmDelete ? "Confirm?" : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Skeleton Card ──────────────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="rounded-2xl bg-card border border-border/40 overflow-hidden animate-pulse">
        <div className="h-48 bg-foreground/8" />
        <div className="p-5 space-y-3">
            <div className="flex justify-between">
                <div className="space-y-2 flex-1 mr-6">
                    <div className="h-5 bg-foreground/8 rounded-lg w-3/4" />
                    <div className="h-3.5 bg-foreground/6 rounded w-full" />
                </div>
                <div className="w-14 h-14 rounded-full bg-foreground/8 flex-shrink-0" />
            </div>
            <div className="h-3 bg-foreground/6 rounded w-1/2" />
            <div className="flex gap-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-5 w-14 bg-foreground/6 rounded-lg" />)}
            </div>
            <div className="h-10 bg-foreground/8 rounded-xl" />
            <div className="h-px bg-border/40" />
            <div className="flex justify-between">
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="w-7 h-7 bg-foreground/6 rounded-lg" />)}
                </div>
                <div className="h-7 w-16 bg-foreground/6 rounded-lg" />
            </div>
        </div>
    </div>
);

/* ── Main Page ──────────────────────────────────────────────────────── */
const MyProjects: React.FC = () => {
    const { user } = useAuth();
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [selectedProject, setSelectedProject] = useState<{ project: ProjectData; index: number } | null>(null);

    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                setProjects(await getUserProjects(user.uid));
            } catch (err: any) {
                console.error("Error fetching projects:", err);
                toast.error("Failed to load projects");
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    const filteredProjects = projects.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
            (p.title.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q)) &&
            (filter === "all" || p.status === filter)
        );
    });

    const handleDelete = async (id: string) => {
        try {
            await deleteProject(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
            setSelectedProject(null);
            toast.success("Project deleted");
        } catch {
            toast.error("Failed to delete project");
        }
    };

    const counts = {
        active: projects.filter((p) => p.status === "In Progress").length,
        done: projects.filter((p) => p.status === "Completed").length,
    };

    const openModal = useCallback((project: ProjectData) => {
        const idx = projects.findIndex((p) => p.id === project.id);
        setSelectedProject({ project, index: idx >= 0 ? idx : 0 });
    }, [projects]);

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 reveal">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">My Projects</h1>
                        <div className="flex items-center gap-3 mt-1 text-sm text-foreground/55">
                            <span>{projects.length} total</span>
                            <span className="w-1 h-1 rounded-full bg-foreground/30" />
                            <span className="text-blue-500 font-medium">{counts.active} active</span>
                            <span className="w-1 h-1 rounded-full bg-foreground/30" />
                            <span className="text-emerald-500 font-medium">{counts.done} done</span>
                        </div>
                    </div>
                    <Link to="/dashboard/upload">
                        <MagneticButton variant="primary" size="md">
                            <Rocket size={16} /> New Project <ChevronRight size={14} />
                        </MagneticButton>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 reveal">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search projects..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/80 border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm text-foreground placeholder-foreground/30 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap flex-1">
                        {["all", "In Progress", "Planning", "Completed", "On Hold"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                                    }`}
                            >
                                {f === "all" ? "All" : f}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-foreground/5 self-start">
                        <button
                            onClick={() => setView("grid")}
                            className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-background shadow text-primary" : "text-foreground/40 hover:text-foreground"}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-background shadow text-primary" : "text-foreground/40 hover:text-foreground"}`}
                        >
                            <LayoutList size={16} />
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className={`grid ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-5`}>
                        {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Empty */}
                {!loading && projects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-5 border border-primary/10">
                            <Folder size={36} className="text-primary/50" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No projects yet</h3>
                        <p className="text-foreground/50 mb-7 max-w-xs">Upload your first project to start building your portfolio.</p>
                        <Link to="/dashboard/upload">
                            <MagneticButton variant="primary" size="md">
                                <Rocket size={16} /> Create Your First Project
                            </MagneticButton>
                        </Link>
                    </div>
                )}

                {/* Grid / List */}
                {!loading && filteredProjects.length > 0 && (
                    <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"}>
                        {filteredProjects.map((project, idx) => (
                            <ProjectCard
                                key={project.id || idx}
                                project={project}
                                index={idx}
                                onDelete={handleDelete}
                                view={view}
                                onOpen={openModal}
                            />
                        ))}
                    </div>
                )}

                {/* No results */}
                {!loading && projects.length > 0 && filteredProjects.length === 0 && (
                    <div className="text-center py-16">
                        <Search size={28} className="text-foreground/20 mx-auto mb-3" />
                        <p className="text-foreground/50 text-sm">No projects match your search.</p>
                        <button onClick={() => { setSearchQuery(""); setFilter("all"); }}
                            className="mt-4 text-sm text-primary hover:underline">
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Project Detail Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject.project}
                    gradient={cardGradients[selectedProject.index % cardGradients.length]}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </DashboardLayout>
    );
};

export default MyProjects;
