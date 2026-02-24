import React from "react";
import { LucideIcon } from "lucide-react";

interface AvatarIconProps {
    name: string;
    size?: "sm" | "md" | "lg" | "xl";
    colorIndex?: number;
    className?: string;
}

const gradients = [
    "from-indigo-500 to-blue-500",
    "from-purple-500 to-pink-500",
    "from-cyan-500 to-blue-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-rose-500 to-pink-500",
    "from-violet-500 to-purple-500",
    "from-amber-500 to-orange-500",
];

const sizeClasses = {
    sm: "w-9 h-9 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-2xl",
};

/**
 * Renders a gradient circle with the user's initials
 */
export const AvatarIcon: React.FC<AvatarIconProps> = ({
    name,
    size = "md",
    colorIndex,
    className = "",
}) => {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const idx =
        colorIndex ??
        name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;

    return (
        <div
            className={`bg-gradient-to-br ${gradients[idx]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${sizeClasses[size]} ${className}`}
        >
            {initials}
        </div>
    );
};

interface ProjectIconProps {
    icon: LucideIcon;
    size?: "sm" | "md" | "lg";
    gradient?: string;
    className?: string;
}

const projectSizes = {
    sm: { container: "w-10 h-10", icon: 20 },
    md: { container: "w-14 h-14", icon: 28 },
    lg: { container: "w-16 h-16", icon: 32 },
};

/**
 * Renders a gradient-backed icon for project cards
 */
export const ProjectIcon: React.FC<ProjectIconProps> = ({
    icon: Icon,
    size = "md",
    gradient = "from-primary to-accent",
    className = "",
}) => {
    const s = projectSizes[size];
    return (
        <div
            className={`bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center ${s.container} ${className}`}
        >
            <Icon size={s.icon} className="text-white" />
        </div>
    );
};
