import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, getStoredToken, setStoredToken } from "@/lib/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const readStoredUser = () => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem("manggrow_user");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [initializing, setInitializing] = useState(true);

  const persistSession = (nextToken: string | null, nextUser: AuthUser | null) => {
    setToken(nextToken);
    setStoredToken(nextToken);
    if (typeof window !== "undefined") {
      if (nextUser) {
        setUser(nextUser);
        window.localStorage.setItem("manggrow_user", JSON.stringify(nextUser));
      } else {
        setUser(null);
        window.localStorage.removeItem("manggrow_user");
      }
    } else {
      setUser(nextUser);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: { email, password }
    });
    persistSession(data.token, data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: AuthUser }>("/auth/register", {
      method: "POST",
      body: { name, email, password }
    });
    persistSession(data.token, data.user);
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // ignore logout errors
    }
    persistSession(null, null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    const data = await apiFetch<{ user: AuthUser }>("/auth/me");
    persistSession(token, data.user);
  };

  useEffect(() => {
    if (!token) {
      setInitializing(false);
      return;
    }
    refreshProfile()
      .catch(() => persistSession(null, null))
      .finally(() => setInitializing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    initializing,
    login,
    register,
    logout,
    refreshProfile
  }), [user, token, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};
