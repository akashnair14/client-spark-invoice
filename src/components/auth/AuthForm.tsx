import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Sparkles, Zap, Shield, BarChart3, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { lovable } from "@/integrations/lovable/index";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ConfirmEmailDialog from "./ConfirmEmailDialog";

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "Generate professional invoices in seconds" },
  { icon: Shield, title: "Secure & Reliable", desc: "Bank-grade encryption for your data" },
  { icon: BarChart3, title: "Smart Analytics", desc: "Track payments and revenue at a glance" },
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
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result?.error) {
        toast({ title: "Google Sign In Failed", description: String(result.error), variant: "destructive" });
      }
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
        if (password !== confirm) {
          setError("Passwords do not match");
          setSubmitting(false);
          return;
        }
        const result = await signup(email, password);
        if (result?.error) {
          setError(result.error.message);
          setSubmitting(false);
          return;
        }
        setLastRegisteredEmail(email);
        setLastRegisteredPassword(password);
        setShowConfirmPopup(true);
        setTab("login");
        setEmail("");
        setPassword("");
        setConfirm("");
      } else {
        const result = await login(email, password);
        if (result?.error) {
          if (result.error.message.toLowerCase().includes("email not confirmed")) {
            setLastRegisteredEmail(email);
            setLastRegisteredPassword(password);
            setShowConfirmPopup(true);
            setError(null);
          } else {
            setError(result.error.message);
          }
          setSubmitting(false);
          return;
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
    if (!email) {
      toast({
        title: "Enter your email",
        description: "Please enter your email address first, then click forgot password.",
        variant: "destructive",
      });
      return;
    }
    try {
      const result = await resetPassword(email);
      if (result?.error) {
        toast({ title: "Error", description: result.error.message, variant: "destructive" });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Check your inbox for a password reset link.",
        });
      }
    } catch {
      toast({ title: "Error", description: "Failed to send reset email.", variant: "destructive" });
    }
  };

  const handleResendConfirmation = async () => {
    setResendLoading(true);
    const targetEmail = lastRegisteredEmail || email;
    const targetPassword = lastRegisteredPassword || password;
    if (!targetEmail || !targetPassword) {
      toast({ title: "Missing info", description: "Please register again.", variant: "destructive" });
      setResendLoading(false);
      return;
    }
    try {
      await signup(targetEmail, targetPassword);
      toast({ title: "Confirmation email resent", description: "Check your inbox." });
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally {
      setResendLoading(false);
    }
  };

  // Already logged in
  if (user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-lg w-full p-8 glass shadow-elevated-lg rounded-2xl">
          <div className="flex flex-col items-center justify-center mb-5">
            <UserPlus className="w-10 h-10 text-primary mb-2" />
            <div className="text-xl font-semibold text-foreground text-center">
              Logged in as <b className="text-primary">{user.email}</b>
            </div>
          </div>
          <Button onClick={async () => { await logout(); navigate("/"); }} variant="secondary" className="w-full mt-4">
            Sign out
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-transparent px-4 w-full overflow-hidden">
      <ConfirmEmailDialog
        open={showConfirmPopup}
        onOpenChange={setShowConfirmPopup}
        resendLoading={resendLoading}
        onResend={handleResendConfirmation}
        onOk={() => setShowConfirmPopup(false)}
        lastRegisteredEmail={lastRegisteredEmail}
        email={email}
      />

      {/* Wide horizontal card — 75% on desktop */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[90%] lg:max-w-[75%] xl:max-w-[70%] mx-auto"
      >
        <div className="rounded-3xl border border-border/40 bg-card/80 backdrop-blur-xl shadow-elevated-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[560px]">

            {/* Left Panel — Branding (hidden on mobile) */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="hidden lg:flex lg:col-span-2 flex-col justify-between p-10 xl:p-12 relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
            >
              {/* Decorative elements */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary/8 rounded-full blur-[60px]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.05)_1px,transparent_1px)] bg-[size:2rem_2rem]" />

              <div className="relative z-10 space-y-8">
                {/* Logo */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
                    <Sparkles className="text-primary-foreground w-6 h-6" />
                  </div>
                  <h1 className="font-bold text-2xl text-foreground tracking-tight">
                    Spark<span className="text-primary">Invoice</span>
                  </h1>
                </motion.div>

                {/* Tagline */}
                <div className="space-y-3 pt-4">
                  <h2 className="font-display text-3xl xl:text-4xl font-bold text-foreground leading-tight tracking-tight">
                    Professional invoicing,{" "}
                    <span className="text-primary">simplified.</span>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                    Create, manage, and track invoices effortlessly. Built for freelancers, agencies, and growing businesses.
                  </p>
                </div>
              </div>

              {/* Feature list */}
              <div className="relative z-10 space-y-5 pt-6">
                {features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.12 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <f.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="relative z-10 text-xs text-muted-foreground/40 pt-6">
                © {new Date().getFullYear()} SparkInvoice. All rights reserved.
              </p>
            </motion.div>

            {/* Right Panel — Form */}
            <div className="lg:col-span-3 flex flex-col justify-center p-6 sm:p-10 xl:p-14">
              {/* Mobile logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:hidden flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
                  <Sparkles className="text-primary-foreground w-5 h-5" />
                </div>
                <h1 className="font-bold text-xl text-foreground tracking-tight">
                  Spark<span className="text-primary">Invoice</span>
                </h1>
              </motion.div>

              {/* Header */}
              <div className="mb-8 space-y-1.5">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={tab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
                  >
                    {tab === "login" ? "Welcome back" : "Get started"}
                  </motion.h2>
                </AnimatePresence>
                <p className="text-muted-foreground text-sm">
                  {tab === "login"
                    ? "Sign in to your account to continue"
                    : "Create a free account to start invoicing"}
                </p>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex gap-1 p-1 bg-muted rounded-xl border border-border/30 w-full sm:w-auto sm:inline-flex">
                  {(["login", "register"] as const).map((t) => (
                    <button
                      key={t}
                      className={`relative flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        tab === t
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
                      }`}
                      onClick={() => handleTabSwitch(t)}
                      type="button"
                      disabled={submitting}
                      aria-selected={tab === t}
                      role="tab"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {t === "login" ? (
                          <>
                            <LogIn className="w-4 h-4" /> Sign In
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" /> Register
                          </>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="max-w-md">
                <AnimatePresence mode="wait">
                  {tab === "login" ? (
                    <LoginForm
                      key="login"
                      email={email}
                      password={password}
                      showPass={showPass}
                      setEmail={setEmail}
                      setPassword={setPassword}
                      setShowPass={setShowPass}
                      loading={submitting}
                      error={error}
                      onSubmit={handleSubmit}
                      onForgotPassword={handleForgotPassword}
                      onResendEmail={() => setShowConfirmPopup(true)}
                    />
                  ) : (
                    <RegisterForm
                      key="register"
                      email={email}
                      password={password}
                      confirm={confirm}
                      showPass={showPass}
                      showConfirm={showConfirm}
                      setEmail={setEmail}
                      setPassword={setPassword}
                      setConfirm={setConfirm}
                      setShowPass={setShowPass}
                      setShowConfirm={setShowConfirm}
                      loading={submitting}
                      error={error}
                      onSubmit={handleSubmit}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="max-w-md flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {/* Google Sign In */}
              <div className="max-w-md">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl font-semibold text-sm gap-3 border-border/60 hover:bg-muted/50 transition-all"
                  disabled={submitting || googleLoading}
                  onClick={handleGoogleSignIn}
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Continue with Google
                </Button>
              </div>

              {/* Switch link */}
              <div className="mt-6 text-sm">
                <span className="text-muted-foreground">
                  {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                </span>
                <button
                  className="font-semibold text-primary hover:underline underline-offset-4"
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
