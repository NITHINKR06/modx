import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import {
    Loader2,
    ArrowLeft,
    Save,
    Trash2,
    FolderKanban,
    Edit,
    X as XIcon,
} from "lucide-react";
import {
    getUserProfile,
    getUserProjects,
    adminUpdateUser,
    adminDeleteUser,
    deleteProject,
    type UserProfile,
    type ProjectData,
} from "@/lib/firestore";
import { toast } from "sonner";

const AdminUserDetail: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

    // Editable fields
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editRole, setEditRole] = useState("");

    useEffect(() => {
        if (!userId) return;
        Promise.all([getUserProfile(userId), getUserProjects(userId)])
            .then(([profile, projs]) => {
                setUser(profile);
                setProjects(projs);
                if (profile) {
                    setEditName(profile.name);
                    setEditBio(profile.bio || "");
                    setEditRole(profile.role);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [userId]);

    const handleSave = async () => {
        if (!userId) return;
        setSaving(true);
        try {
            await adminUpdateUser(userId, { name: editName, bio: editBio, role: editRole });
            setUser((prev) => prev ? { ...prev, name: editName, bio: editBio, role: editRole } : prev);
            toast.success("User updated successfully");
        } catch (err: any) {
            toast.error(err?.message || "Failed to update user");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!userId) return;
        try {
            await adminDeleteUser(userId);
            toast.success("User profile deleted");
            navigate("/admin/users");
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete user");
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            await deleteProject(projectId);
            setProjects((prev) => prev.filter((p) => p.id !== projectId));
            toast.success("Project deleted");
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete project");
        } finally {
            setDeleteProjectId(null);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="User Detail" breadcrumbs={[{ label: "Users", path: "/admin/users" }, { label: "Loading..." }]}>
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin" style={{ color: "#417690" }} />
                </div>
            </AdminLayout>
        );
    }

    if (!user) {
        return (
            <AdminLayout title="User not found" breadcrumbs={[{ label: "Users", path: "/admin/users" }, { label: "Not Found" }]}>
                <div className="bg-white border border-[#ddd] rounded p-8 text-center">
                    <p className="text-[#999] mb-4">User profile not found in Firestore.</p>
                    <Link to="/admin/users" className="text-[13px] font-medium" style={{ color: "#417690" }}>
                        ← Back to Users
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title={`Change user: ${user.name}`}
            breadcrumbs={[
                { label: "Users", path: "/admin/users" },
                { label: user.name },
            ]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Profile form */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-[#ddd] rounded overflow-hidden">
                        <div className="px-4 py-3 border-b border-[#ddd]" style={{ background: "#f8f8f8" }}>
                            <h2 className="text-[14px] font-bold text-[#333]">User Profile</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-[12px] font-semibold text-[#333] mb-1 uppercase tracking-wide">Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-3 py-[8px] border border-[#ccc] rounded text-[13px] focus:outline-none focus:border-[#79aec8]"
                                />
                            </div>
                            {/* Email (read-only) */}
                            <div>
                                <label className="block text-[12px] font-semibold text-[#333] mb-1 uppercase tracking-wide">Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-3 py-[8px] border border-[#ccc] rounded text-[13px] bg-[#f5f5f5] text-[#999]"
                                />
                                <p className="text-[11px] text-[#999] mt-1">Email cannot be changed from admin panel</p>
                            </div>
                            {/* Role */}
                            <div>
                                <label className="block text-[12px] font-semibold text-[#333] mb-1 uppercase tracking-wide">Role</label>
                                <input
                                    type="text"
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                    className="w-full px-3 py-[8px] border border-[#ccc] rounded text-[13px] focus:outline-none focus:border-[#79aec8]"
                                />
                            </div>
                            {/* Bio */}
                            <div>
                                <label className="block text-[12px] font-semibold text-[#333] mb-1 uppercase tracking-wide">Bio</label>
                                <textarea
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-[8px] border border-[#ccc] rounded text-[13px] focus:outline-none focus:border-[#79aec8] resize-y"
                                />
                            </div>
                            {/* Joined */}
                            <div>
                                <label className="block text-[12px] font-semibold text-[#333] mb-1 uppercase tracking-wide">Joined</label>
                                <p className="text-[13px] text-[#666]">
                                    {user.createdAt ? user.createdAt.toDate().toLocaleString() : "Unknown"}
                                </p>
                            </div>
                        </div>
                        {/* Save bar */}
                        <div className="px-4 py-3 border-t border-[#ddd] flex items-center justify-between" style={{ background: "#f8f8f8" }}>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-[7px] text-white text-[13px] font-medium rounded hover:opacity-90 disabled:opacity-60"
                                style={{ background: "#417690" }}
                            >
                                <Save size={14} />
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                            {deleteConfirm ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] text-red-600 font-medium">Are you sure?</span>
                                    <button
                                        onClick={handleDeleteUser}
                                        className="px-3 py-[6px] bg-red-600 text-white text-[12px] rounded hover:bg-red-700"
                                    >
                                        Yes, delete
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(false)}
                                        className="px-3 py-[6px] bg-[#eee] text-[#666] text-[12px] rounded hover:bg-[#ddd]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setDeleteConfirm(true)}
                                    className="flex items-center gap-2 px-4 py-[7px] text-red-600 text-[13px] font-medium rounded border border-red-200 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Delete user
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: User Info */}
                <div>
                    <div className="bg-white border border-[#ddd] rounded overflow-hidden mb-4">
                        <div className="px-4 py-3 border-b border-[#ddd]" style={{ background: "#f8f8f8" }}>
                            <h2 className="text-[14px] font-bold text-[#333]">Summary</h2>
                        </div>
                        <div className="p-4 space-y-3 text-[13px]">
                            <div className="flex justify-between">
                                <span className="text-[#999]">UID</span>
                                <span className="text-[#333] font-mono text-[11px]">{user.uid.slice(0, 12)}…</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#999]">Projects</span>
                                <span className="font-semibold" style={{ color: "#417690" }}>{projects.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#999]">Role</span>
                                <span className="bg-[#eef5f9] text-[#417690] px-2 py-0.5 rounded text-[11px] font-medium">{user.role}</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/admin/users"
                        className="flex items-center gap-2 text-[13px] font-medium mb-2"
                        style={{ color: "#417690" }}
                    >
                        <ArrowLeft size={14} />
                        Back to Users
                    </Link>
                </div>
            </div>

            {/* User's Projects */}
            <div className="mt-6 bg-white border border-[#ddd] rounded overflow-hidden">
                <div
                    className="px-4 py-3 flex items-center gap-2"
                    style={{ background: "#79aec8" }}
                >
                    <FolderKanban size={16} className="text-white" />
                    <h2 className="text-white text-[14px] font-bold">User's Projects ({projects.length})</h2>
                </div>
                {projects.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-[#999]">
                        This user has no projects
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px]">
                            <thead>
                                <tr style={{ background: "#f8f8f8" }}>
                                    <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Title</th>
                                    <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Status</th>
                                    <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Progress</th>
                                    <th className="text-right px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((p, i) => (
                                    <tr
                                        key={p.id}
                                        className={`hover:bg-[#f6f6f6] transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"
                                            }`}
                                    >
                                        <td className="px-4 py-[10px] border-b border-[#eee]">
                                            <span className="font-semibold" style={{ color: "#417690" }}>{p.title}</span>
                                        </td>
                                        <td className="px-4 py-[10px] border-b border-[#eee]">
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
                                        </td>
                                        <td className="px-4 py-[10px] border-b border-[#eee]">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-[6px] bg-[#eee] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${p.progress}%`, background: "#79aec8" }}
                                                    />
                                                </div>
                                                <span className="text-[11px] text-[#666]">{p.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-[10px] border-b border-[#eee] text-right">
                                            {deleteProjectId === p.id ? (
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleDeleteProject(p.id!)}
                                                        className="px-2 py-1 bg-red-600 text-white text-[11px] rounded hover:bg-red-700"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteProjectId(null)}
                                                        className="px-2 py-1 bg-[#eee] text-[#666] text-[11px] rounded hover:bg-[#ddd]"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteProjectId(p.id!)}
                                                    className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                                                    title="Delete project"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminUserDetail;
