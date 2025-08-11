import type { ReactNode } from "react"
import { WastraContext } from "./WastraContext"


interface WastraContextProviderProps {
    children: ReactNode;
}

export const WastraContextProvider = ({ children }: WastraContextProviderProps) => {

    const value = {
        user: "angga"
    }

    return (
        <WastraContext.Provider value={value} >
            {children}
        </WastraContext.Provider>
    )
}