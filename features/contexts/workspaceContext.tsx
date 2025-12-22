'use client'

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {Role, UserMode, WorkspaceId} from "@/types";
import {getUserNameData, getUserRoleData} from "@/features/utilities/userInfoData";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {getWorkspaceName} from "@/features/utilities/getWorkspaceName";

interface Context {
    mode: UserMode
    setMode: Dispatch<SetStateAction<UserMode>>
    workspaceId: WorkspaceId;
    setWorkspaceId: Dispatch<SetStateAction<WorkspaceId>>;
    userName: string;
    userSurname: string;
    userMail: string;
    userInitials: string;
    userRole: Role;
    workspaceName: string | null;
}

const workSpaceContext = createContext<Context | undefined>(undefined)

export const WorkSpaceContextProvider = ({children}: { children: ReactNode }) => {

    const [mode, setMode] = useState<UserMode>("solo")
    const [workspaceId, setWorkspaceId] = useState<WorkspaceId>(null)
    const [workspaceName, setWorkspaceName] = useState<string | null>("")
    const [userName, setUserName] = useState("")
    const [userSurname, setUserSurname] = useState("")
    const [userMail, setUserMail] = useState("")
    const [userInitials, setUserInitials] = useState("")
    const [userRole, setUserRole] = useState<Role>("Admin")

    const [user] = useAuthState(auth)
    const userId = user?.uid
    console.log(mode, workspaceId)

    useEffect(() => {
        getUserNameData(userId, mode, workspaceId).then(resp => {
            if (resp) {
                setUserName(resp.name)
                setUserSurname(resp.surname)
                setUserMail(resp.email)
                setUserInitials(`${resp.name.charAt(0).toUpperCase()}${resp.surname.charAt(0).toUpperCase()}`)
            } else {
                setUserName("")
                setUserSurname("")
                console.error("Error fetching user name!")
            }
        }).catch(err => console.log(err))
        getUserRoleData(userId, mode, workspaceId).then(resp => {
            if (resp) {
                setUserRole(resp)
            } else {
                setUserRole(null)
                console.error("Error fetching user role!")
            }
        }).catch(err => console.log(err))
        getWorkspaceName(workspaceId).then(workspaceName => {
            if (workspaceName) {
                setWorkspaceName(workspaceName)
            } else {
                setWorkspaceName(null)
            }
        }).catch(err => console.log(err))
    }, [mode, userId, workspaceId]);

    return (
        <workSpaceContext.Provider
            value={{
                mode,
                setMode,
                workspaceId,
                setWorkspaceId,
                userName,
                userSurname,
                userInitials,
                userRole,
                workspaceName,
                userMail
            }}>
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