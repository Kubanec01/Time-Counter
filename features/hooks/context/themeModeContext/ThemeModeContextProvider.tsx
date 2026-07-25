'use client'

import {createContext, Dispatch, ReactNode, SetStateAction, useState} from "react";
import {useLocalStorage} from "@/features/hooks/useStorage/useLocalStorage";
type ThemeMode = 'light' | 'dark'


type ThemeModeContext = {
    themeMode: ThemeMode;
    setThemeMode: Dispatch<SetStateAction<ThemeMode>>
    handleChangeThemeMode: () => void
}

export const themeModeContext = createContext<ThemeModeContext | undefined>(undefined);


const ThemeModeContextProvider = ({children}: {children: ReactNode}) => {
    const {getLocalStorage, setLocalStorage} = useLocalStorage()
    const themeKey = process.env.NEXT_PUBLIC_THEME_MODE_KEY as string

    const [themeMode, setThemeMode] = useState<ThemeMode>(getLocalStorage(themeKey, 'light'));

    const handleChangeThemeMode = () => {
        let updatedThemeMode: ThemeMode;

        if (themeMode === 'dark'){
            updatedThemeMode = 'light'
            document.documentElement.classList.remove('dark')
        }
        else {
            updatedThemeMode = 'dark'
            document.documentElement.classList.add('dark')
        }

        setThemeMode(updatedThemeMode)
        setLocalStorage(themeKey, updatedThemeMode)
    }

    return (
        <themeModeContext.Provider value={{themeMode, setThemeMode, handleChangeThemeMode}}>
            {children}
        </themeModeContext.Provider>
    )
}

export default ThemeModeContextProvider;