import { useEffect, useState, type ReactNode } from "react";
import { WastraContext } from "./WastraContext";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../services/firebase";

interface WastraContextProviderProps {
  children: ReactNode;
}

export const WastraContextProvider = ({ children }: WastraContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <WastraContext.Provider value={{ user, loading }}>
      {children}
    </WastraContext.Provider>
  );
};
