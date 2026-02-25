import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import {
    Users,
    FolderKanban,
    TrendingUp,
    Clock,
    Loader2,
    UserPlus,
    LogIn,
    PlusSquare,
    Edit3,
    Trash2,
    Activity,
} from "lucide-react";
import {
    getAllUsers,
    getAllProjects,
    getRecentActivities,
    type UserProfile,
    type ProjectData,
    type ActivityLog,
} from "@/lib/firestore";

/* ── Activity icon + colour map ──────────────────────────────────── */
const ACTIVITY_META: Record<
    string,
    { icon: React.ElementType; color: string; bg: string }
> = {
    user_registered: { icon: UserPlus, color: "#417690", bg: "#eef5f9" },
    user_logged_in: { icon: LogIn, color: "#0e7490", bg: "#e0f7fa" },
    project_created: { icon: PlusSquare, color: "#609b5b", bg: "#edfaed" },
    project_updated: { icon: Edit3, color: "#c4a000", bg: "#fdf8e1" },
    project_deleted: { icon: Trash2, color: "#cc3333", bg: "#fdecea" },
    user_updated: { icon: Edit3, color: "#9b59b6", bg: "#f5eefa" },
};

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllUsers(), getAllProjects(), getRecentActivities(30)])
            .then(([u, p, a]) => {
                setUsers(u);
                setProjects(p);
                setActivities(a);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <AdminLayout title="Dashboard">
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin" style={{ color: "#417690" }} />
                </div>
            </AdminLayout>
        );
    }

    const totalUsers = users.length;
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === "In Progress").length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const recentUsers = users.slice(0, 5);
    const recentProjects = projects.slice(0, 5);

    return (
        <AdminLayout title="Site administration">
            {/* ── Stat cards ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { icon: Users, label: "Total Users", value: totalUsers, color: "#417690" },
                    { icon: FolderKanban, label: "Total Projects", value: totalProjects, color: "#79aec8" },
                    { icon: TrendingUp, label: "Active Projects", value: activeProjects, color: "#609b5b" },
                    { icon: Clock, label: "Completed", value: completed, color: "#9b59b6" },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded border border-[#ddd] p-4 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <s.icon size={18} style={{ color: s.color }} />
                            <span className="text-[12px] text-[#666] font-medium uppercase tracking-wide">{s.label}</span>
                        </div>
                        <span className="text-[28px] font-bold" style={{ color: s.color }}>{s.value}</span>
                    </div>
                ))}
            </div>

            {/* ── Module sections ────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Users module */}
                <div className="bg-white rounded border border-[#ddd] overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#79aec8" }}>
                        <h2 className="text-white text-[14px] font-bold">Recent Users</h2>
                        <Link to="/admin/users" className="text-white/80 hover:text-white text-[12px] font-medium">
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-[#eee]">
                        {recentUsers.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-[#999]">No users found</div>
                        ) : (
                            recentUsers.map((u) => (
                                <Link
                                    key={u.uid}
                                    to={`/admin/users/${u.uid}`}
                                    className="block px-4 py-[10px] flex items-center justify-between hover:bg-[#f6f6f6] transition-colors"
                                >
                                    <div>
                                        <span className="text-[13px] font-semibold" style={{ color: "#417690" }}>{u.name}</span>
                                        <span className="text-[12px] text-[#999] ml-2">{u.email}</span>
                                    </div>
                                    <span className="text-[11px] bg-[#eef5f9] text-[#417690] px-2 py-0.5 rounded font-medium">{u.role}</span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Projects module */}
                <div className="bg-white rounded border border-[#ddd] overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#79aec8" }}>
                        <h2 className="text-white text-[14px] font-bold">Recent Projects</h2>
                        <Link to="/admin/projects" className="text-white/80 hover:text-white text-[12px] font-medium">
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-[#eee]">
                        {recentProjects.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-[#999]">No projects found</div>
                        ) : (
                            recentProjects.map((p) => (
                                <div key={p.id} className="px-4 py-[10px] flex items-center justify-between hover:bg-[#f6f6f6] transition-colors">
                                    <div>
                                        <span className="text-[13px] font-semibold" style={{ color: "#417690" }}>{p.title}</span>
                                        <span className="text-[12px] text-[#999] ml-2">by {p.ownerName}</span>
                                    </div>
                                    <span
                                        className={`text-[11px] px-2 py-0.5 rounded font-medium ${p.status === "In Progress" ? "bg-blue-50 text-blue-700"
                                            : p.status === "Completed" ? "bg-green-50 text-green-700"
                                                : p.status === "On Hold" ? "bg-orange-50 text-orange-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {p.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ── Activity feed ──────────────────────────────────────── */}
            <div className="bg-white rounded border border-[#ddd] overflow-hidden">
                <div
                    className="px-4 py-3 flex items-center gap-2 border-b border-[#ddd]"
                    style={{ background: "#f8f8f8" }}
                >
                    <Activity size={16} style={{ color: "#417690" }} />
                    <h2 className="text-[14px] font-bold text-[#333]">Recent Activity</h2>
                    <span className="text-[12px] text-[#999] ml-auto">{activities.length} events</span>
                </div>

                {activities.length === 0 ? (
                    <div className="px-4 py-10 text-center text-sm text-[#999]">
                        No activity yet — activity is recorded once users start registering and creating projects.
                    </div>
                ) : (
                    <div className="divide-y divide-[#f0f0f0] max-h-[480px] overflow-y-auto">
                        {activities.map((a, i) => {
                            const meta = ACTIVITY_META[a.type] ?? ACTIVITY_META.project_updated;
                            const Icon = meta.icon;
                            const date = a.createdAt
                                ? a.createdAt.toDate().toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "—";

                            return (
                                <div
                                    key={a.id ?? i}
                                    className="flex items-start gap-3 px-4 py-3 hover:bg-[#fafafa] transition-colors"
                                >
                                    {/* Icon bubble */}
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                        style={{ background: meta.bg }}
                                    >
                                        <Icon size={13} style={{ color: meta.color }} />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] text-[#333] leading-snug">
                                            <strong style={{ color: "#417690" }}>{a.userName}</strong>{" "}
                                            {a.details}
                                        </p>
                                        <p className="text-[11px] text-[#999] mt-0.5">{date}</p>
                                    </div>

                                    {/* Type badge */}
                                    <span
                                        className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide flex-shrink-0 mt-1"
                                        style={{ background: meta.bg, color: meta.color }}
                                    >
                                        {(a.type as string).split("_").join(" ")}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
