import React, { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import {
    Search,
    Trash2,
    Edit,
    Loader2,
    ChevronLeft,
    ChevronRight,
    X,
    Save,
    Eye,
    Github,
    ExternalLink,
    Users,
    Tag,
    ImageOff,
    ChevronLeft as ImgPrev,
    ChevronRight as ImgNext,
} from "lucide-react";
import {
    getAllProjects,
    updateProject,
    deleteProject,
    type ProjectData,
} from "@/lib/firestore";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 15;
const STATUS_OPTIONS: ProjectData["status"][] = ["Planning", "In Progress", "Completed", "On Hold"];

/* ── Status badge helper ────────────────────────────────────────── */
const StatusBadge: React.FC<{ status: ProjectData["status"] }> = ({ status }) => {
    const cls =
        status === "In Progress"
            ? "bg-blue-50 text-blue-700"
            : status === "Completed"
                ? "bg-green-50 text-green-700"
                : status === "On Hold"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-gray-100 text-gray-600";
    return (
        <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${cls}`}>
            {status}
        </span>
    );
};

/* ── Project detail modal ───────────────────────────────────────── */
const ProjectDetailModal: React.FC<{ project: ProjectData; onClose: () => void }> = ({
    project,
    onClose,
}) => {
    const [imgIdx, setImgIdx] = useState(0);
    const images = project.images?.filter(Boolean) ?? [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                className="bg-white rounded shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 py-3 sticky top-0 z-10"
                    style={{ background: "#417690" }}
                >
                    <h2 className="text-white font-bold text-[15px] truncate pr-4">{project.title}</h2>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Image gallery */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#666]">Images</span>
                            <span className="text-[11px] text-[#999]">({images.length})</span>
                        </div>
                        {images.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 bg-[#f5f5f5] rounded border border-[#ddd] text-[#bbb]">
                                <ImageOff size={28} className="mb-2" />
                                <span className="text-[12px]">No images uploaded</span>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={images[imgIdx]}
                                    alt={`${project.title} image ${imgIdx + 1}`}
                                    className="w-full rounded border border-[#ddd] object-cover"
                                    style={{ maxHeight: "320px", objectFit: "cover" }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://via.placeholder.com/640x320?text=Image+not+available";
                                    }}
                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
                                            disabled={imgIdx === 0}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 disabled:opacity-30"
                                        >
                                            <ImgPrev size={16} />
                                        </button>
                                        <button
                                            onClick={() => setImgIdx((i) => Math.min(images.length - 1, i + 1))}
                                            disabled={imgIdx === images.length - 1}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 disabled:opacity-30"
                                        >
                                            <ImgNext size={16} />
                                        </button>
                                        {/* Thumbnails */}
                                        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                                            {images.map((img, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setImgIdx(i)}
                                                    className={`flex-shrink-0 w-14 h-14 rounded border-2 overflow-hidden transition-all ${i === imgIdx ? "border-[#417690]" : "border-transparent opacity-60 hover:opacity-100"
                                                        }`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`thumb ${i + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Meta row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: "Owner", value: project.ownerName },
                            { label: "Status", value: <StatusBadge status={project.status} /> },
                            { label: "Progress", value: `${project.progress}%` },
                            { label: "Created", value: project.createdAt ? project.createdAt.toDate().toLocaleDateString() : "—" },
                        ].map((m, i) => (
                            <div key={i} className="bg-[#f8f8f8] border border-[#eee] rounded p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#999] mb-1">{m.label}</p>
                                <div className="text-[13px] font-medium text-[#333]">{m.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div>
                        <div className="w-full h-2 bg-[#eee] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${project.progress}%`, background: "#79aec8" }}
                            />
                        </div>
                    </div>

                    {/* Short description */}
                    {project.shortDesc && (
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#666] mb-1">Short Description</p>
                            <p className="text-[13px] text-[#444] leading-relaxed bg-[#f8f8f8] border border-[#eee] rounded p-3">
                                {project.shortDesc}
                            </p>
                        </div>
                    )}

                    {/* Detailed description */}
                    {project.detailedDesc && (
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#666] mb-1">Detailed Description</p>
                            <p className="text-[13px] text-[#444] leading-relaxed bg-[#f8f8f8] border border-[#eee] rounded p-3 whitespace-pre-wrap">
                                {project.detailedDesc}
                            </p>
                        </div>
                    )}

                    {/* Technologies */}
                    {project.technologies?.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Tag size={13} className="text-[#417690]" />
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#666]">Technologies</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech, i) => (
                                    <span
                                        key={i}
                                        className="text-[12px] px-3 py-1 rounded-full font-medium"
                                        style={{ background: "#eef5f9", color: "#417690" }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Team members */}
                    {project.teamMembers?.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Users size={13} className="text-[#417690]" />
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#666]">
                                    Team Members ({project.teamMembers.length})
                                </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {project.teamMembers.map((m, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 p-2 rounded border border-[#eee] bg-[#f8f8f8]"
                                    >
                                        <div
                                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                                            style={{ background: "#79aec8" }}
                                        >
                                            {m.name?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[12px] font-semibold text-[#333] truncate">{m.name}</p>
                                            <p className="text-[11px] text-[#999] truncate">{m.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    {(project.githubLink || project.demoLink) && (
                        <div className="flex flex-wrap gap-3">
                            {project.githubLink && (
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded border border-[#ccc] text-[13px] text-[#333] hover:bg-[#f5f5f5] transition-colors"
                                >
                                    <Github size={14} />
                                    GitHub
                                </a>
                            )}
                            {project.demoLink && (
                                <a
                                    href={project.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded text-[13px] text-white transition-colors"
                                    style={{ background: "#417690" }}
                                >
                                    <ExternalLink size={14} />
                                    Live Demo
                                </a>
                            )}
                        </div>
                    )}

                    {/* Firestore doc ID */}
                    <div className="text-[11px] text-[#bbb] font-mono pt-2 border-t border-[#eee]">
                        ID: {project.id}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Main page ──────────────────────────────────────────────────── */
const AdminProjects: React.FC = () => {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [filtered, setFiltered] = useState<ProjectData[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editStatus, setEditStatus] = useState<ProjectData["status"]>("Planning");
    const [editProgress, setEditProgress] = useState(0);
    const [viewProject, setViewProject] = useState<ProjectData | null>(null);

    useEffect(() => {
        getAllProjects()
            .then((p) => {
                setProjects(p);
                setFiltered(p);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        let result = projects;
        if (q) {
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.ownerName.toLowerCase().includes(q) ||
                    p.technologies?.some((t) => t.toLowerCase().includes(q))
            );
        }
        if (statusFilter !== "all") {
            result = result.filter((p) => p.status === statusFilter);
        }
        setFiltered(result);
        setPage(1);
    }, [search, statusFilter, projects]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const pageData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleDelete = async (id: string) => {
        const projectToDelete = projects.find((p) => p.id === id);
        try {
            await deleteProject(id, {
                ownerUid: projectToDelete?.ownerId,
                ownerName: projectToDelete?.ownerName,
                title: projectToDelete?.title,
            });
            setProjects((prev) => prev.filter((p) => p.id !== id));
            if (viewProject?.id === id) setViewProject(null);
            toast.success("Project deleted");
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete project");
        } finally {
            setDeleteConfirm(null);
        }
    };


    const startEdit = (p: ProjectData) => {
        setEditingId(p.id!);
        setEditStatus(p.status);
        setEditProgress(p.progress);
    };

    const saveEdit = async () => {
        if (!editingId) return;
        const projectBeingEdited = projects.find((p) => p.id === editingId);
        try {
            await updateProject(
                editingId,
                { status: editStatus, progress: editProgress },
                "admin",  // actor UID — use actual admin UID if available from auth context
                "Admin"
            );
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === editingId ? { ...p, status: editStatus, progress: editProgress } : p
                )
            );
            toast.success("Project updated");
        } catch (err: any) {
            toast.error(err?.message || "Failed to update project");
        } finally {
            setEditingId(null);
        }
    };


    if (loading) {
        return (
            <AdminLayout title="Projects" breadcrumbs={[{ label: "Projects" }]}>
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin" style={{ color: "#417690" }} />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Select project to change"
            breadcrumbs={[{ label: "Projects" }]}
        >
            {/* Detail modal */}
            {viewProject && (
                <ProjectDetailModal
                    project={viewProject}
                    onClose={() => setViewProject(null)}
                />
            )}

            {/* Toolbar */}
            <div className="bg-white border border-[#ddd] rounded-t px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects..."
                            className="pl-8 pr-4 py-[7px] border border-[#ccc] rounded text-[13px] w-full sm:w-[280px] focus:outline-none focus:border-[#79aec8]"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="py-[7px] px-3 border border-[#ccc] rounded text-[13px] bg-white focus:outline-none focus:border-[#79aec8]"
                    >
                        <option value="all">All statuses</option>
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <span className="text-[12px] text-[#666]">
                    {filtered.length} project{filtered.length !== 1 ? "s" : ""} total
                </span>
            </div>

            {/* Table */}
            <div className="bg-white border border-t-0 border-[#ddd] overflow-x-auto">
                <table className="w-full text-[13px]">
                    <thead>
                        <tr style={{ background: "#f8f8f8" }}>
                            <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Title</th>
                            <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Owner</th>
                            <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Status</th>
                            <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Progress</th>
                            <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Images</th>
                            <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Created</th>
                            <th className="text-right px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-[#999]">
                                    {search || statusFilter !== "all" ? "No projects match your filters" : "No projects found"}
                                </td>
                            </tr>
                        ) : (
                            pageData.map((p, i) => (
                                <tr
                                    key={p.id}
                                    className={`hover:bg-[#f0f6fa] transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"}`}
                                >
                                    {/* Title + thumbnail preview */}
                                    <td className="px-4 py-[10px] border-b border-[#eee]">
                                        <div className="flex items-center gap-3">
                                            {p.images?.[0] ? (
                                                <img
                                                    src={p.images[0]}
                                                    alt={p.title}
                                                    className="w-9 h-9 rounded object-cover border border-[#ddd] flex-shrink-0"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded bg-[#eef5f9] border border-[#ddd] flex items-center justify-center flex-shrink-0">
                                                    <ImageOff size={14} className="text-[#bbb]" />
                                                </div>
                                            )}
                                            <span
                                                className="font-semibold cursor-pointer hover:underline"
                                                style={{ color: "#417690" }}
                                                onClick={() => setViewProject(p)}
                                            >
                                                {p.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-[10px] border-b border-[#eee] text-[#666]">{p.ownerName}</td>
                                    <td className="px-4 py-[10px] border-b border-[#eee]">
                                        {editingId === p.id ? (
                                            <select
                                                value={editStatus}
                                                onChange={(e) => setEditStatus(e.target.value as ProjectData["status"])}
                                                className="py-1 px-2 border border-[#ccc] rounded text-[12px] bg-white focus:outline-none focus:border-[#79aec8]"
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <StatusBadge status={p.status} />
                                        )}
                                    </td>
                                    <td className="px-4 py-[10px] border-b border-[#eee]">
                                        {editingId === p.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    value={editProgress}
                                                    onChange={(e) =>
                                                        setEditProgress(Math.min(100, Math.max(0, Number(e.target.value))))
                                                    }
                                                    className="w-16 py-1 px-2 border border-[#ccc] rounded text-[12px] focus:outline-none focus:border-[#79aec8]"
                                                />
                                                <span className="text-[11px] text-[#999]">%</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-[6px] bg-[#eee] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${p.progress}%`, background: "#79aec8" }}
                                                    />
                                                </div>
                                                <span className="text-[11px] text-[#666]">{p.progress}%</span>
                                            </div>
                                        )}
                                    </td>
                                    {/* Image count */}
                                    <td className="px-4 py-[10px] border-b border-[#eee]">
                                        <span className="text-[12px] text-[#666]">
                                            {p.images?.filter(Boolean).length ?? 0} image{(p.images?.filter(Boolean).length ?? 0) !== 1 ? "s" : ""}
                                        </span>
                                    </td>
                                    <td className="px-4 py-[10px] border-b border-[#eee] text-[#666]">
                                        {p.createdAt ? p.createdAt.toDate().toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-4 py-[10px] border-b border-[#eee] text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {editingId === p.id ? (
                                                <>
                                                    <button
                                                        onClick={saveEdit}
                                                        className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
                                                        title="Save"
                                                    >
                                                        <Save size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="p-1.5 rounded hover:bg-[#eee] text-[#999] transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {/* View details */}
                                                    <button
                                                        onClick={() => setViewProject(p)}
                                                        className="p-1.5 rounded hover:bg-[#eef5f9] transition-colors"
                                                        style={{ color: "#417690" }}
                                                        title="View details"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => startEdit(p)}
                                                        className="p-1.5 rounded hover:bg-[#eef5f9] text-[#417690] transition-colors"
                                                        title="Edit status/progress"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    {deleteConfirm === p.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleDelete(p.id!)}
                                                                className="px-2 py-1 bg-red-600 text-white text-[11px] rounded hover:bg-red-700"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="px-2 py-1 bg-[#eee] text-[#666] text-[11px] rounded hover:bg-[#ddd]"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirm(p.id!)}
                                                            className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white border border-t-0 border-[#ddd] rounded-b px-4 py-3 flex items-center justify-between text-[12px] text-[#666]">
                    <span>
                        Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1 rounded hover:bg-[#eee] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                            <button
                                key={pg}
                                onClick={() => setPage(pg)}
                                className={`w-7 h-7 rounded text-[12px] font-medium ${pg === page ? "text-white" : "hover:bg-[#eee] text-[#666]"
                                    }`}
                                style={pg === page ? { background: "#417690" } : {}}
                            >
                                {pg}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-1 rounded hover:bg-[#eee] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProjects;
