import {useContext} from "react";
import {successCodeContext} from "@/features/hooks/context/successCodeContext/successCodeContext";


export const useSuccessCodeContext = () => {
    const context = useContext(successCodeContext)
    if (!context) throw new Error("useSuccessCodeContext must be used within a SuccessCodeContextProvider")
    return context
};