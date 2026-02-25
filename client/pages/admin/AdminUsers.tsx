import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { Search, Trash2, Edit, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllUsers, adminDeleteUser, type UserProfile } from "@/lib/firestore";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 15;

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [filtered, setFiltered] = useState<UserProfile[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getAllUsers()
            .then((u) => {
                setUsers(u);
                setFiltered(u);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            users.filter(
                (u) =>
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q) ||
                    u.role.toLowerCase().includes(q)
            )
        );
        setPage(1);
    }, [search, users]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const pageData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleDelete = async (uid: string) => {
        try {
            await adminDeleteUser(uid);
            setUsers((prev) => prev.filter((u) => u.uid !== uid));
            toast.success("User profile deleted");
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete user");
        } finally {
            setDeleteConfirm(null);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Users" breadcrumbs={[{ label: "Users" }]}>
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin" style={{ color: "#417690" }} />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title={`Select user to change`}
            breadcrumbs={[{ label: "Users" }]}
        >
            {/* Toolbar */}
            <div className="bg-white border border-[#ddd] rounded-t px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="relative w-full sm:w-auto">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="pl-8 pr-4 py-[7px] border border-[#ccc] rounded text-[13px] w-full sm:w-[280px] focus:outline-none focus:border-[#79aec8]"
                    />
                </div>
                <span className="text-[12px] text-[#666]">
                    {filtered.length} user{filtered.length !== 1 ? "s" : ""} total
                </span>
            </div>

            {/* Table */}
            <div className="bg-white border border-t-0 border-[#ddd] overflow-x-auto">
                <table className="w-full text-[13px]">
                    <thead>
                        <tr style={{ background: "#f8f8f8" }}>
                            <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Name</th>
                            <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Email</th>
                            <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Role</th>
                            <th className="text-left px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Joined</th>
                            <th className="text-right px-4 py-[10px] font-semibold text-[#333] border-b border-[#ddd]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-[#999]">
                                    {search ? "No users match your search" : "No users found"}
                                </td>
                            </tr>
                        ) : (
                            pageData.map((u, i) => (
                                <tr
                                    key={u.uid}
                                    className={`hover:bg-[#f6f6f6] transition-colors cursor-pointer ${i % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"
                                        }`}
                                    onClick={() => navigate(`/admin/users/${u.uid}`)}
                                >
                                    <td className="px-4 py-[10px] border-b border-[#eee]">
                                        <span className="font-semibold" style={{ color: "#417690" }}>{u.name}</span>
                                    </td>
                                    <td className="px-4 py-[10px] border-b border-[#eee] text-[#666]">{u.email}</td>
                                    <td className="px-4 py-[10px] border-b border-[#eee]">
                                        <span className="bg-[#eef5f9] text-[#417690] px-2 py-0.5 rounded text-[11px] font-medium">{u.role}</span>
                                    </td>
                                    <td className="px-4 py-[10px] border-b border-[#eee] text-[#666]">
                                        {u.createdAt ? u.createdAt.toDate().toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-4 py-[10px] border-b border-[#eee] text-right">
                                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => navigate(`/admin/users/${u.uid}`)}
                                                className="p-1.5 rounded hover:bg-[#eef5f9] text-[#417690] transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            {deleteConfirm === u.uid ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDelete(u.uid)}
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
                                                    onClick={() => setDeleteConfirm(u.uid)}
                                                    className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
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
                        Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1 rounded hover:bg-[#eee] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-7 h-7 rounded text-[12px] font-medium ${p === page ? "text-white" : "hover:bg-[#eee] text-[#666]"
                                    }`}
                                style={p === page ? { background: "#417690" } : {}}
                            >
                                {p}
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

export default AdminUsers;
