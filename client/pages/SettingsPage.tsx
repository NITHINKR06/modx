import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import { User, Bell, Shield, Palette, Save, Mail, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/firestore";
import { updatePassword } from "firebase/auth";
import { toast } from "sonner";

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState({ name: "", email: "", bio: "", role: "" });
    const [notifications, setNotifications] = useState({ email: true, projects: true, teams: false, newsletter: true });
    const [saved, setSaved] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" });

    useEffect(() => {
        if (!user) return;
        getUserProfile(user.uid)
            .then((p) => {
                if (p) setProfile({ name: p.name, email: p.email, bio: p.bio || "", role: p.role || "Member" });
                else setProfile({ name: user.displayName || "", email: user.email || "", bio: "", role: "Member" });
            })
            .catch(() => setProfile({ name: user.displayName || "", email: user.email || "", bio: "", role: "Member" }))
            .finally(() => setLoadingProfile(false));
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        try {
            await updateUserProfile(user.uid, { name: profile.name, bio: profile.bio, role: profile.role });
            setSaved(true);
            toast.success("Settings saved");
            setTimeout(() => setSaved(false), 2500);
        } catch { toast.error("Failed to save settings"); }
    };

    const handlePasswordChange = async () => {
        if (!user) return;
        if (passwords.newPwd !== passwords.confirm) { toast.error("Passwords don't match"); return; }
        if (passwords.newPwd.length < 6) { toast.error("Password must be at least 6 characters"); return; }
        try {
            await updatePassword(user, passwords.newPwd);
            toast.success("Password updated");
            setPasswords({ current: "", newPwd: "", confirm: "" });
        } catch (e: any) {
            toast.error(e?.code === "auth/requires-recent-login" ? "Please log out and log back in before changing your password" : "Failed to update password");
        }
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
                <div className="reveal">
                    <h1 className="text-4xl font-black text-foreground mb-2">Settings</h1>
                    <p className="text-foreground/70">Manage your account and preferences</p>
                </div>

                <div className="flex gap-2 border-b border-border/50 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all duration-300 border-b-2 whitespace-nowrap ${activeTab === tab.id ? "text-primary border-primary" : "text-foreground/60 border-transparent hover:text-foreground"}`}>
                            <tab.icon size={16} />{tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "profile" && (
                    <div className="space-y-6 reveal">
                        <TiltCard variant="glass" className="p-8">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white font-black text-3xl">
                                        {profile.name.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-colors shadow-lg">
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">{profile.name || "User"}</h3>
                                    <p className="text-foreground/60 text-sm">{profile.role}</p>
                                </div>
                            </div>
                        </TiltCard>
                        <TiltCard variant="glass" className="p-8">
                            <h3 className="text-lg font-bold text-foreground mb-6">Personal Information</h3>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground/80 mb-2">Full Name</label>
                                        <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition-all duration-300" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground/80 mb-2">Role</label>
                                        <input type="text" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition-all duration-300" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground/80 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                                        <input type="email" value={profile.email} disabled className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/40 border border-border text-foreground/60 cursor-not-allowed" />
                                    </div>
                                    <p className="text-xs text-foreground/40 mt-1">Email cannot be changed</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground/80 mb-2">Bio</label>
                                    <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition-all duration-300 resize-none" />
                                </div>
                            </div>
                        </TiltCard>
                    </div>
                )}

                {activeTab === "notifications" && (
                    <TiltCard variant="glass" className="p-8 reveal">
                        <h3 className="text-lg font-bold text-foreground mb-6">Notification Preferences</h3>
                        <div className="space-y-5">
                            {([{ key: "email" as const, label: "Email Notifications", desc: "Receive important updates via email" }, { key: "projects" as const, label: "Project Updates", desc: "Get notified about project milestones" }, { key: "teams" as const, label: "Team Activity", desc: "Notifications when team members make changes" }, { key: "newsletter" as const, label: "MODX Newsletter", desc: "Weekly digest of community news" }]).map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                                    <div><p className="font-semibold text-foreground text-sm">{item.label}</p><p className="text-xs text-foreground/60">{item.desc}</p></div>
                                    <button onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })} className={`w-12 h-7 rounded-full transition-all duration-300 relative ${notifications[item.key] ? "bg-primary" : "bg-foreground/20"}`}>
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow ${notifications[item.key] ? "translate-x-6" : "translate-x-1"}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </TiltCard>
                )}

                {activeTab === "security" && (
                    <div className="space-y-6 reveal">
                        <TiltCard variant="glass" className="p-8">
                            <h3 className="text-lg font-bold text-foreground mb-6">Change Password</h3>
                            <div className="space-y-5 max-w-md">
                                <div><label className="block text-sm font-semibold text-foreground/80 mb-2">New Password</label><input type="password" value={passwords.newPwd} onChange={(e) => setPasswords({ ...passwords, newPwd: e.target.value })} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300" /></div>
                                <div><label className="block text-sm font-semibold text-foreground/80 mb-2">Confirm New Password</label><input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300" /></div>
                                <button onClick={handlePasswordChange} className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg transition-all duration-300">Update Password</button>
                            </div>
                        </TiltCard>
                        <TiltCard variant="glass" className="p-8">
                            <h3 className="text-lg font-bold text-foreground mb-2">Two-Factor Authentication</h3>
                            <p className="text-sm text-foreground/60 mb-4">Add an extra layer of security to your account</p>
                            <MagneticButton variant="outline" size="md"><Shield size={16} /> Enable 2FA</MagneticButton>
                        </TiltCard>
                    </div>
                )}

                {activeTab === "appearance" && (
                    <TiltCard variant="glass" className="p-8 reveal">
                        <h3 className="text-lg font-bold text-foreground mb-6">Theme & Display</h3>
                        <p className="text-sm text-foreground/60 mb-4">Use the theme toggle in the navigation bar to switch between light and dark modes.</p>
                        <div className="grid grid-cols-2 gap-4 max-w-sm">
                            <button className="p-6 rounded-xl border-2 border-primary bg-white text-center transition-all"><div className="w-8 h-8 bg-gray-100 rounded-lg mx-auto mb-2" /><span className="text-sm font-semibold text-foreground">Light</span></button>
                            <button className="p-6 rounded-xl border border-border bg-slate-900 text-center transition-all hover:border-primary"><div className="w-8 h-8 bg-slate-800 rounded-lg mx-auto mb-2" /><span className="text-sm font-semibold text-white">Dark</span></button>
                        </div>
                    </TiltCard>
                )}

                <div className="flex justify-end">
                    <button onClick={handleSave} className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 inline-flex items-center gap-2 ${saved ? "bg-green-500 text-white" : "bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"}`}>
                        {saved ? (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Saved!</>) : (<><Save size={16} /> Save Changes</>)}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
