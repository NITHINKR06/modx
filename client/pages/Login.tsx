import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Zap } from "lucide-react";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animReady, setAnimReady] = useState(false);
  const mousePos = useMousePosition();
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, user } = useAuth();

  useEffect(() => {
    setTimeout(() => setAnimReady(true), 50);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      const msg =
        err?.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : err?.message || "Sign in failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-background dark:bg-slate-950">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      <div className="absolute inset-0 tech-grid opacity-20" />

      {/* Cursor spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, rgba(62,87,223,0.12), transparent 80%)`,
          transition: "background 0.1s ease-out",
        }}
      />

      {/* Floating shapes */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-blue-400/20 rounded-full filter blur-3xl shape-float-1" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full filter blur-3xl shape-float-2" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-400/15 rounded-full filter blur-3xl shape-float-3" />

      {/* Card */}
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-foreground mb-2">Welcome back</h1>
            <p className="text-foreground/60">Sign in to your MODX account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground/80 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                />
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground/80">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:text-accent transition-colors duration-300 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground placeholder-foreground/30 transition-all duration-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${rememberMe
                    ? "bg-primary border-primary"
                    : "border-border hover:border-primary/60"
                  }`}
              >
                {rememberMe && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-foreground/70">Remember me for 30 days</span>
            </div>

            {/* Submit */}
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
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Zap size={18} /> Sign In
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-foreground/40 font-medium">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground/70 hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-sm font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-foreground/60 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-accent font-semibold transition-colors duration-300"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-foreground/50 hover:text-foreground transition-colors duration-300"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
