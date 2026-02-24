import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import { AvatarIcon } from "@/components/IconAvatar";
import { Users, UserPlus, Mail, MoreHorizontal, Search } from "lucide-react";

interface Team {
    name: string;
    description: string;
    members: { name: string; role: string }[];
    project: string;
    status: "Active" | "Forming" | "Completed";
}

const Teams: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const teams: Team[] = [
        {
            name: "Alpha Innovators",
            description: "Building an AI-powered learning platform for adaptive education",
            members: [
                { name: "Sarah Chen", role: "Lead" },
                { name: "Alex Kumar", role: "Backend" },
                { name: "Jessica Park", role: "Design" },
                { name: "David Singh", role: "ML" },
            ],
            project: "AI Learning Platform",
            status: "Active",
        },
        {
            name: "Green Coders",
            description: "Developing a real-time environmental impact tracking dashboard",
            members: [
                { name: "Michael Zhang", role: "Lead" },
                { name: "Emma Johnson", role: "Frontend" },
                { name: "Raj Patel", role: "Data" },
            ],
            project: "Eco Dashboard",
            status: "Active",
        },
        {
            name: "Connect Squad",
            description: "Creating a social networking platform for student collaboration",
            members: [
                { name: "Lisa Wang", role: "Lead" },
                { name: "Tom Harris", role: "Backend" },
                { name: "Anna Lee", role: "UX" },
                { name: "Chris Baker", role: "Mobile" },
            ],
            project: "Community Connect",
            status: "Forming",
        },
        {
            name: "Neural Network Lab",
            description: "Advanced machine learning framework for education and research",
            members: [
                { name: "Dr. James Wilson", role: "Advisor" },
                { name: "Priya Sharma", role: "Lead" },
                { name: "Kevin Liu", role: "Research" },
                { name: "Sophia Garcia", role: "Data Science" },
                { name: "Marcus Brown", role: "Engineering" },
                { name: "Yuki Tanaka", role: "Testing" },
            ],
            project: "Neural Networks",
            status: "Active",
        },
    ];

    const statusColors = {
        Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        Forming: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        Completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };

    const filteredTeams = teams.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.project.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 reveal">
                    <div>
                        <h1 className="text-4xl font-black text-foreground mb-2">Teams</h1>
                        <p className="text-foreground/70">
                            Manage and discover teams in the MODX community
                        </p>
                    </div>
                    <MagneticButton variant="primary" size="md">
                        <UserPlus size={18} /> Create Team
                    </MagneticButton>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search teams or projects..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300"
                    />
                </div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTeams.map((team, idx) => (
                        <TiltCard
                            key={idx}
                            variant="glass"
                            className="p-8 reveal cursor-pointer group"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                            {team.name}
                                        </h3>
                                        <span
                                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[team.status]}`}
                                        >
                                            {team.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/60">{team.description}</p>
                                </div>
                                <button className="p-2 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>

                            {/* Project link */}
                            <div className="mb-5">
                                <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                                    Project
                                </span>
                                <p className="text-sm font-semibold text-primary mt-0.5">
                                    {team.project}
                                </p>
                            </div>

                            {/* Members */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex -space-x-2">
                                        {team.members.slice(0, 4).map((member, mIdx) => (
                                            <AvatarIcon
                                                key={mIdx}
                                                name={member.name}
                                                size="sm"
                                                className="border-2 border-white dark:border-slate-900"
                                            />
                                        ))}
                                        {team.members.length > 4 && (
                                            <div className="w-9 h-9 rounded-full bg-foreground/10 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-semibold text-foreground/60">
                                                +{team.members.length - 4}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm text-foreground/50 ml-3">
                                        {team.members.length} members
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button className="p-2 rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/10 transition-all">
                                        <Mail size={16} />
                                    </button>
                                    <button className="p-2 rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/10 transition-all">
                                        <UserPlus size={16} />
                                    </button>
                                </div>
                            </div>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Teams;
