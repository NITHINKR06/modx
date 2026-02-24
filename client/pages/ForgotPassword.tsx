import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [animReady, setAnimReady] = useState(false);
    const mousePos = useMousePosition();
    const { resetPassword } = useAuth();

    useEffect(() => {
        setTimeout(() => setAnimReady(true), 50);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await resetPassword(email);
            setSent(true);
        } catch (err: any) {
            const msg =
                err?.code === "auth/user-not-found"
                    ? "No account found with this email"
                    : err?.message || "Failed to send reset email";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-background dark:bg-slate-950">
            <div className="absolute inset-0 mesh-gradient opacity-40" />
            <div className="absolute inset-0 tech-grid opacity-20" />

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, rgba(62,87,223,0.12), transparent 80%)`,
                    transition: "background 0.1s ease-out",
                }}
            />

            <div className="absolute top-10 left-1/4 w-80 h-80 bg-cyan-400/20 rounded-full filter blur-3xl shape-float-1" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl shape-float-2" />

            <div
                className={`relative z-10 w-full max-w-md mx-4 transition-all duration-700 ${animReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center glow-soft">
                        <span className="font-black text-white text-xl">M</span>
                    </div>
                    <span className="font-black text-2xl text-foreground">MODX</span>
                </div>

                <div className="glass-premium rounded-2xl p-8 glow-soft">
                    {!sent ? (
                        <>
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/30">
                                    <Mail size={32} className="text-primary" />
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-black text-foreground mb-2">Forgot password?</h1>
                                <p className="text-foreground/60 text-sm leading-relaxed">
                                    No worries. Enter your email and we'll send you reset instructions.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@modx.club"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300 text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 relative overflow-hidden magnetic-btn disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Sending…
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Send size={18} /> Send Reset Link
                                        </span>
                                    )}
                                </button>
                            </form>

                            <div className="flex items-center justify-center mt-6">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors duration-300"
                                >
                                    <ArrowLeft size={16} /> Back to sign in
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* Success state */
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full flex items-center justify-center border-2 border-green-400/40">
                                    <svg
                                        className="w-10 h-10 text-green-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                        style={{ animation: "fade-in-up 0.5s ease-out" }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-foreground mb-3">Check your inbox!</h2>
                            <p className="text-foreground/60 text-sm mb-2 leading-relaxed">
                                We sent a password reset link to
                            </p>
                            <p className="font-semibold text-primary mb-6 text-sm">{email}</p>
                            <p className="text-xs text-foreground/40 mb-8 leading-relaxed">
                                Didn't receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setSent(false)}
                                    className="text-primary hover:text-accent transition-colors font-medium underline underline-offset-2"
                                >
                                    try again
                                </button>
                            </p>

                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <ArrowLeft size={16} /> Back to sign in
                            </Link>
                        </div>
                    )}
                </div>

                <div className="text-center mt-6">
                    <Link to="/" className="text-sm text-foreground/50 hover:text-foreground transition-colors duration-300">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
