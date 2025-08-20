// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { AuthResponse } from "../types/auth";

type UserShape = { name: string; email: string; role: "ADMIN" | "CUSTOMER" };

type AuthContextType = {
  user: UserShape | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<UserShape | null>(() => {
    const role = localStorage.getItem("role") as UserShape["role"] | null;
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    return role && name && email ? { role, name, email } : null;
  });

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      setUser({ role: data.role, name: data.name, email: data.email });
      return true;
    } catch (e: any) {
      setError(e?.response?.data?.message || "Login failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<AuthResponse>("/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      setUser({ role: data.role, name: data.name, email: data.email });
      return true;
    } catch (e: any) {
      setError(e?.response?.data?.message || "Registration failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, error, login, register, logout }),
    [user, loading, error]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
