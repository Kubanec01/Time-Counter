'use client'

import {useContext} from "react";
import {themeModeContext} from "@/features/hooks/context/themeModeContext/ThemeModeContextProvider";


export const useThemeModeContext = () => {
    const context = useContext(themeModeContext)
    if (!context) throw new Error("useThemeModeContext must be used within a ThemeModeContextProvider")
    return context
};