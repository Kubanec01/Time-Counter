'use client'

import {FormEvent, useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useGetWorkspacePassword} from "@/features/hooks/useGetWorkspacePassword";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {ChangeFormModal} from "@/app/workspaces/settings/components/ChangeFormModal";
import {documentNotFound} from "@/messages/errors";
import {Project} from "@/types";
import {useParams} from "next/navigation";


export default function EditProjectNamePage() {


    const [workspacePassword, setWorkspacePassword] = useState("");
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFormSent, setIsFormSent] = useState(false);

    const {workspaceId} = useWorkSpaceContext()
    const {password} = useGetWorkspacePassword()
    const {replace} = useReplaceRouteLink()
    const projectId = useParams().id

    const changeWorkspaceName = async (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        if (newProjectTitle.trim() === "") {
            setIsLoading(false)
            return setErrMessage("Something went wrong, try again...");
        } else if (workspacePassword !== password) {
            setIsLoading(false)
            return setErrMessage("Wrong password, try again...");
        }

        if (!workspaceId || workspaceId === "unused") return
        const docRef = doc(db, "realms", workspaceId)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return console.error(documentNotFound)
        const data = docSnap.data()
        const updatedProjects = data.projects.map((project: Project) => {
            if (project.projectId !== projectId) return project
            return {...project, title: newProjectTitle}
        })

        await updateDoc(docRef, {projects: updatedProjects})
        setNewProjectTitle("")
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
                    htmlFor="project-name"
                    className={"text-xs font-bold"}
                >
                    Project name
                </label>
                <input
                    className={"w-full border border-black/20 focus:border-black/40 rounded-md text-sm py-1 px-2 mt-1 outline-none"}
                    id={"project-name"}
                    onChange={e => {
                        setNewProjectTitle(e.target.value)
                    }}
                    placeholder={"Enter new project name"}
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
                title={"Change project name"}
                confirmText={"Project name has been updated!"}
                formSection={formBody}
                isFormSent={isFormSent}
            />
        </section>
    )
}