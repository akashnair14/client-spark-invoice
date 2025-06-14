
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, UserPlus, LogIn } from "lucide-react";

const gradientBg =
  "bg-gradient-to-br from-blue-200/40 via-white/60 to-indigo-100/80 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-950";

const AuthPage = () => {
  const { user, login, signup, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${gradientBg}`}>
        <Card className="max-w-lg w-full p-8 shadow-2xl border-none bg-white/90 dark:bg-black/70 backdrop-blur-lg animate-fade-in">
          <div className="flex flex-col items-center justify-center mb-4">
            <UserPlus className="w-10 h-10 text-blue-600 dark:text-indigo-400 mb-2" />
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
    <div className={`min-h-screen flex flex-col items-center justify-center ${gradientBg}`}>
      <Card className="w-full max-w-lg sm:p-10 p-6 shadow-2xl border-none bg-white/70 dark:bg-zinc-900/75 backdrop-blur-xl animate-fade-in relative">
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-full bg-blue-100 dark:bg-indigo-900 p-4 mb-3 shadow ring-2 ring-blue-300 dark:ring-indigo-800">
            <Lock className="w-8 h-8 text-blue-600 dark:text-indigo-300" />
          </div>
          <h2 className="text-3xl font-semibold mb-1 tracking-tight">
            {isRegister ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center text-base">
            {isRegister
              ? "Sign up to manage your clients with Invoicer"
              : "Log in to your Invoicer dashboard"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="you@email.com"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
            type="email"
            className="bg-white/60 dark:bg-zinc-800/80 border border-gray-300 dark:border-zinc-800"
          />
          <Input
            placeholder="Password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
            minLength={6}
            className="bg-white/60 dark:bg-zinc-800/80 border border-gray-300 dark:border-zinc-800"
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <Button
            type="submit"
            className="w-full text-base gap-2 h-11 transition-transform duration-150 hover:scale-105"
            disabled={loading}
          >
            {isRegister ? (
              <>
                <UserPlus className="w-5 h-5" /> Register
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" /> Login
              </>
            )}
          </Button>
        </form>
        <div className="mt-6 flex items-center justify-center">
          <span className="text-muted-foreground mr-2 text-sm">
            {isRegister ? "Already have an account?" : "No account yet?"}
          </span>
          <Button
            variant="link"
            type="button"
            className="text-blue-700 dark:text-indigo-300 text-sm underline-offset-4"
            onClick={() => setIsRegister(v => !v)}
          >
            {isRegister ? "Log in" : "Register"}
          </Button>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground text-center opacity-80">
          Powered by <span className="font-bold text-blue-500">Invoicer</span>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
