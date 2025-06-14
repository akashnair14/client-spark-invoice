
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, UserPlus, LogIn } from "lucide-react";

// Custom animated gradient background
const GradientBackground = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-fuchsia-400 via-indigo-400 to-blue-400 opacity-70 animate-gradient-rotate" />
    <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-indigo-100/80 to-fuchsia-50 dark:from-zinc-900/50 dark:via-indigo-950/80 dark:to-fuchsia-950/60" />
    <style>
      {`
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .animate-gradient-rotate {
          animation: gradient-rotate 8s linear infinite;
        }
      `}
    </style>
  </div>
);

const AuthPage = () => {
  const { user, login, signup, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return (
      <>
        <GradientBackground />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Card className="max-w-lg w-full p-8 shadow-2xl border-none bg-white/80 dark:bg-black/70 backdrop-blur-xl animate-fade-in">
            <div className="flex flex-col items-center justify-center mb-4">
              <UserPlus className="w-10 h-10 text-fuchsia-600 dark:text-indigo-400 mb-2" />
              <div className="text-xl font-semibold text-gray-800 dark:text-gray-50 text-center">
                You are logged in as <b>{user.email}</b>
              </div>
            </div>
            <Button
              onClick={() => {
                logout();
                navigate("/auth");
              }}
              variant="secondary"
              className="w-full mt-4"
            >
              Sign out
            </Button>
          </Card>
        </div>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Authentication error");
    }
  };

  return (
    <>
      <GradientBackground />
      <div className="min-h-screen flex flex-col items-center justify-center relative z-0">
        <Card className="w-full max-w-lg sm:p-12 p-6 shadow-2xl border-none bg-white/50 dark:bg-zinc-900/70 backdrop-blur-2xl animate-fade-in relative transition-all duration-500 ring-1 ring-white/40 dark:ring-zinc-800/60">
          <div className="flex flex-col items-center mb-8">
            <div className="rounded-full bg-gradient-to-tr from-fuchsia-500 via-indigo-600 to-blue-500 p-5 mb-3 shadow-lg ring-4 ring-indigo-200 dark:ring-indigo-900 animate-fade-in">
              <Lock className="w-8 h-8 text-white drop-shadow" />
            </div>
            <h2 className="text-3xl font-bold mb-1 tracking-tight bg-gradient-to-l from-fuchsia-600 via-indigo-700 to-blue-700 bg-clip-text text-transparent drop-shadow">
              {isRegister ? "Create an Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center text-base">
              {isRegister
                ? "Sign up to manage your clients with Invoicer"
                : "Log in to your Invoicer dashboard"}
            </p>
          </div>
          {/* Animated form transition */}
          <div className="relative h-[160px] sm:h-[136px] transition-all duration-500">
            <form
              onSubmit={handleSubmit}
              className={`absolute inset-0 w-full space-y-4 transition-all duration-500 ease-in-out
                ${isRegister ? "opacity-0 scale-95 pointer-events-none z-0" : "opacity-100 scale-100 z-10"}`}
              style={{ transitionProperty: "opacity, transform" }}
            >
              <Input
                placeholder="you@email.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                required
                type="email"
                className="bg-white/70 dark:bg-zinc-800/80 border border-gray-300 dark:border-zinc-700 text-base"
              />
              <Input
                placeholder="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                required
                minLength={6}
                className="bg-white/70 dark:bg-zinc-800/80 border border-gray-300 dark:border-zinc-700 text-base"
              />
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button
                type="submit"
                className="w-full text-base gap-2 h-11 transition-transform duration-150 hover:scale-105 font-semibold bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-blue-500 text-white shadow-sm"
                disabled={loading}
              >
                <LogIn className="w-5 h-5" /> Login
              </Button>
            </form>
            <form
              onSubmit={handleSubmit}
              className={`absolute inset-0 w-full space-y-4 transition-all duration-500 ease-in-out
                ${isRegister ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none z-0"}`}
              style={{ transitionProperty: "opacity, transform" }}
            >
              <Input
                placeholder="you@email.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                required
                type="email"
                className="bg-white/70 dark:bg-zinc-800/80 border border-gray-300 dark:border-zinc-700 text-base"
              />
              <Input
                placeholder="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                required
                minLength={6}
                className="bg-white/70 dark:bg-zinc-800/80 border border-gray-300 dark:border-zinc-700 text-base"
              />
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button
                type="submit"
                className="w-full text-base gap-2 h-11 transition-transform duration-150 hover:scale-105 font-semibold bg-gradient-to-tr from-fuchsia-600 via-indigo-600 to-blue-600 text-white shadow-sm"
                disabled={loading}
              >
                <UserPlus className="w-5 h-5" /> Register
              </Button>
            </form>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <span className="text-muted-foreground mr-2 text-sm">
              {isRegister ? "Already have an account?" : "No account yet?"}
            </span>
            <Button
              variant="link"
              type="button"
              className="text-fuchsia-700 dark:text-indigo-300 text-sm underline-offset-4 font-semibold hover:scale-105 transition-transform"
              onClick={() => {
                setError(null);
                setIsRegister(v => !v);
              }}
            >
              {isRegister ? "Log in" : "Register"}
            </Button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground text-center opacity-80">
            Powered by <span className="font-bold bg-gradient-to-r from-fuchsia-600 to-blue-500 bg-clip-text text-transparent">Invoicer</span>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AuthPage;
