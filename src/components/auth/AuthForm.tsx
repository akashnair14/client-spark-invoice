
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import SocialButton from "./SocialButton";

// A modern, clean, animated, accessible login/register form
const AuthForm: React.FC = () => {
  const { user, login, signup, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(""); // register only
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // visually reset errors on tab switch
  const handleTabSwitch = (target: "login" | "register") => {
    setTab(target);
    setError(null);
    setEmail("");
    setPassword("");
    setConfirm("");
  };

  // Email/password auth
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
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Authentication error");
    }
  };

  // Social login (Google example only)
  const handleGoogleLogin = async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.auth.signInWithOAuth({ provider: "google" });
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
    <div className="min-h-screen flex flex-col items-center justify-center font-inter px-2 py-10">
      <Card className="w-full max-w-md p-7 sm:p-10 bg-white/5 dark:bg-white/10 border border-indigo-900/60 shadow-[0_10px_40px_0_rgba(0,24,72,0.38)] rounded-xl backdrop-blur-2xl animate-fade-in flex flex-col transition-all duration-500 select-none relative">
        {/* Toggle */}
        <div className="flex mb-8 justify-center gap-2 relative z-10">
          <button
            className={`px-5 py-2 rounded-full font-semibold focus-visible:ring-2 transition
              ${tab === "login"
                ? "bg-blue-700/90 text-white shadow shadow-blue-600/50"
                : "bg-transparent text-blue-200 hover:bg-blue-600/40"}`}
            onClick={() => handleTabSwitch("login")}
            aria-selected={tab === "login"}
            tabIndex={tab === "login" ? -1 : 0}
            type="button"
          >
            Login
          </button>
          <button
            className={`px-5 py-2 rounded-full font-semibold focus-visible:ring-2 transition
              ${tab === "register"
                ? "bg-blue-700/90 text-white shadow shadow-blue-600/50"
                : "bg-transparent text-blue-200 hover:bg-blue-600/40"}`}
            onClick={() => handleTabSwitch("register")}
            aria-selected={tab === "register"}
            tabIndex={tab === "register" ? -1 : 0}
            type="button"
          >
            Register
          </button>
        </div>
        {/* Animated Form Slide/Fade */}
        <div className="relative h-[245px] sm:h-[260px] transition-all duration-700">
          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="on"
            className={`absolute inset-0 w-full space-y-5 transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]
              ${tab === "login"
                ? "opacity-100 translate-x-0 z-10 pointer-events-auto"
                : "opacity-0 -translate-x-10 z-0 pointer-events-none"}`}
            style={{ transitionProperty: "opacity, transform" }}
            aria-hidden={tab !== "login"}
          >
            <Input
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
              type="email"
              spellCheck={false}
              className="text-base bg-zinc-900/70 dark:bg-zinc-900/70 border border-zinc-700 shadow-inner shadow-blue-900/20 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-500 transition w-full placeholder:text-blue-300/70 text-blue-100"
            />
            <div className="relative flex items-center">
              <Input
                placeholder="Password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                required
                minLength={6}
                className="pr-10 text-base bg-zinc-900/70 dark:bg-zinc-900/70 border border-zinc-700 shadow-inner shadow-blue-900/20 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-500 transition w-full placeholder:text-blue-300/70 text-blue-100"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-400 transition"
                tabIndex={0}
                aria-label={showPass ? "Hide password" : "Show password"}
                onClick={() => setShowPass(v => !v)}
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && <div className="text-red-400 text-sm mb-1 text-center">{error}</div>}
            <Button
              type="submit"
              className="w-full text-base gap-2 h-11 select-none transition-transform duration-150 hover:scale-105 font-semibold bg-gradient-to-r from-blue-700 via-indigo-500 to-cyan-500 text-white shadow-md shadow-blue-800/30"
              disabled={loading}
            >
              <LogIn className="w-5 h-5" /> Login
            </Button>
            <div className="flex justify-between text-blue-200/75 text-xs mt-2 mb-1">
              <button
                type="button"
                className="underline underline-offset-4 hover:text-blue-200 hover:font-medium transition"
                onClick={() => window.alert("Password reset flow not implemented (ask for support!)")}
              >
                Forgot password?
              </button>
              <span />
            </div>
          </form>
          {/* Register Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="on"
            className={`absolute inset-0 w-full space-y-5 transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]
              ${tab === "register"
                ? "opacity-100 translate-x-0 z-10 pointer-events-auto"
                : "opacity-0 translate-x-10 z-0 pointer-events-none"}`}
            style={{ transitionProperty: "opacity, transform" }}
            aria-hidden={tab !== "register"}
          >
            <Input
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
              type="email"
              spellCheck={false}
              className="text-base bg-zinc-900/70 dark:bg-zinc-900/70 border border-zinc-700 shadow-inner shadow-blue-900/20 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-500 transition w-full placeholder:text-blue-300/70 text-blue-100"
            />
            <div className="relative flex items-center">
              <Input
                placeholder="Password"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                required
                minLength={6}
                className="pr-10 text-base bg-zinc-900/70 dark:bg-zinc-900/70 border border-zinc-700 shadow-inner shadow-blue-900/20 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-500 transition w-full placeholder:text-blue-300/70 text-blue-100"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-400 transition"
                tabIndex={0}
                aria-label={showPass ? "Hide password" : "Show password"}
                onClick={() => setShowPass(v => !v)}
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="relative flex items-center">
              <Input
                placeholder="Confirm password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                disabled={loading}
                required
                minLength={6}
                className="pr-10 text-base bg-zinc-900/70 dark:bg-zinc-900/70 border border-zinc-700 shadow-inner shadow-blue-900/20 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-500 transition w-full placeholder:text-blue-300/70 text-blue-100"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-400 transition"
                tabIndex={0}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm(v => !v)}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && <div className="text-red-400 text-sm mb-1 text-center">{error}</div>}
            <Button
              type="submit"
              className="w-full text-base gap-2 h-11 select-none transition-transform duration-150 hover:scale-105 font-semibold bg-gradient-to-tr from-blue-700 via-indigo-700 to-cyan-500 text-white shadow-md shadow-blue-800/30"
              disabled={loading}
            >
              <UserPlus className="w-5 h-5" /> Register
            </Button>
          </form>
        </div>
        {/* OR divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
          <span className="mx-4 text-xs text-blue-200/70 font-inter">or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-blue-600/30 to-transparent" />
        </div>
        {/* Social login section (Google enabled) */}
        <SocialButton onClick={handleGoogleLogin} provider="google">
          <span className="flex items-center pt-[1px]">Sign in with Google</span>
        </SocialButton>
        <div className="mt-6 flex items-center justify-center text-sm text-zinc-400">
          <span>
            {tab === "login"
              ? "Don’t have an account?"
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
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs opacity-60 text-center font-inter text-blue-200/70">
          Powered by <span className="font-bold text-transparent bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text">Invoicer</span>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
