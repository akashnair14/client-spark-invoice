
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// User role support
export type AppRole = "admin" | "user" | null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<AppRole>(null);
  const { toast } = useToast();
  const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null);

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

  // Check if session is expired
  const checkSessionExpiry = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession) {
      // Session no longer exists
      if (user) {
        setUser(null);
        setSession(null);
        setRole(null);
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
      }
      return;
    }

    // Check if session is about to expire (within 5 minutes)
    const expiresAt = currentSession.expires_at;
    if (expiresAt) {
      const expiryTime = expiresAt * 1000; // Convert to milliseconds
      const timeUntilExpiry = expiryTime - Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
        // Try to refresh the session
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
          console.error("Failed to refresh session:", error);
        } else if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } else if (timeUntilExpiry <= 0) {
        // Session expired
        setUser(null);
        setSession(null);
        setRole(null);
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
      }
    }
  }, [user, toast]);

  useEffect(() => {
    // Supabase v2 returns { data: { subscription } }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        setRole(null);
        if (sessionCheckInterval.current) {
          clearInterval(sessionCheckInterval.current);
          sessionCheckInterval.current = null;
        }
      }
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed successfully');
      }
      
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

    // Check session expiry every minute
    sessionCheckInterval.current = setInterval(() => {
      checkSessionExpiry();
    }, 60 * 1000);

    return () => {
      subscription.unsubscribe();
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
    };
  }, [fetchRole, checkSessionExpiry]);

  // Login
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // After login, fetch user, then grab role
    const { data } = await supabase.auth.getUser();
    const uid = data?.user?.id;
    await fetchRole(uid);
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
    // After signup, role assignment would require admin/manual step
    return data;
  };

  return { user, session, loading, login, signup, logout, role, setRole };
}
