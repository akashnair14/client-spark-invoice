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
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent font-inter px-2 py-10">
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
      {/* --- Branded App Logo/Name --- */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-700 to-cyan-400 flex items-center justify-center shadow-lg mb-2 animate-[fade-in_0.6s]">
          <LogIn className="text-white w-8 h-8" />
        </div>
        <h1 className="font-bold text-[2rem] text-white tracking-wide drop-shadow-lg mb-1 animate-fade-in">{tab === "login" ? "Welcome Back" : "Create Your Account"}</h1>
        <span className="text-blue-100 text-md opacity-70">{tab === "login" ? "Log in to your account" : "Create your account"}</span>
      </div>
      {/* Main Login/Register Card */}
      <Card className="w-full max-w-sm mx-auto p-8 bg-white/10 shadow-xl border-none backdrop-blur-2xl rounded-2xl mb-4 animate-fade-in transition-all duration-500">
        {/* Toggle Tabs */}
        <div className="flex mb-7 justify-center gap-2 relative z-10">
          <button
            className={`px-6 py-2 rounded-full font-semibold focus-visible:ring-2 transition
              ${tab === "login"
                ? "bg-blue-600 text-white shadow shadow-blue-600/40"
                : "bg-transparent text-blue-200 hover:bg-blue-600/30"}`}
            onClick={() => handleTabSwitch("login")}
            aria-selected={tab === "login"}
            tabIndex={tab === "login" ? -1 : 0}
            type="button"
            disabled={loading}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold focus-visible:ring-2 transition
              ${tab === "register"
                ? "bg-blue-600 text-white shadow shadow-blue-600/40"
                : "bg-transparent text-blue-200 hover:bg-blue-600/30"}`}
            onClick={() => handleTabSwitch("register")}
            aria-selected={tab === "register"}
            tabIndex={tab === "register" ? -1 : 0}
            type="button"
            disabled={loading}
          >
            Register
          </button>
        </div>
        {/* --- LOGIN FORM --- */}
        <div className="relative h-[265px] sm:h-[260px] transition-all duration-700">
          {tab === "login" && (
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
          )}
          {tab === "register" && (
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
          )}
        </div>
        {/* OR divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent" />
          <span className="mx-3 text-xs text-blue-200/80 font-medium">or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-blue-700/40 to-transparent" />
        </div>
        {/* Social login */}
        <SocialButton onClick={handleGoogleLogin} provider="google" className="animate-fade-in">
          <span className="flex items-center pt-[1px]">Sign in with Google</span>
        </SocialButton>
        {/* Switch login/register */}
        <div className="mt-5 flex items-center justify-center text-sm text-zinc-400">
          <span>
            {tab === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
          </span>
          <button
            className="ml-1 font-medium underline underline-offset-4 text-blue-300 hover:text-blue-200 transition focus-visible:ring-2"
            type="button"
            onClick={() => handleTabSwitch(tab === "login" ? "register" : "login")}
          >
            {tab === "login" ? "Register" : "Log in"}
          </button>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs opacity-70 text-center font-inter text-blue-200/80 mt-5">
          Powered by<span className="font-bold text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text ml-1">Invoicer</span>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
