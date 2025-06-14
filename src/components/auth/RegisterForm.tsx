
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, UserPlus } from "lucide-react";

interface RegisterFormProps {
  email: string;
  password: string;
  confirm: string;
  showPass: boolean;
  showConfirm: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setConfirm: (v: string) => void;
  setShowPass: (v: boolean | ((prev: boolean) => boolean)) => void;
  setShowConfirm: (v: boolean | ((prev: boolean) => boolean)) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  email,
  password,
  confirm,
  showPass,
  showConfirm,
  setEmail,
  setPassword,
  setConfirm,
  setShowPass,
  setShowConfirm,
  loading,
  error,
  onSubmit
}) => (
  <form
    onSubmit={onSubmit}
    autoComplete="on"
    className="absolute inset-0 w-full space-y-5 transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)] opacity-100 translate-x-0 z-10 pointer-events-auto"
    style={{ transitionProperty: "opacity, transform" }}
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
);

export default RegisterForm;
