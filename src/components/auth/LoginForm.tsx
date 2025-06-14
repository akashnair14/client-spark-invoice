
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

interface LoginFormProps {
  email: string;
  password: string;
  showPass: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setShowPass: (v: boolean | ((prev: boolean) => boolean)) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onResendEmail: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  showPass,
  setEmail,
  setPassword,
  setShowPass,
  loading,
  error,
  onSubmit,
  onForgotPassword,
  onResendEmail
}) => (
  <form
    onSubmit={onSubmit}
    autoComplete="on"
    className="absolute inset-0 w-full space-y-6 transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)] opacity-100 translate-x-0 z-10 pointer-events-auto"
    style={{ transitionProperty: "opacity, transform" }}
  >
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/70 w-5 h-5"/>
      <Input
        placeholder="Email"
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={loading}
        required
        type="email"
        spellCheck={false}
        className="pl-10 text-base bg-zinc-900/80 dark:bg-zinc-900/80 border border-zinc-600 shadow-inner shadow-blue-900/20 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition w-full placeholder:text-blue-200/70 text-blue-100"
      />
    </div>
    <div className="relative flex items-center">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/70 w-5 h-5"/>
      <Input
        placeholder="Password"
        type={showPass ? "text" : "password"}
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
        required
        minLength={6}
        className="pl-10 pr-10 text-base bg-zinc-900/80 dark:bg-zinc-900/80 border border-zinc-600 shadow-inner shadow-blue-900/20 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition w-full placeholder:text-blue-200/70 text-blue-100"
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
    {error && <div className="text-red-400 text-sm mb-2 text-center">{error}</div>}
    <Button
      type="submit"
      className="w-full text-base gap-2 h-12 animate-fade-in select-none transition-transform hover:scale-105 font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 hover:brightness-110 shadow-md shadow-blue-800/30 border-none rounded-xl"
      disabled={loading}
    >
      <LogIn className="w-5 h-5 animate-fade-in" /> Log In
    </Button>
    <div className="flex justify-between items-center mt-2 animate-fade-in">
      <button
        type="button"
        className="underline underline-offset-4 hover:text-blue-200 hover:font-medium transition text-blue-300/80 text-xs"
        onClick={onForgotPassword}
      >
        Forgot password?
      </button>
      <button
        type="button"
        className="underline underline-offset-4 hover:text-blue-200 transition text-blue-400 text-xs ml-2"
        onClick={onResendEmail}
      >
        Didn&apos;t get the email? Resend
      </button>
    </div>
  </form>
);

export default LoginForm;
