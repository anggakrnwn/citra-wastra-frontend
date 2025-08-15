import { createContext, useContext } from "react";
import { type User } from "firebase/auth";

interface WastraContextType {
  user: User | null;
  loading: boolean;
}

export const WastraContext = createContext<WastraContextType | undefined>(undefined);

export const useWastra = (): WastraContextType => {
  const context = useContext(WastraContext);
  if (!context) {
    throw new Error("useWastra must be used within WastraContextProvider");
  }
  return context;
};
