
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const AuthPage = () => {
  const { user, login, signup, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return (
      <Card className="max-w-lg mx-auto mt-12 p-6">
        <div className="mb-2">You are logged in as <b>{user.email}</b></div>
        <Button onClick={() => { logout(); navigate("/auth"); }}>Sign out</Button>
      </Card>
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
    <div className="max-w-lg mx-auto mt-12">
      <Card className="p-8">
        <h2 className="text-2xl mb-6">{isRegister ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
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
          />
          {error && <div className="text-red-500">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {isRegister ? "Register" : "Login"}
          </Button>
        </form>
        <Button
          variant="link"
          className="mt-2 w-full"
          type="button"
          onClick={() => setIsRegister(v => !v)}
        >
          {isRegister
            ? "Already have an account? Log in"
            : "No account? Register"}
        </Button>
      </Card>
    </div>
  );
};
export default AuthPage;
