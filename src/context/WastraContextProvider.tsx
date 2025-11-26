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

  const loginWithGoogle = async (): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        resolve({ success: false, message: "Google Client ID not configured" });
        return;
      }

      // Initialize Google OAuth client
      const initializeGoogleAuth = () => {
        if (window.google) {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'email profile',
            callback: async (tokenResponse: any) => {
              try {
                if (!tokenResponse?.access_token) {
                  resolve({ success: false, message: "Failed to get access token from Google" });
                  return;
                }

                const userInfoResponse = await fetch(
                  `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
                );
                
                if (!userInfoResponse.ok) {
                  resolve({ 
                    success: false, 
                    message: `Failed to get user info from Google: ${userInfoResponse.status}` 
                  });
                  return;
                }
                
                const userInfo = await userInfoResponse.json();
                
                if (!userInfo.email) {
                  resolve({ success: false, message: "Email not provided by Google" });
                  return;
                }
                
                const apiResponse = await authService.googleAuth(
                  tokenResponse.access_token,
                  userInfo.name || "",
                  userInfo.email || "",
                  userInfo.picture || undefined
                );
                
                const { token: newToken, user: backendUser } = apiResponse.data;

                if (newToken && backendUser) {
                  const userWithRole = { ...backendUser, role: backendUser.role ?? "user" };
                  localStorage.setItem("token", newToken);
                  localStorage.setItem("user", JSON.stringify(userWithRole));

                  setToken(newToken);
                  setUser(userWithRole);
                  resolve({ success: true });
                } else {
                  resolve({ success: false, message: "Google login failed: no token received" });
                }
              } catch (error: unknown) {
                if (error instanceof AxiosError) {
                  resolve({
                    success: false,
                    message: error.response?.data?.message || error.message || "Google login failed",
                  });
                } else if (error instanceof Error) {
                  resolve({ success: false, message: error.message });
                } else {
                  resolve({ success: false, message: "Google login failed" });
                }
              }
            },
          });
          
          try {
            client.requestAccessToken();
          } catch (error: any) {
            resolve({ success: false, message: `Failed to request access token: ${error.message}` });
          }
        } else {
          resolve({ success: false, message: "Failed to load Google Sign-In library" });
        }
      };

      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript && window.google) {
        // Script already loaded, initialize directly
        initializeGoogleAuth();
        return;
      }

      // Load Google Identity Services script
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initializeGoogleAuth();
      };
      
      script.onerror = () => {
        resolve({ success: false, message: "Failed to load Google Sign-In script. Check your internet connection." });
      };
      
      document.head.appendChild(script);
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <WastraContext.Provider value={{ user, loading, token, login, register, loginWithGoogle, logout }}>
      {children}
    </WastraContext.Provider>
  );
};
