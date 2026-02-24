import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Rocket } from "lucide-react";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Register: React.FC = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [animReady, setAnimReady] = useState(false);
    const [pwdStrength, setPwdStrength] = useState(0);
    const mousePos = useMousePosition();
    const navigate = useNavigate();
    const { signUp, user } = useAuth();

    useEffect(() => {
        setTimeout(() => setAnimReady(true), 50);
    }, []);

    // Redirect if already logged in
    useEffect(() => {
        if (user) navigate("/dashboard", { replace: true });
    }, [user, navigate]);

    useEffect(() => {
        const p = form.password;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        setPwdStrength(s);
    }, [form.password]);

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
    const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-400"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirm) return;
        if (!agreed) return;
        setLoading(true);
        try {
            await signUp(form.email, form.password, form.name);
            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (err: any) {
            const msg =
                err?.code === "auth/email-already-in-use"
                    ? "This email is already registered"
                    : err?.code === "auth/weak-password"
                        ? "Password must be at least 6 characters"
                        : err?.message || "Registration failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const passwordsMatch = form.confirm === "" || form.password === form.confirm;

    return (
        <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-background dark:bg-slate-950 py-8">
            <div className="absolute inset-0 mesh-gradient opacity-40" />
            <div className="absolute inset-0 tech-grid opacity-20" />

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, rgba(62,87,223,0.12), transparent 80%)`,
                    transition: "background 0.1s ease-out",
                }}
            />

            <div className="absolute top-10 right-10 w-80 h-80 bg-purple-400/20 rounded-full filter blur-3xl shape-float-1" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl shape-float-2" />
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyan-400/15 rounded-full filter blur-3xl shape-float-3" />

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
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-foreground mb-2">Join MODX</h1>
                        <p className="text-foreground/60">Create your innovator account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Alex Kumar"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300 text-sm"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground/80 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@modx.club"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300 text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground/80 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                                <input
                                    name="password"
                                    type={showPwd ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300 text-sm"
                                />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors">
                                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {/* Strength bar */}
                            {form.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwdStrength ? strengthColor[pwdStrength] : "bg-border"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-foreground/50 font-medium">{strengthLabel[pwdStrength]}</p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground/80 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                                <input
                                    name="confirm"
                                    type={showConfirm ? "text" : "password"}
                                    required
                                    value={form.confirm}
                                    onChange={handleChange}
                                    placeholder="Repeat your password"
                                    className={`w-full pl-11 pr-12 py-3.5 rounded-xl bg-background/60 border outline-none text-foreground placeholder-foreground/30 transition-all duration-300 text-sm ${passwordsMatch
                                        ? "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        : "border-red-400 focus:ring-2 focus:ring-red-400/20"
                                        }`}
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors">
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {!passwordsMatch && (
                                <p className="text-xs text-red-400 mt-1">Passwords don't match</p>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <button
                                type="button"
                                onClick={() => setAgreed(!agreed)}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${agreed ? "bg-primary border-primary" : "border-border hover:border-primary/60"
                                    }`}
                            >
                                {agreed && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                            <span className="text-sm text-foreground/70 leading-relaxed">
                                I agree to the{" "}
                                <a href="#" className="text-primary hover:text-accent transition-colors font-medium">Terms of Service</a>{" "}
                                and{" "}
                                <a href="#" className="text-primary hover:text-accent transition-colors font-medium">Privacy Policy</a>
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !agreed || !passwordsMatch}
                            className="w-full py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 relative overflow-hidden magnetic-btn disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Creating account…
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Rocket size={18} /> Create Account
                                </span>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-foreground/60 text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:text-accent font-semibold transition-colors duration-300">
                            Sign in
                        </Link>
                    </p>
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

export default Register;
