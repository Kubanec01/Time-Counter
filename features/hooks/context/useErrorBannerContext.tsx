'use client'

import {createContext, Dispatch, SetStateAction, useContext, useState} from "react";
import {ErrorBannerValues} from "@/types";


type ErrorBannerContextType = {
    errorCode: ErrorBannerValues | null
    setErrorCode: Dispatch<SetStateAction<ErrorBannerValues | null>>
}

const errorBannerContext = createContext<ErrorBannerContextType | undefined>(undefined)


const ErrorBannerContextProvider = ({children}: { children: React.ReactNode }) => {

    const [errorCode, setErrorCode] = useState<ErrorBannerValues | null>(null)

    return (
        <errorBannerContext.Provider value={{errorCode, setErrorCode}}>
            {children}
        </errorBannerContext.Provider>
    )
}

const useErrorBannerContext = () => {
    const response = useContext(errorBannerContext)
    if (response) return response
    else throw new Error('useErrorBundlerContext must be used within ErrorBundlerContextProvider')
}

export {ErrorBannerContextProvider, useErrorBannerContext}