import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, UserPlus, Eye, EyeOff, Circle, Mail, Lock } from "lucide-react";
import SocialButton from "./SocialButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ConfirmEmailDialog from "./ConfirmEmailDialog";

// A modern, clean, animated, accessible login/register form
const AuthForm: React.FC = () => {
  const { user, login, signup, logout, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(""); // register only
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // New: Store registration credentials temporarily for dialog use
  const [lastRegisteredEmail, setLastRegisteredEmail] = useState<string>("");
  const [lastRegisteredPassword, setLastRegisteredPassword] = useState<string>("");

  // visually reset errors on tab switch
  const handleTabSwitch = (target: "login" | "register") => {
    setTab(target);
    setError(null);
    setEmail("");
    setPassword("");
    setConfirm("");
  };

  // Social login (Google example only)
  const handleGoogleLogin = async () => {
    // Import Supabase directly and signInWithOAuth (no await)
    const { supabase } = await import("@/integrations/supabase/client");
    // Open Google sign in in a new popup (default Supabase flow)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/",
      },
    });
  };

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
        // Store for potential later resends!
        setLastRegisteredEmail(email);
        setLastRegisteredPassword(password);
        setShowConfirmPopup(true); // Show popup dialog
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
      // Show popup on "Email not confirmed" error
      if (
        err &&
        typeof err.message === "string" &&
        err.message.toLowerCase().includes("email not confirmed")
      ) {
        // Allow user to trigger resend from login page too
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
    // Use registration credentials if available, otherwise fallback to login form values
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

  // Already logged in? Show summary + sign-out
  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-inter">
        <Card className="max-w-lg w-full p-8 bg-white/10 dark:bg-[#15172a]/80 shadow-2xl border-none backdrop-blur-lg animate-fade-in">
          <div className="flex flex-col items-center justify-center mb-5">
            <UserPlus className="w-10 h-10 text-blue-400 mb-2 drop-shadow animate-fade-in" />
            <div className="text-xl font-semibold text-white text-center">
              You are logged in as <b>{user.email}</b>
            </div>
          </div>
          <Button
            onClick={async () => {
              await logout();
              navigate("/auth");
            }}
            variant="secondary"
            className="w-full mt-4 bg-blue-700/80 text-white hover:bg-blue-500/90"
          >
            Sign out
          </Button>
        </Card>
      </div>
    );
  }

  // Main auth card UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent font-inter px-4 py-10 relative overflow-hidden">
      {/* -- Modal for confirm email step -- */}
      <ConfirmEmailDialog
        open={showConfirmPopup}
        onOpenChange={setShowConfirmPopup}
        resendLoading={resendLoading}
        onResend={handleResendConfirmation}
        onOk={() => setShowConfirmPopup(false)}
        lastRegisteredEmail={lastRegisteredEmail}
        email={email}
      />
      
      {/* --- Branded App Logo/Name with smooth transition --- */}
      <div className="mb-10 flex flex-col items-center space-y-3 animate-fade-in">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30 transform transition-transform duration-300 group-hover:scale-110">
            <LogIn className="text-primary-foreground w-8 h-8" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h1 className="font-bold text-3xl text-foreground tracking-tight transition-all duration-500">
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground text-sm transition-all duration-500">
            {tab === "login" ? "Sign in to continue to Invoicer" : "Get started with your free account"}
          </p>
        </div>
      </div>

      {/* Main Login/Register Card with glassmorphism */}
      <Card className="w-full max-w-md mx-auto p-8 bg-card/50 backdrop-blur-xl shadow-2xl border border-border/50 rounded-3xl mb-4 animate-scale-in hover:shadow-primary/10 transition-all duration-500">
        {/* Toggle Tabs with sliding indicator */}
        <div className="relative mb-8">
          <div className="flex gap-1 p-1 bg-muted/30 rounded-full backdrop-blur-sm">
            <button
              className={`relative flex-1 px-6 py-2.5 rounded-full font-semibold text-sm focus-visible:ring-2 focus-visible:ring-ring transition-all duration-300 ${
                tab === "login"
                  ? "text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => handleTabSwitch("login")}
              aria-selected={tab === "login"}
              type="button"
              disabled={loading}
            >
              {tab === "login" && (
                <span className="absolute inset-0 bg-primary rounded-full -z-10 animate-scale-in" />
              )}
              <span className="relative z-10">Login</span>
            </button>
            <button
              className={`relative flex-1 px-6 py-2.5 rounded-full font-semibold text-sm focus-visible:ring-2 focus-visible:ring-ring transition-all duration-300 ${
                tab === "register"
                  ? "text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => handleTabSwitch("register")}
              aria-selected={tab === "register"}
              type="button"
              disabled={loading}
            >
              {tab === "register" && (
                <span className="absolute inset-0 bg-primary rounded-full -z-10 animate-scale-in" />
              )}
              <span className="relative z-10">Register</span>
            </button>
          </div>
        </div>

        {/* Forms with smooth transition */}
        <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
          <div
            className={`transition-all duration-500 ease-in-out ${
              tab === "login"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
            }`}
          >
            <LoginForm
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
                window.alert("Password reset flow not implemented (ask for support!)")
              }
              onResendEmail={() => setShowConfirmPopup(true)}
            />
          </div>
          <div
            className={`transition-all duration-500 ease-in-out ${
              tab === "register"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
            }`}
          >
            <RegisterForm
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
          </div>
        </div>

        {/* Modern OR divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="mx-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-transparent" />
        </div>

        {/* Social login */}
        <SocialButton onClick={handleGoogleLogin} provider="google" className="w-full">
          Sign in with Google
        </SocialButton>

        {/* Switch login/register link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          </span>
          <button
            className="font-semibold text-primary hover:underline underline-offset-4 transition-all focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
            type="button"
            onClick={() => handleTabSwitch(tab === "login" ? "register" : "login")}
          >
            {tab === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </Card>

      {/* Footer branding */}
      <p className="text-xs text-muted-foreground/60 mt-4 animate-fade-in">
        Powered by <span className="font-semibold text-primary">Invoicer</span>
      </p>
    </div>
  );
};

export default AuthForm;
