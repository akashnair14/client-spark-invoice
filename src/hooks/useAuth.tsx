
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

// User role support
export type AppRole = "admin" | "user" | null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<AppRole>(null);

  const fetchRole = useCallback(async (uid?: string) => {
    if (!uid) {
      setRole(null);
      return;
    }
    // Get role from Supabase user_roles
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .maybeSingle();
    setRole((data?.role as AppRole) || "user");
  }, []);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchRole(session.user.id), 0);
      } else {
        setRole(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
    }).finally(() => setLoading(false));

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchRole]);

  // Login
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await fetchRole(supabase.auth.getUser()?.data?.user?.id);
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setSession(null);
  };

  // Signup: assign user role "user"
  const signup = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` }
    });
    if (error) throw error;
    // After signup, store role (ignore for now: needs extra role assignment UI)
    return data;
  };

  return { user, session, loading, login, signup, logout, role, setRole };
}
