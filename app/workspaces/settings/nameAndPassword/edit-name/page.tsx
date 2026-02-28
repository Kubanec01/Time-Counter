'use client'

import {FormEvent, useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, updateDoc} from "firebase/firestore";
import {ChangeFormModal} from "@/app/workspaces/settings/components/ChangeFormModal";
import {useGetWorkspacePassword} from "@/features/hooks/useGetWorkspacePassword";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";

const WorkspaceName = () => {

    const [workspacePassword, setWorkspacePassword] = useState("");
    const [name, setName] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFormSent, setIsFormSent] = useState(false);

    const {workspaceId} = useWorkSpaceContext()
    const {password} = useGetWorkspacePassword()
    const {replace} = useReplaceRouteLink()

    const changeWorkspaceName = async (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        if (name.trim() === "") {
            setIsLoading(false)
            return setErrMessage("Something went wrong, try again...");
        } else if (workspacePassword !== password) {
            setIsLoading(false)
            return setErrMessage("Wrong password, try again...");
        }

        if (!workspaceId) return
        const docRef = doc(db, "realms", workspaceId)
        await updateDoc(docRef, {workspaceName: name})
        setName("")
        setIsLoading(false);
        setIsFormSent(true)
    }

    const formBody = (
        <form
            onSubmit={changeWorkspaceName}
            className={"flex flex-col gap-3"}>
            <div
                className={"w-full"}
            >
                <label
                    htmlFor="workspace-password"
                    className={"text-xs font-bold"}
                >
                    Workspace password
                </label>
                <input
                    className={"w-full border border-black/20 focus:border-black/40 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                    id={"workspace-password"}
                    onChange={e => {
                        setWorkspacePassword(e.target.value)
                    }}
                    placeholder={"Enter workspace password"}
                    type="password"/>
            </div>
            <div
                className={"w-full"}
            >
                <label
                    htmlFor="workspace-name"
                    className={"text-xs font-bold"}
                >
                    Workspace name
                </label>
                <input
                    className={"w-full border border-black/20 focus:border-black/40 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                    id={"workspace-name"}
                    onChange={e => {
                        setName(e.target.value)
                    }}
                    placeholder={"Enter workspace new name"}
                    type="text"/>
            </div>
            <span
                className={"text-center text-sm text-red-600"}>
                {errMessage}
            </span>
            <button
                disabled={isLoading}
                type="submit"
                className={"medium-button bg-black-gradient mt-7"}>
                Change
            </button>
            <button
                type="button"
                onClick={() => replace('/')}
                className={"text-[13px] font-bold text-black/50 mt-1 cursor-pointer hover:underline"}>
                {"Back to Home"}
            </button>
        </form>
    )

    return (
        <section
            className="w-full h-screen flex flex-col justify-center items-center bg-radial from-gradient-purple to-white to-40%">
            <ChangeFormModal
                title={"Change workspace name"}
                confirmText={"Workspace name has been updated!"}
                formSection={formBody}
                isFormSent={isFormSent}
            />
        </section>
    )
}


export default WorkspaceName