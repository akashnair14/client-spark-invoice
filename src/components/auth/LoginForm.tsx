
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
    className="space-y-5 w-full"
  >
    <div className="space-y-4">
      <div className="relative group">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-4 h-4 transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Email address"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          required
          type="email"
          spellCheck={false}
          className="pl-10 h-11 bg-background/50 border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all rounded-xl placeholder:text-muted-foreground/60"
        />
      </div>
      
      <div className="relative group">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-4 h-4 transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Password"
          type={showPass ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          required
          minLength={6}
          className="pl-10 pr-11 h-11 bg-background/50 border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all rounded-xl placeholder:text-muted-foreground/60"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          tabIndex={0}
          aria-label={showPass ? "Hide password" : "Show password"}
          onClick={() => setShowPass(v => !v)}
        >
          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>

    {error && (
      <div className="text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-scale-in">
        {error}
      </div>
    )}

    <Button
      type="submit"
      className="w-full h-11 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 rounded-xl"
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="animate-pulse">Signing in...</span>
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </>
      )}
    </Button>

    <div className="flex justify-between items-center text-xs pt-1">
      <button
        type="button"
        className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
        onClick={onForgotPassword}
      >
        Forgot password?
      </button>
      <button
        type="button"
        className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
        onClick={onResendEmail}
      >
        Resend verification
      </button>
    </div>
  </form>
);

export default LoginForm;
