import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getAuthToken, setAuthToken, removeAuthToken, getStoredUser, setStoredUser, removeStoredUser } from "@/config/api";
import type { User, AuthResponse } from "@/types/api";

export type AppRole = "admin" | "user" | null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<AppRole>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Check token expiry and refresh if needed
  const checkTokenExpiry = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setRole(null);
      return;
    }

    try {
      // Decode JWT to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      // If token expires in less than 5 minutes, try to refresh
      if (timeUntilExpiry < 5 * 60 * 1000) {
        try {
          const response = await apiRequest('/auth/refresh', {
            method: 'POST',
          });
          setAuthToken(response.token);
          setStoredUser(response.user);
          setUser(response.user);
          setRole(response.user.role || 'user');
        } catch (error) {
          // Refresh failed, logout
          removeAuthToken();
          removeStoredUser();
          setUser(null);
          setRole(null);
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          navigate('/');
        }
      }

      // If token is expired, logout
      if (timeUntilExpiry <= 0) {
        removeAuthToken();
        removeStoredUser();
        setUser(null);
        setRole(null);
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking token expiry:', error);
    }
  }, [navigate, toast]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);
        setRole(storedUser.role || 'user');
      }

      setLoading(false);
    };

    initAuth();

    // Set up interval to check token expiry every minute
    sessionCheckInterval.current = setInterval(checkTokenExpiry, 60000);

    return () => {
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
    };
  }, [checkTokenExpiry]);

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setAuthToken(response.token);
      setStoredUser(response.user);
      setUser(response.user);
      setRole(response.user.role || 'user');

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Login failed' } };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setAuthToken(response.token);
      setStoredUser(response.user);
      setUser(response.user);
      setRole(response.user.role || 'user');

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Signup failed' } };
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      removeStoredUser();
      setUser(null);
      setRole(null);
    }
  };

  return {
    user,
    loading,
    role,
    setRole,
    login,
    signup,
    logout,
  };
}
