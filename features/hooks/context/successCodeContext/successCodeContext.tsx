import {createContext, Dispatch, ReactNode, SetStateAction, useState} from "react";

type SuccessCodeContextType = {
    successCode: string | null,
    setSuccessCode: Dispatch<SetStateAction<string | null>>
}

export const successCodeContext =
    createContext<SuccessCodeContextType | null>(null)



export const SuccessCodeContextProvider = ({children}: {children: ReactNode}) => {

    const [successCode, setSuccessCode] = useState<string | null>(null)

    return (
        <successCodeContext.Provider value={{successCode, setSuccessCode}}>
            {children}
        </successCodeContext.Provider>
    )
}