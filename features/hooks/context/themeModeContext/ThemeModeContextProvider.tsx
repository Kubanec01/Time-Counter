'use client'

import {createContext, Dispatch, ReactNode, SetStateAction, useState} from "react";
import {getLocalThemeMode, setLocalThemeMode, ThemeMode} from "@/features/local/localThemeMode";



type ThemeModeContext = {
    themeMode: ThemeMode;
    setThemeMode: Dispatch<SetStateAction<ThemeMode>>
    handleChangeThemeMode: () => void
}

export const themeModeContext = createContext<ThemeModeContext | undefined>(undefined);


const ThemeModeContextProvider = ({children}: {children: ReactNode}) => {

    const [themeMode, setThemeMode] = useState<ThemeMode>(getLocalThemeMode());

    const handleChangeThemeMode = () => {
        let updatedThemeMode: ThemeMode;

        if (themeMode === 'dark')
            updatedThemeMode = 'light'
        else updatedThemeMode = 'dark';

        setThemeMode(updatedThemeMode)
        setLocalThemeMode(updatedThemeMode)
    }

    return (
        <themeModeContext.Provider value={{themeMode, setThemeMode, handleChangeThemeMode}}>
            {children}
        </themeModeContext.Provider>
    )
}

export default ThemeModeContextProvider;