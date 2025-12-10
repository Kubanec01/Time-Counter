'use client'

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react";
import {UserMode, WorkspaceId} from "@/types";

interface Context {
    mode: UserMode
    setMode: Dispatch<SetStateAction<UserMode>>
    workspaceId: WorkspaceId;
    setWorkspaceId: Dispatch<SetStateAction<WorkspaceId>>;
}

const workSpaceContext = createContext<Context | undefined>(undefined)

export const WorkSpaceContextProvider = ({children}: { children: ReactNode }) => {

    const [mode, setMode] = useState<UserMode>("solo")
    const [workspaceId, setWorkspaceId] = useState<WorkspaceId>(null)

    console.log(mode, workspaceId)

    return (
        <workSpaceContext.Provider value={{mode, setMode, workspaceId, setWorkspaceId}}>
            {children}
        </workSpaceContext.Provider>
    )
}

export const useWorkSpaceContext = () => {
    const context = useContext(workSpaceContext)

    if (!context) {
        throw new Error("useWorkSpaceContext must be used within WorkSpaceContextProvider.")
    }
    return context
}