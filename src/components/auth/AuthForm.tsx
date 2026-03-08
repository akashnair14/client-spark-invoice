import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ConfirmEmailDialog from "./ConfirmEmailDialog";

const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

const AuthForm: React.FC = () => {
  const { user, login, signup, logout, loading, resetPassword } = useAuth();
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
        <Card className="max-w-lg w-full p-8 bg-card/50 backdrop-blur-xl shadow-2xl border border-border/50 rounded-3xl">
          <div className="flex flex-col items-center justify-center mb-5">
            <UserPlus className="w-10 h-10 text-primary mb-2" />
            <div className="text-xl font-semibold text-foreground text-center">
              Logged in as <b className="text-primary">{user.email}</b>
            </div>
          </div>
          <Button onClick={async () => { await logout(); navigate("/"); }} variant="secondary" className="w-full mt-4">
            Sign out
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 py-12 w-full max-w-full overflow-hidden">
      <ConfirmEmailDialog
        open={showConfirmPopup}
        onOpenChange={setShowConfirmPopup}
        resendLoading={resendLoading}
        onResend={handleResendConfirmation}
        onOk={() => setShowConfirmPopup(false)}
        lastRegisteredEmail={lastRegisteredEmail}
        email={email}
      />

      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className="mb-8 flex flex-col items-center space-y-4">
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center shadow-2xl shadow-primary/40"
          >
            <Sparkles className="text-primary-foreground w-10 h-10" />
          </motion.div>
        </div>
        <div className="text-center space-y-2">
          <h1 className="font-bold text-4xl text-foreground tracking-tight">
            Spark<span className="text-primary">Invoice</span>
          </h1>
          <AnimatePresence mode="wait">
            <motion.h2 key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} className="font-semibold text-2xl text-foreground">
              {tab === "login" ? "Welcome Back" : "Create Account"}
            </motion.h2>
          </AnimatePresence>
          <p className="text-muted-foreground text-sm max-w-md">
            {tab === "login" ? "Sign in to manage your invoices" : "Start creating professional invoices"}
          </p>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }} className="w-full max-w-md mx-auto">
        <Card className="p-6 sm:p-8 bg-card/80 backdrop-blur-xl shadow-2xl border border-border/50 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          
          {/* Tabs */}
          <div className="relative mb-8 z-10">
            <div className="flex gap-1 p-1.5 bg-muted/50 rounded-2xl border border-border/50">
              {(["login", "register"] as const).map((t) => (
                <motion.button key={t} whileTap={{ scale: 0.98 }}
                  className={`relative flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    tab === t ? "text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => handleTabSwitch(t)} type="button" disabled={submitting}
                  aria-selected={tab === t} role="tab"
                >
                  <AnimatePresence>
                    {tab === t && (
                      <motion.span layoutId="activeTab" className="absolute inset-0 bg-primary rounded-xl shadow-lg -z-10"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                    )}
                  </AnimatePresence>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {t === "login" ? <><LogIn className="w-4 h-4" /> Login</> : <><UserPlus className="w-4 h-4" /> Register</>}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <LoginForm key="login" email={email} password={password} showPass={showPass}
                setEmail={setEmail} setPassword={setPassword} setShowPass={setShowPass}
                loading={submitting} error={error} onSubmit={handleSubmit}
                onForgotPassword={handleForgotPassword}
                onResendEmail={() => setShowConfirmPopup(true)} />
            ) : (
              <RegisterForm key="register" email={email} password={password} confirm={confirm}
                showPass={showPass} showConfirm={showConfirm}
                setEmail={setEmail} setPassword={setPassword} setConfirm={setConfirm}
                setShowPass={setShowPass} setShowConfirm={setShowConfirm}
                loading={submitting} error={error} onSubmit={handleSubmit} />
            )}
          </AnimatePresence>

          {/* Switch */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            </span>
            <button className="font-semibold text-primary hover:underline" type="button"
              onClick={() => handleTabSwitch(tab === "login" ? "register" : "login")}>
              {tab === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </Card>
      </motion.div>

      <p className="text-xs text-muted-foreground/60 mt-6 text-center">
        Secure authentication powered by <span className="font-semibold text-primary">SparkInvoice</span>
      </p>
    </div>
  );
};

export default AuthForm;
