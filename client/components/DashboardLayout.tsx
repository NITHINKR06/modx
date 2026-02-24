import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Rocket,
  Settings,
  LogOut,
  Bell,
  User,
  ChevronDown,
  Upload,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const menuItems = [
    { icon: Home, label: "Overview", path: "/dashboard" },
    { icon: Rocket, label: "My Projects", path: "/dashboard/projects" },
    { icon: Upload, label: "Upload Project", path: "/dashboard/upload" },
    { icon: UsersRound, label: "Teams", path: "/dashboard/teams" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const handleLogout = async () => {
    await signOutUser();
    navigate("/login");
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after clicking a link
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-white via-blue-50/50 to-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 h-screen transition-all duration-300 w-64 bg-white border-r border-border/50 flex flex-col ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-20"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-white text-lg">M</span>
            </div>
            <span className={`font-bold text-lg text-foreground ${sidebarOpen ? "block" : "hidden md:hidden"}`}>MODX</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-foreground hover:text-primary transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 md:px-4 py-3 rounded-lg transition-all duration-300 ${isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className={`font-medium ${sidebarOpen ? "block" : "hidden"}`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border/50 p-3 md:p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-lg text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-300"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`font-medium ${sidebarOpen ? "block" : "hidden"}`}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Navigation */}
        <div className="h-16 md:h-20 bg-white border-b border-border/50 flex items-center justify-between px-4 md:px-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-foreground p-1"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center text-foreground/70 text-sm md:text-base truncate">
            <span className="truncate">Welcome, {displayName}!</span>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* Notifications */}
            <button className="relative text-foreground/70 hover:text-foreground transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full" />
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {initial}
                </div>
                <ChevronDown
                  size={16}
                  className={`hidden sm:block transition-transform ${profileMenuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg border border-border/50 shadow-lg overflow-hidden z-50">
                  <Link
                    to="/dashboard/settings"
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors border-t border-border/50"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-border/50"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
};
