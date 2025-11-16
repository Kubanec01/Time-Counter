'use client'

import React, {createContext, useContext, useState} from "react";

interface CountContext {
    isClocktimeRunning: boolean;
    setIsClocktimeRunning: React.Dispatch<React.SetStateAction<boolean>>
    activeClockTimeSectionId: string;
    setActiveClockTimeSectionId: React.Dispatch<React.SetStateAction<string>>;
}

const clockTimeContext = createContext<CountContext | undefined>(undefined)

export const ClockTimeContextProvider = ({children}: { children: React.ReactNode }) => {

    const [isClocktimeRunning, setIsClocktimeRunning] = useState(false);
    const [activeClockTimeSectionId, setActiveClockTimeSectionId] = useState("");

    return (
        <clockTimeContext.Provider
            value={{isClocktimeRunning, setIsClocktimeRunning, activeClockTimeSectionId, setActiveClockTimeSectionId}}>
            {children}
        </clockTimeContext.Provider>
    )
}

export const useClockTimeContext = () => {
    const response = useContext(clockTimeContext)

    if (response) return response
    else throw new Error('useClockTimeContext must be used within clockTimeContextProvider')
}