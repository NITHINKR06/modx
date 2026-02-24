import React, { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import {
    Upload,
    X,
    Plus,
    Image as ImageIcon,
    Github,
    Globe,
    Tag,
    Users,
    FileText,
    Sparkles,
} from "lucide-react";

interface TeamMember {
    name: string;
    role: string;
}

const UploadProject: React.FC = () => {
    const [title, setTitle] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [detailedDesc, setDetailedDesc] = useState("");
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        { name: "", role: "" },
    ]);
    const [technologies, setTechnologies] = useState<string[]>([]);
    const [techInput, setTechInput] = useState("");
    const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
    const [githubLink, setGithubLink] = useState("");
    const [demoLink, setDemoLink] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Team member handlers
    const addTeamMember = () => {
        setTeamMembers([...teamMembers, { name: "", role: "" }]);
    };

    const removeTeamMember = (idx: number) => {
        setTeamMembers(teamMembers.filter((_, i) => i !== idx));
    };

    const updateTeamMember = (
        idx: number,
        field: keyof TeamMember,
        value: string
    ) => {
        const updated = [...teamMembers];
        updated[idx][field] = value;
        setTeamMembers(updated);
    };

    // Technology tags
    const addTech = () => {
        const tag = techInput.trim();
        if (tag && !technologies.includes(tag)) {
            setTechnologies([...technologies, tag]);
            setTechInput("");
        }
    };

    const removeTech = (tag: string) => {
        setTechnologies(technologies.filter((t) => t !== tag));
    };

    const handleTechKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTech();
        }
    };

    // Image upload
    const handleImageUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files) return;
            const newImages = Array.from(files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setImages((prev) => [...prev, ...newImages]);
        },
        []
    );

    const removeImage = (idx: number) => {
        URL.revokeObjectURL(images[idx].preview);
        setImages(images.filter((_, i) => i !== idx));
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 1500));
        setSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[600px]">
                    <TiltCard variant="glass" className="p-12 text-center max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-400/40">
                            <Sparkles size={40} className="text-green-400" />
                        </div>
                        <h2 className="text-3xl font-black text-foreground mb-3">
                            Project Submitted!
                        </h2>
                        <p className="text-foreground/70 mb-8">
                            Your project "{title}" has been submitted for review. You'll be
                            notified once it's approved.
                        </p>
                        <MagneticButton
                            variant="primary"
                            size="lg"
                            onClick={() => {
                                setSubmitted(false);
                                setTitle("");
                                setShortDesc("");
                                setDetailedDesc("");
                                setTeamMembers([{ name: "", role: "" }]);
                                setTechnologies([]);
                                setImages([]);
                                setGithubLink("");
                                setDemoLink("");
                            }}
                        >
                            Submit Another Project
                        </MagneticButton>
                    </TiltCard>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="reveal">
                    <h1 className="text-4xl font-black text-foreground mb-2">
                        Upload Project
                    </h1>
                    <p className="text-foreground/70">
                        Share your innovation with the MODX community
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section 1: Basic Info */}
                    <TiltCard variant="glass" className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                <FileText size={20} className="text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">
                                Project Details
                            </h2>
                        </div>

                        <div className="space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                    Project Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., AI Learning Platform"
                                    className="w-full px-4 py-3.5 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300"
                                />
                            </div>

                            {/* Short Description */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                    Short Description *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={shortDesc}
                                    onChange={(e) => setShortDesc(e.target.value)}
                                    placeholder="A one-line summary of your project"
                                    maxLength={120}
                                    className="w-full px-4 py-3.5 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300"
                                />
                                <p className="text-xs text-foreground/40 mt-1">
                                    {shortDesc.length}/120 characters
                                </p>
                            </div>

                            {/* Detailed Description */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                    Detailed Description *
                                </label>
                                <textarea
                                    required
                                    value={detailedDesc}
                                    onChange={(e) => setDetailedDesc(e.target.value)}
                                    placeholder="Describe your project in detail — its purpose, technology, and impact..."
                                    rows={6}
                                    className="w-full px-4 py-3.5 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300 resize-none"
                                />
                            </div>
                        </div>
                    </TiltCard>

                    {/* Section 2: Team Members */}
                    <TiltCard variant="glass" className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <Users size={20} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">
                                    Team Members
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={addTeamMember}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-primary border border-primary/30 hover:bg-primary/10 transition-all duration-300"
                            >
                                <Plus size={16} /> Add Member
                            </button>
                        </div>

                        <div className="space-y-4">
                            {teamMembers.map((member, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={member.name}
                                            onChange={(e) =>
                                                updateTeamMember(idx, "name", e.target.value)
                                            }
                                            placeholder="Full name"
                                            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300 text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={member.role}
                                            onChange={(e) =>
                                                updateTeamMember(idx, "role", e.target.value)
                                            }
                                            placeholder="Role (e.g., Frontend Dev)"
                                            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300 text-sm"
                                        />
                                    </div>
                                    {teamMembers.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTeamMember(idx)}
                                            className="p-2.5 rounded-lg text-foreground/40 hover:text-red-500 hover:bg-red-50 transition-all duration-300 flex-shrink-0 mt-0.5"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </TiltCard>

                    {/* Section 3: Technologies */}
                    <TiltCard variant="glass" className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <Tag size={20} className="text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">
                                Technologies Used
                            </h2>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={handleTechKeyDown}
                                placeholder="Type a technology and press Enter"
                                className="flex-1 px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300 text-sm"
                            />
                            <button
                                type="button"
                                onClick={addTech}
                                className="px-4 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                            >
                                Add
                            </button>
                        </div>

                        {technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium group"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeTech(tech)}
                                            className="opacity-50 group-hover:opacity-100 hover:text-red-500 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </TiltCard>

                    {/* Section 4: Images */}
                    <TiltCard variant="glass" className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <ImageIcon size={20} className="text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">
                                Project Images
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="relative aspect-video rounded-xl overflow-hidden border border-border group"
                                >
                                    <img
                                        src={img.preview}
                                        alt={`Preview ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-red-500/50 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Upload dropzone */}
                            <label className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                                <Upload
                                    size={24}
                                    className="text-foreground/30 group-hover:text-primary transition-colors mb-1"
                                />
                                <span className="text-xs text-foreground/40 group-hover:text-primary/70 transition-colors">
                                    Upload
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-xs text-foreground/40">
                            Upload screenshots, diagrams, or demo images (PNG, JPG, WebP)
                        </p>
                    </TiltCard>

                    {/* Section 5: Links */}
                    <TiltCard variant="glass" className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <Globe size={20} className="text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">
                                Links (Optional)
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                    GitHub Repository
                                </label>
                                <div className="relative">
                                    <Github
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                                    />
                                    <input
                                        type="url"
                                        value={githubLink}
                                        onChange={(e) => setGithubLink(e.target.value)}
                                        placeholder="https://github.com/..."
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                    Live Demo
                                </label>
                                <div className="relative">
                                    <Globe
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                                    />
                                    <input
                                        type="url"
                                        value={demoLink}
                                        onChange={(e) => setDemoLink(e.target.value)}
                                        placeholder="https://your-demo.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </TiltCard>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <MagneticButton variant="outline" size="lg" type="button">
                            Save as Draft
                        </MagneticButton>
                        <button
                            type="submit"
                            disabled={submitting || !title || !shortDesc || !detailedDesc}
                            className="px-8 py-4 rounded-lg font-bold text-lg text-white bg-gradient-to-r from-primary to-blue-600 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                    </svg>
                                    Submitting…
                                </>
                            ) : (
                                <>
                                    <Upload size={20} /> Submit Project
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default UploadProject;
