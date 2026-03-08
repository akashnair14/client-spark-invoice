import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Zap, Shield, BarChart3 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { lovable } from "@/integrations/lovable/index";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ConfirmEmailDialog from "./ConfirmEmailDialog";

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "Create invoices in seconds" },
  { icon: Shield, title: "Secure & Reliable", desc: "Bank-grade encryption" },
  { icon: BarChart3, title: "Smart Analytics", desc: "Track payments effortlessly" },
];

const AuthForm: React.FC = () => {
  const { user, login, signup, logout, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastRegisteredEmail, setLastRegisteredEmail] = useState("");
  const [lastRegisteredPassword, setLastRegisteredPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result?.error) toast({ title: "Google Sign In Failed", description: String(result.error), variant: "destructive" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Google sign in failed", variant: "destructive" });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleTabSwitch = (target: "login" | "register") => {
    setTab(target);
    setError(null);
    setEmail("");
    setPassword("");
    setConfirm("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (tab === "register") {
        if (password !== confirm) { setError("Passwords do not match"); setSubmitting(false); return; }
        const result = await signup(email, password);
        if (result?.error) { setError(result.error.message); setSubmitting(false); return; }
        setLastRegisteredEmail(email);
        setLastRegisteredPassword(password);
        setShowConfirmPopup(true);
        setTab("login");
        setEmail(""); setPassword(""); setConfirm("");
      } else {
        const result = await login(email, password);
        if (result?.error) {
          if (result.error.message.toLowerCase().includes("email not confirmed")) {
            setLastRegisteredEmail(email); setLastRegisteredPassword(password);
            setShowConfirmPopup(true); setError(null);
          } else setError(result.error.message);
          setSubmitting(false); return;
        }
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Authentication error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { toast({ title: "Enter your email", description: "Please enter your email address first.", variant: "destructive" }); return; }
    try {
      const result = await resetPassword(email);
      if (result?.error) toast({ title: "Error", description: result.error.message, variant: "destructive" });
      else toast({ title: "Password reset email sent", description: "Check your inbox for a password reset link." });
    } catch {
      toast({ title: "Error", description: "Failed to send reset email.", variant: "destructive" });
    }
  };

  const handleResendConfirmation = async () => {
    setResendLoading(true);
    const targetEmail = lastRegisteredEmail || email;
    const targetPassword = lastRegisteredPassword || password;
    if (!targetEmail || !targetPassword) { toast({ title: "Missing info", description: "Please register again.", variant: "destructive" }); setResendLoading(false); return; }
    try {
      await signup(targetEmail, targetPassword);
      toast({ title: "Confirmation email resent", description: "Check your inbox." });
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally {
      setResendLoading(false);
    }
  };

  if (user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col items-center justify-center">
        <div className="max-w-lg w-full p-8 rounded-2xl" style={{ background: "rgba(20,20,30,0.55)", backdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex flex-col items-center justify-center mb-5">
            <Sparkles className="w-10 h-10 text-[#FF8A00] mb-2" />
            <div className="text-xl font-semibold text-white text-center">
              Logged in as <b className="text-[#FF8A00]">{user.email}</b>
            </div>
          </div>
          <Button onClick={async () => { await logout(); navigate("/"); }} variant="outline" className="w-full mt-4 border-white/10 text-white hover:bg-white/5">
            Sign out
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden relative">
      <ConfirmEmailDialog
        open={showConfirmPopup}
        onOpenChange={setShowConfirmPopup}
        resendLoading={resendLoading}
        onResend={handleResendConfirmation}
        onOk={() => setShowConfirmPopup(false)}
        lastRegisteredEmail={lastRegisteredEmail}
        email={email}
      />

      {/* Main card - 80% of viewport */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1200px] relative"
        style={{ height: "min(88vh, 750px)" }}
      >
        {/* Outer glow */}
        <div
          className="absolute -inset-2 rounded-[30px] opacity-30 blur-2xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(255,138,0,0.2) 0%, transparent 70%)" }}
        />

        <div
          className="relative w-full h-full rounded-[24px] overflow-hidden grid grid-cols-1 lg:grid-cols-2"
          style={{
            background: "rgba(14,16,26,0.7)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(255,138,0,0.04)",
          }}
        >
          {/* ─── LEFT: Branding Panel ─── */}
          <div className="hidden lg:flex flex-col justify-between p-8 xl:p-10 relative overflow-visible min-h-0">
            {/* Background accent */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
                style={{ background: "radial-gradient(circle, #FF8A00 0%, transparent 70%)" }}
              />
              <div
                className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
                style={{ background: "radial-gradient(circle, #FFB347 0%, transparent 70%)" }}
              />
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            {/* Top content */}
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center gap-3 mb-10"
              >
                <motion.div
                  animate={{ boxShadow: ["0 0 15px rgba(255,138,0,0.2)", "0 0 30px rgba(255,138,0,0.4)", "0 0 15px rgba(255,138,0,0.2)"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)" }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Spark<span className="text-[#FF8A00]">Invoice</span>
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
                  Professional invoicing,{" "}
                  <span className="bg-gradient-to-r from-[#FF8A00] to-[#FFB347] bg-clip-text text-transparent">
                    simplified
                  </span>
                </h2>
                <p className="text-white/40 text-base leading-relaxed max-w-sm">
                  Create beautiful invoices, track payments, and manage your business finances — all in one place.
                </p>
              </motion.div>
            </div>

            {/* Features */}
            <div className="relative z-10 space-y-2">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                  className="flex items-center gap-2.5 group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: "rgba(255,138,0,0.1)", border: "1px solid rgba(255,138,0,0.15)" }}
                  >
                    <f.icon className="w-4 h-4 text-[#FF8A00]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/80">{f.title}</div>
                    <div className="text-xs text-white/35">{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── RIGHT: Form Panel ─── */}
          <div className="flex flex-col h-full relative min-h-0">
            {/* Separator line on desktop */}
            <div className="hidden lg:block absolute left-0 top-8 bottom-8 w-px bg-white/[0.06]" />

            <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-6 overflow-y-auto scrollbar-hide min-h-0">
              {/* Mobile logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex lg:hidden items-center gap-2.5 mb-8 justify-center"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)" }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  Spark<span className="text-[#FF8A00]">Invoice</span>
                </span>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-8"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">
                      {tab === "login" ? "Welcome back" : "Get started"}
                    </h1>
                    <p className="text-sm text-white/35">
                      {tab === "login"
                        ? "Sign in to your account to continue"
                        : "Create your free account today"}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Toggle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-6"
              >
                <div
                  className="relative flex rounded-xl p-1"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <motion.div
                    className="absolute top-1 bottom-1 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
                      boxShadow: "0 4px 15px rgba(255,138,0,0.25)",
                    }}
                    animate={{ left: tab === "login" ? "4px" : "50%", width: "calc(50% - 4px)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                  {(["login", "register"] as const).map((t) => (
                    <button
                      key={t}
                      className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                        tab === t ? "text-white" : "text-white/40 hover:text-white/60"
                      }`}
                      onClick={() => handleTabSwitch(t)}
                      type="button"
                      disabled={submitting}
                    >
                      {t === "login" ? "Sign In" : "Sign Up"}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Form with smooth transition */}
              <AnimatePresence mode="wait">
                {tab === "login" ? (
                  <LoginForm
                    key="login"
                    email={email} password={password} showPass={showPass}
                    setEmail={setEmail} setPassword={setPassword} setShowPass={setShowPass}
                    loading={submitting} error={error} onSubmit={handleSubmit}
                    onForgotPassword={handleForgotPassword}
                    onResendEmail={() => setShowConfirmPopup(true)}
                  />
                ) : (
                  <RegisterForm
                    key="register"
                    email={email} password={password} confirm={confirm}
                    showPass={showPass} showConfirm={showConfirm}
                    setEmail={setEmail} setPassword={setPassword} setConfirm={setConfirm}
                    setShowPass={setShowPass} setShowConfirm={setShowConfirm}
                    loading={submitting} error={error} onSubmit={handleSubmit}
                  />
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[11px] text-white/25 uppercase tracking-widest font-medium">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Google */}
              <motion.div whileHover={{ scale: 1.015, y: -1 }} whileTap={{ scale: 0.985 }}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 rounded-xl font-semibold text-sm gap-3 text-white/70 hover:text-white transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  disabled={submitting || googleLoading}
                  onClick={handleGoogleSignIn}
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Continue with Google
                </Button>
              </motion.div>

              {/* Switch */}
              <div className="mt-5 text-center text-sm">
                <span className="text-white/30">
                  {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                </span>
                <button
                  className="font-semibold text-[#FF8A00] hover:text-[#FFB347] transition-colors"
                  type="button"
                  onClick={() => handleTabSwitch(tab === "login" ? "register" : "login")}
                >
                  {tab === "login" ? "Sign up" : "Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
