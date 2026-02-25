import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { Users, FolderKanban, Clock, TrendingUp, Loader2 } from "lucide-react";
import { getAllUsers, getAllProjects, type UserProfile, type ProjectData } from "@/lib/firestore";

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllUsers(), getAllProjects()])
            .then(([u, p]) => {
                setUsers(u);
                setProjects(p);
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
    const recentUsers = users.slice(0, 5);
    const recentProjects = projects.slice(0, 5);

    return (
        <AdminLayout title="Site administration">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { icon: Users, label: "Total Users", value: totalUsers, color: "#417690" },
                    { icon: FolderKanban, label: "Total Projects", value: totalProjects, color: "#79aec8" },
                    { icon: TrendingUp, label: "Active Projects", value: activeProjects, color: "#609b5b" },
                    { icon: Clock, label: "Completed", value: projects.filter((p) => p.status === "Completed").length, color: "#9b59b6" },
                ].map((s, i) => (
                    <div
                        key={i}
                        className="bg-white rounded border border-[#ddd] p-4 flex flex-col"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <s.icon size={18} style={{ color: s.color }} />
                            <span className="text-[12px] text-[#666] font-medium uppercase tracking-wide">{s.label}</span>
                        </div>
                        <span className="text-[28px] font-bold" style={{ color: s.color }}>{s.value}</span>
                    </div>
                ))}
            </div>

            {/* Module sections (Django-style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Users module */}
                <div className="bg-white rounded border border-[#ddd] overflow-hidden">
                    <div
                        className="px-4 py-3 flex items-center justify-between"
                        style={{ background: "#79aec8" }}
                    >
                        <h2 className="text-white text-[14px] font-bold">Users</h2>
                        <Link
                            to="/admin/users"
                            className="text-white/80 hover:text-white text-[12px] font-medium"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-[#eee]">
                        {recentUsers.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-[#999]">No users found</div>
                        ) : (
                            recentUsers.map((u) => (
                                <div key={u.uid} className="px-4 py-[10px] flex items-center justify-between hover:bg-[#f6f6f6] transition-colors">
                                    <div>
                                        <span className="text-[13px] font-semibold" style={{ color: "#417690" }}>{u.name}</span>
                                        <span className="text-[12px] text-[#999] ml-2">{u.email}</span>
                                    </div>
                                    <span className="text-[11px] bg-[#eef5f9] text-[#417690] px-2 py-0.5 rounded font-medium">{u.role}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Projects module */}
                <div className="bg-white rounded border border-[#ddd] overflow-hidden">
                    <div
                        className="px-4 py-3 flex items-center justify-between"
                        style={{ background: "#79aec8" }}
                    >
                        <h2 className="text-white text-[14px] font-bold">Projects</h2>
                        <Link
                            to="/admin/projects"
                            className="text-white/80 hover:text-white text-[12px] font-medium"
                        >
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
                                        className={`text-[11px] px-2 py-0.5 rounded font-medium ${p.status === "In Progress"
                                                ? "bg-blue-50 text-blue-700"
                                                : p.status === "Completed"
                                                    ? "bg-green-50 text-green-700"
                                                    : p.status === "On Hold"
                                                        ? "bg-orange-50 text-orange-700"
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

            {/* Recent activity */}
            <div className="mt-6 bg-white rounded border border-[#ddd] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ddd]" style={{ background: "#f8f8f8" }}>
                    <h2 className="text-[14px] font-bold text-[#333]">Recent Activity</h2>
                </div>
                <div className="px-4 py-3 text-[13px] text-[#666]">
                    <ul className="space-y-2">
                        {recentProjects.slice(0, 3).map((p, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#79aec8] flex-shrink-0" />
                                <span>
                                    <strong style={{ color: "#417690" }}>{p.ownerName}</strong> created project{" "}
                                    <strong>"{p.title}"</strong>
                                    {p.createdAt && (
                                        <span className="text-[#999] ml-1">
                                            — {p.createdAt.toDate().toLocaleDateString()}
                                        </span>
                                    )}
                                </span>
                            </li>
                        ))}
                        {recentProjects.length === 0 && (
                            <li className="text-[#999]">No recent activity</li>
                        )}
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
