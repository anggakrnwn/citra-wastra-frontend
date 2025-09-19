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

export const WastraContextProvider = ({
  children,
}: WastraContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
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

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await authService.register(name, email, password);
      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
      return {
        success: false,
        message: "Registration failed: no token received",
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        type BackendError = { field: string; message: string };
        const detailedMessage = Array.isArray(data?.errors)
          ? (data.errors as BackendError[])
              .map((e) => `${e.field}: ${e.message}`)
              .join(", ")
          : data?.message;

        return {
          success: false,
          message: detailedMessage || "Registration failed",
        };
      }
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <WastraContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </WastraContext.Provider>
  );
};
