'use client'

import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {FormEvent, useState} from "react";
import {auth} from "@/app/firebase/config";
import {createNewWorkspace} from "@/features/utilities/createNewWorkspace";
import {useAuthState} from "react-firebase-hooks/auth";

export const CreateWorkspace = () => {


    const [workspaceName, setWorkspaceName] = useState("")
    const [password, setPassword] = useState("")

    const {replace} = useReplaceRouteLink()
    const [user] = useAuthState(auth)
    const userId = user?.uid

    const createWorkspace = async (e: FormEvent) => {
        e.preventDefault()

        await createNewWorkspace(userId, workspaceName, password)

        setWorkspaceName("")
        setPassword("")
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
                Cancel
            </button>
        </form>
    )
}