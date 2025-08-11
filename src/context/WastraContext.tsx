import { createContext } from "react";

interface WastraContextType {
    user: string
}

export const WastraContext = createContext<WastraContextType | undefined>(undefined)