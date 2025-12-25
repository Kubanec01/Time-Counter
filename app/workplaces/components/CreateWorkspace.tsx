'use client'

import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {FormEvent, useState} from "react";
import {auth} from "@/app/firebase/config";
import {createNewWorkspace} from "@/features/utilities/create/createNewWorkspace";
import {useAuthState} from "react-firebase-hooks/auth";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {throwRandomNum} from "@/features/utilities/throwRandomNum";

export const CreateWorkspace = () => {


    const [workspaceName, setWorkspaceName] = useState("")
    const [password, setPassword] = useState("")

    const {setWorkspaceId, setMode} = useWorkSpaceContext()
    const {replace} = useReplaceRouteLink()
    const [user] = useAuthState(auth)
    const userId = user?.uid

    const createWorkspace = async (e: FormEvent) => {
        e.preventDefault()

        if (password.trim() === "" || workspaceName.trim() === "") return console.log('Missing password or name')

        const workspaceId = `@${workspaceName.replace(/\s/g, "")}${throwRandomNum(1000)}`
        await createNewWorkspace(userId, workspaceName, workspaceId, password)

        setWorkspaceName("")
        setPassword("")
        setMode("workspace")
        setWorkspaceId(workspaceId)
        replace("/")
    }

    return (
        <form
            onSubmit={createWorkspace}
            className="w-[312px] flex flex-col justify-center items-center gap-[8px]">
            <h1
                className={"text-lg font-semibold mb-4"}>
                Create Workspace
            </h1>
            {/* Name Input */}
            <input
                onChange={e => setWorkspaceName(e.target.value)}
                value={workspaceName}
                placeholder="Workspace Name"
                className="w-full h-[46px] border border-custom-gray-800 rounded-[4px] text-base px-3"
                type="text"
            />
            {/* Password Input */}
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                placeholder="Workspace Password"
                className="w-full h-[46px] border border-custom-gray-800 rounded-[4px] text-base px-3"
                type="password"
            />
            <button
                type={"submit"}
                className="cursor-pointer w-full h-[43px] mt-[8px] font-medium text-base text-white bg-pastel-purple-700 rounded-[8px]"
            >
                Create
            </button>
            <button
                type={"button"}
                onClick={() => replace("/")}
                className="cursor-pointer w-full h-[43px] font-medium text-base text-pastel-purple-700 border-2 border-pastel-purple-700 rounded-[8px]"
            >
                Go back
            </button>
        </form>
    )
}