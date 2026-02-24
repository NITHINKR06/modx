import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import {
    User,
    Bell,
    Shield,
    Palette,
    Save,
    Mail,
    Camera,
} from "lucide-react";

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState({
        name: "Sarah Chen",
        email: "sarah.chen@modx.club",
        bio: "Club President & Visionary Leader",
        role: "President",
    });
    const [notifications, setNotifications] = useState({
        email: true,
        projects: true,
        teams: false,
        newsletter: true,
    });
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "appearance", label: "Appearance", icon: Palette },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="reveal">
                    <h1 className="text-4xl font-black text-foreground mb-2">Settings</h1>
                    <p className="text-foreground/70">
                        Manage your account and preferences
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-border/50 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all duration-300 border-b-2 whitespace-nowrap ${activeTab === tab.id
                                    ? "text-primary border-primary"
                                    : "text-foreground/60 border-transparent hover:text-foreground"
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="space-y-6 reveal">
                        {/* Avatar */}
                        <TiltCard variant="glass" className="p-8">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white font-black text-3xl">
                                        {profile.name.charAt(0)}
                                    </div>
                                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-colors shadow-lg">
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">
                                        {profile.name}
                                    </h3>
                                    <p className="text-foreground/60 text-sm">{profile.role}</p>
                                </div>
                            </div>
                        </TiltCard>

                        {/* Profile Fields */}
                        <TiltCard variant="glass" className="p-8">
                            <h3 className="text-lg font-bold text-foreground mb-6">
                                Personal Information
                            </h3>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) =>
                                                setProfile({ ...profile, name: e.target.value })
                                            }
                                            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.role}
                                            onChange={(e) =>
                                                setProfile({ ...profile, role: e.target.value })
                                            }
                                            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                                        />
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) =>
                                                setProfile({ ...profile, email: e.target.value })
                                            }
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) =>
                                            setProfile({ ...profile, bio: e.target.value })
                                        }
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition-all duration-300 resize-none"
                                    />
                                </div>
                            </div>
                        </TiltCard>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                    <TiltCard variant="glass" className="p-8 reveal">
                        <h3 className="text-lg font-bold text-foreground mb-6">
                            Notification Preferences
                        </h3>
                        <div className="space-y-5">
                            {[
                                {
                                    key: "email" as const,
                                    label: "Email Notifications",
                                    desc: "Receive important updates via email",
                                },
                                {
                                    key: "projects" as const,
                                    label: "Project Updates",
                                    desc: "Get notified about project milestones and changes",
                                },
                                {
                                    key: "teams" as const,
                                    label: "Team Activity",
                                    desc: "Receive notifications when team members make changes",
                                },
                                {
                                    key: "newsletter" as const,
                                    label: "MODX Newsletter",
                                    desc: "Weekly digest of community news and highlights",
                                },
                            ].map((item) => (
                                <div
                                    key={item.key}
                                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                                >
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-foreground/60">{item.desc}</p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setNotifications({
                                                ...notifications,
                                                [item.key]: !notifications[item.key],
                                            })
                                        }
                                        className={`w-12 h-7 rounded-full transition-all duration-300 relative ${notifications[item.key]
                                                ? "bg-primary"
                                                : "bg-foreground/20"
                                            }`}
                                    >
                                        <div
                                            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow ${notifications[item.key]
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </TiltCard>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                    <div className="space-y-6 reveal">
                        <TiltCard variant="glass" className="p-8">
                            <h3 className="text-lg font-bold text-foreground mb-6">
                                Change Password
                            </h3>
                            <div className="space-y-5 max-w-md">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </TiltCard>

                        <TiltCard variant="glass" className="p-8">
                            <h3 className="text-lg font-bold text-foreground mb-2">
                                Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-foreground/60 mb-4">
                                Add an extra layer of security to your account
                            </p>
                            <MagneticButton variant="outline" size="md">
                                <Shield size={16} /> Enable 2FA
                            </MagneticButton>
                        </TiltCard>
                    </div>
                )}

                {/* Appearance Tab */}
                {activeTab === "appearance" && (
                    <TiltCard variant="glass" className="p-8 reveal">
                        <h3 className="text-lg font-bold text-foreground mb-6">
                            Theme & Display
                        </h3>
                        <p className="text-sm text-foreground/60 mb-4">
                            Use the theme toggle in the navigation bar to switch between light
                            and dark modes.
                        </p>
                        <div className="grid grid-cols-2 gap-4 max-w-sm">
                            <button className="p-6 rounded-xl border-2 border-primary bg-white text-center transition-all">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg mx-auto mb-2" />
                                <span className="text-sm font-semibold text-foreground">
                                    Light
                                </span>
                            </button>
                            <button className="p-6 rounded-xl border border-border bg-slate-900 text-center transition-all hover:border-primary">
                                <div className="w-8 h-8 bg-slate-800 rounded-lg mx-auto mb-2" />
                                <span className="text-sm font-semibold text-white">Dark</span>
                            </button>
                        </div>
                    </TiltCard>
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 inline-flex items-center gap-2 ${saved
                                ? "bg-green-500 text-white"
                                : "bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                            }`}
                    >
                        {saved ? (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save size={16} /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
