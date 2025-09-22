import { useEffect, useState, type ReactNode } from "react";
import { WastraContext, type User } from "./WastraContext";
import { authService } from "../services/api";
import { AxiosError } from "axios";

interface WastraContextProviderProps {
  children: ReactNode;
}

interface AuthResponse {
  success: boolean;
  message?: string;
}

export const WastraContextProvider = ({ children }: WastraContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (!parsed.role) parsed.role = "user";
        setUser(parsed);
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authService.login(email, password);
      const { token: newToken, user } = response.data;

      if (newToken && user) {
        const userWithRole = { ...user, role: user.role ?? "user" };
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userWithRole));

        setToken(newToken);
        setUser(userWithRole);
        return { success: true };
      }
      return { success: false, message: "Login failed: no token received" };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          message: error.response?.data?.message || "Login failed",
        };
      }
      return { success: false, message: "Login failed" };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authService.register(name, email, password);
      const { token: newToken, user } = response.data;

      if (newToken && user) {
        const userWithRole = { ...user, role: user.role ?? "user" };
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userWithRole));

        setToken(newToken);
        setUser(userWithRole);
        return { success: true };
      }
      return { success: false, message: "Registration failed: no token received" };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 429) {
          return { success: false, message: "Too many requests, please wait a moment" };
        }
        const data = error.response?.data;
        const detailedMessage = Array.isArray(data?.errors)
          ? (data.errors as { message: string }[]).map((e) => e.message).join(", ")
          : data?.message;

        return { success: false, message: detailedMessage || "Registration failed" };
      }
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <WastraContext.Provider value={{ user, loading, token, login, register, logout }}>
      {children}
    </WastraContext.Provider>
  );
};
