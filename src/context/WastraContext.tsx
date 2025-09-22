import { createContext, useContext } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface WastraContextType {
  user: User | null;
  loading: boolean;
  token: string | null; 
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export const WastraContext = createContext<WastraContextType | undefined>(undefined);

export const useWastra = (): WastraContextType => {
  const context = useContext(WastraContext);
  if (!context) {
    throw new Error("useWastra must be used within WastraContextProvider");
  }
  return context;
};