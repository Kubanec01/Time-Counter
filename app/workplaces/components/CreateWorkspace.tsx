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
            className="w-[280px] py-4 rounded-2xl flex flex-col justify-center items-center gap-[8px]"
        >
            <div className="flex gap-3 items-center mb-4">
                <h1 className="text-lg text-black/60 font-bold">
                    Create Workspace
                </h1>
            </div>

            {/* Workspace Name Input */}
            <input
                onChange={e => setWorkspaceName(e.target.value)}
                value={workspaceName}
                placeholder="Workspace Name"
                className="w-full h-[38px] bg-white rounded-full text-base px-3 outline-none"
                type="text"
            />

            {/* Password Input */}
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                placeholder="Workspace Password"
                className="w-full h-[38px] bg-white rounded-full text-base px-3 outline-none"
                type="password"
            />

            <button
                type="submit"
                className="cursor-pointer w-full py-1.5 mt-4 font-medium text-base text-white bg-black/80 hover:bg-black/75 rounded-full"
            >
                Create
            </button>

            <button
                type="button"
                onClick={() => replace("/")}
                className="cursor-pointer w-full py-1 font-medium text-base text-black/80 border border-black/40 hover:bg-gray-700/5 rounded-full"
            >
                Go back
            </button>
        </form>

    )
}