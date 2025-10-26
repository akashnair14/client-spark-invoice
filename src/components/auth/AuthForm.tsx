import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Sparkles } from "lucide-react";
import SocialButton from "./SocialButton";
import { useToast } from "@/components/ui/use-toast";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ConfirmEmailDialog from "./ConfirmEmailDialog";

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A highly animated, modern, accessible login/register form
const AuthForm: React.FC = () => {
  const { user, login, signup, logout, loading } = useAuth();
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

  const [lastRegisteredEmail, setLastRegisteredEmail] = useState<string>("");
  const [lastRegisteredPassword, setLastRegisteredPassword] = useState<string>("");

  // Handle tab switch with smooth transition
  const handleTabSwitch = (target: "login" | "register") => {
    setTab(target);
    setError(null);
    setEmail("");
    setPassword("");
    setConfirm("");
  };

  // Social login - Removed (to be implemented in .NET Core backend)

  // Email/password auth + confirmation state
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tab === "register" && password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      if (tab === "register") {
        await signup(email, password);
        setLastRegisteredEmail(email);
        setLastRegisteredPassword(password);
        setShowConfirmPopup(true);
        setTab("login");
        setEmail("");
        setPassword("");
        setConfirm("");
        return;
      } else {
        await login(email, password);
        navigate("/dashboard");
      }
    } catch (err: any) {
      if (
        err &&
        typeof err.message === "string" &&
        err.message.toLowerCase().includes("email not confirmed")
      ) {
        if (email && password) {
          setLastRegisteredEmail(email);
          setLastRegisteredPassword(password);
        }
        setShowConfirmPopup(true);
        setError(null);
      } else {
        setError(err.message || "Authentication error");
      }
    }
  };

  // Resend confirmation email handler
  const handleResendConfirmation = async () => {
    setResendLoading(true);
    setError(null);
    const targetEmail = lastRegisteredEmail || email;
    const targetPassword = lastRegisteredPassword || password;

    if (!targetEmail || !targetPassword) {
      toast({
        title: "Missing information",
        description: "Please register again to resend confirmation email.",
        variant: "destructive"
      });
      setResendLoading(false);
      return;
    }

    try {
      await signup(targetEmail, targetPassword);
      toast({
        title: "Confirmation email resent",
        description: "Please check your inbox (and spam).",
      });
    } catch (err: any) {
      toast({
        title: "Failed to resend",
        description: err.message || "Could not resend confirmation email.",
        variant: "destructive"
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Already logged in view
  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center font-inter"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Card className="max-w-lg w-full p-8 bg-card/50 backdrop-blur-xl shadow-2xl border border-border/50 rounded-3xl">
            <div className="flex flex-col items-center justify-center mb-5">
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <UserPlus className="w-10 h-10 text-primary mb-2" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-semibold text-foreground text-center"
              >
                Logged in as <b className="text-primary">{user.email}</b>
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
                variant="secondary"
                className="w-full mt-4"
              >
                Sign out
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  // Main auth card UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent font-inter px-4 py-12 w-full max-w-full overflow-hidden">
      {/* Confirmation Email Dialog */}
      <ConfirmEmailDialog
        open={showConfirmPopup}
        onOpenChange={setShowConfirmPopup}
        resendLoading={resendLoading}
        onResend={handleResendConfirmation}
        onOk={() => setShowConfirmPopup(false)}
        lastRegisteredEmail={lastRegisteredEmail}
        email={email}
      />
      
      {/* Animated Logo/Brand */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 flex flex-col items-center space-y-4"
      >
        <div className="relative group">
          <motion.div
            animate={{
              scale: prefersReducedMotion ? 1 : [1, 1.05, 1],
              rotate: prefersReducedMotion ? 0 : [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500"
          />
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center shadow-2xl shadow-primary/40 ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
          >
            <Sparkles className="text-primary-foreground w-10 h-10" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h1 className="font-bold text-4xl text-foreground tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            SparkInvoice
          </h1>
          <AnimatePresence mode="wait">
            <motion.h2
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="font-semibold text-2xl text-foreground tracking-tight"
            >
              {tab === "login" ? "Welcome Back" : "Create Account"}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${tab}-desc`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-muted-foreground text-sm max-w-md"
            >
              {tab === "login" 
                ? "Sign in to manage your invoices and grow your business" 
                : "Start creating professional invoices in minutes"}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="p-8 bg-card/80 backdrop-blur-xl shadow-2xl border border-border/50 rounded-3xl mb-4 hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          {/* Tab Switcher with sliding indicator */}
          <div className="relative mb-8 z-10">
            <div className="flex gap-1 p-1.5 bg-muted/50 rounded-2xl backdrop-blur-sm border border-border/50 shadow-inner">
              <motion.button
                whileHover={{ scale: tab === "login" ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex-1 px-6 py-3 rounded-xl font-semibold text-sm focus-visible:ring-2 focus-visible:ring-ring transition-all duration-300 ${
                  tab === "login"
                    ? "text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => handleTabSwitch("login")}
                aria-selected={tab === "login"}
                type="button"
                disabled={loading}
              >
                <AnimatePresence>
                  {tab === "login" && (
                    <motion.span
                      layoutId="activeTab"
                      initial={false}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg -z-10"
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: tab === "register" ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex-1 px-6 py-3 rounded-xl font-semibold text-sm focus-visible:ring-2 focus-visible:ring-ring transition-all duration-300 ${
                  tab === "register"
                    ? "text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => handleTabSwitch("register")}
                aria-selected={tab === "register"}
                type="button"
                disabled={loading}
              >
                <AnimatePresence>
                  {tab === "register" && (
                    <motion.span
                      layoutId="activeTab"
                      initial={false}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg -z-10"
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Register
                </span>
              </motion.button>
            </div>
          </div>

          {/* Forms with AnimatePresence for smooth transitions */}
          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <LoginForm
                key="login-form"
                email={email}
                password={password}
                showPass={showPass}
                setEmail={setEmail}
                setPassword={setPassword}
                setShowPass={setShowPass}
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
                onForgotPassword={() =>
                  window.alert("Password reset flow not implemented")
                }
                onResendEmail={() => setShowConfirmPopup(true)}
              />
            ) : (
              <RegisterForm
                key="register-form"
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
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
              />
            )}
          </AnimatePresence>

          {/* Social login removed - will be implemented in .NET Core backend */}

          {/* Switch link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="mt-6 text-center text-sm"
          >
            <span className="text-muted-foreground">
              {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-semibold text-primary hover:underline underline-offset-4 transition-all focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
              type="button"
              onClick={() => handleTabSwitch(tab === "login" ? "register" : "login")}
            >
              {tab === "login" ? "Sign up" : "Sign in"}
            </motion.button>
          </motion.div>
        </Card>
      </motion.div>

      {/* Footer branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-center mt-6 space-y-2"
      >
        <p className="text-xs text-muted-foreground/60">
          Secure authentication powered by <span className="font-semibold text-primary">SparkInvoice</span>
        </p>
        <p className="text-xs text-muted-foreground/40">
          Your data is encrypted and protected
        </p>
      </motion.div>
    </div>
  );
};

export default AuthForm;
