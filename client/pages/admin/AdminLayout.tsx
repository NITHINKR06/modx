import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    LayoutDashboard,
    Users,
    FolderKanban,
    LogOut,
    ChevronRight,
    Shield,
    RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: { label: string; path?: string }[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
    children,
    title,
    breadcrumbs = [],
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOutUser } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
        { icon: Users, label: "Users", path: "/admin/users" },
        { icon: FolderKanban, label: "Projects", path: "/admin/projects" },
    ];

    const handleLogout = async () => {
        await signOutUser();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-[#f9f9f9] overflow-hidden" style={{ fontFamily: "'Segoe UI', system-ui, Roboto, sans-serif" }}>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 md:hidden z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <div
                className={`fixed md:relative z-40 h-screen transition-transform duration-200 w-[220px] flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
                style={{ background: "#417690" }}
            >
                {/* Branding */}
                <div className="flex items-center justify-between px-4 h-[48px]" style={{ background: "#205067" }}>
                    <Link to="/admin" className="flex items-center gap-2 text-white/90 font-bold text-sm tracking-wide">
                        <Shield size={18} />
                        MODX Administration
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="text-white/70 hover:text-white md:hidden">
                        <X size={18} />
                    </button>
                </div>

                {/* Welcome */}
                <div className="px-4 py-3 text-white/70 text-xs border-b border-white/10">
                    Welcome, <strong className="text-white/90">{user?.displayName || user?.email?.split("@")[0] || "Admin"}</strong>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-[10px] text-[13px] font-medium transition-colors ${isActive(item.path)
                                ? "bg-white/15 text-white border-l-[3px] border-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white border-l-[3px] border-transparent"
                                }`}
                        >
                            <item.icon size={16} className="flex-shrink-0" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer links */}
                <div className="border-t border-white/10">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-[10px] text-[13px] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <ChevronRight size={14} />
                        View Site
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-[10px] text-[13px] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <LogOut size={16} />
                        Log out
                    </button>
                </div>
            </div>

            {/* ── Main content ────────────────────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="h-[48px] flex items-center justify-between px-4 md:px-6 border-b" style={{ background: "#79aec8" }}>
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden text-white mr-3"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-1 text-[13px]">
                            <Link to="/admin" className="text-white/80 hover:text-white font-medium">
                                Home
                            </Link>
                            {breadcrumbs.map((bc, i) => (
                                <React.Fragment key={i}>
                                    <ChevronRight size={12} className="text-white/50" />
                                    {bc.path ? (
                                        <Link to={bc.path} className="text-white/80 hover:text-white font-medium">
                                            {bc.label}
                                        </Link>
                                    ) : (
                                        <span className="text-white font-semibold">{bc.label}</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </nav>
                    </div>

                    {/* Refresh button */}
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-semibold text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                        title="Refresh page"
                    >
                        <RefreshCw size={14} />
                        Refresh
                    </button>
                </header>

                {/* Page content */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-[1200px] mx-auto p-4 md:p-8">
                        {title && (
                            <h1
                                className="text-[22px] font-normal mb-5 pb-2 border-b-[3px]"
                                style={{ color: "#333", borderColor: "#79aec8" }}
                            >
                                {title}
                            </h1>
                        )}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
