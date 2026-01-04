'use client'

import {Member, Project, ProjectOption} from "@/types";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {auth, db} from "@/app/firebase/config";
import {doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {getProjectTotalTime} from "@/features/utilities/time/totalTime";
import {useAuthState} from "react-firebase-hooks/auth";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useGetProjectName} from "@/features/hooks/useGetProjectName";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {FaTasks} from "react-icons/fa";
import {FaXmark} from "react-icons/fa6";

const WorkspaceProjectSettingsHome = () => {

    const [activeOptions, setActiveOptions] = useState<ProjectOption[]>([]);
    const [inactiveOptions, setInactiveOptions] = useState<ProjectOption[]>([]);

    const {id} = useParams();
    if (id === undefined) {
        throw new Error("No project id found.");
    }

    const projectId = id.toString()
    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {projectName} = useGetProjectName(projectId)
    const {workspaceId, mode} = useWorkSpaceContext()

    const deactivateOption = async (item: ProjectOption) => {
        if (!userId) return

        const docRef = getFirestoreTargetRef(userId, mode, workspaceId);
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return
        const data = docSnap.data()
        const projects = data.projects
        const project = projects.find((p: Project) => p.projectId === projectId)
        const activeOptions = project.options || []
        const inactiveOptions = project.inactiveOptions || []

        const updatedActiveOptions = activeOptions.filter((option: ProjectOption) => option.value !== item.value)
        const updatedInactiveOptions = [...inactiveOptions, item]

        const updatedProjects = projects.map((p: Project) => {
            if (p.projectId !== projectId) return p
            return {...p, options: updatedActiveOptions, inactiveOptions: updatedInactiveOptions}
        })

        await updateDoc(docRef, {projects: updatedProjects})
    }

    useEffect(() => {
        if (!userId) return

        const docRef = getFirestoreTargetRef(userId, mode, workspaceId);

        const fetchOptions = onSnapshot(docRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const project = data.projects.find((p: Project) => p.projectId === projectId)
            const activeOptions = project.options || []
            const inactiveOptions = project.inactiveOptions || []
            setActiveOptions(activeOptions)
            setInactiveOptions(inactiveOptions)
        });
        return () => fetchOptions()
    }, [mode, projectId, userId, workspaceId])

    return (
        <>
            <section
                className={"w-[90%] max-w-[700px] mx-auto h-[400px] mt-[200px]"}>
                <h1
                    className={"text-xl text-white/80 font-semibold border-b border-white/30"}
                >{projectName} / Project Settings</h1>
                <ul
                    className={"w-full p-4 pl-0 flex flex-col gap-3"}
                >
                    <li
                        className={"text-white/80 text-lg font-medium" +
                            "flex items-center justify-start gap-1 duration-100"}>
                        <h1
                            className={"w-full border-b border-white/50 cursor-pointer hover:border-white/80 py-2.5 flex items-center gap-3"}>
                            <FaTasks/> Task Types</h1>
                        <section>
                            <div
                                className={"w-[50%] p-4 pl-0 flex flex-col gap-3 border-b border-white/50"}
                            >
                                <h1
                                    className={"w-full font-semibold text-white text-base border-b border-white/50 py-2.5"}>
                                    Active Types
                                </h1>
                                <ul>
                                    {activeOptions.map((option) => (
                                        <li
                                            key={option.value}
                                            className={"flex gap-2 items-center"}
                                        >
                                            {option.label}
                                            <button
                                                onClick={() => deactivateOption(option)}
                                                className={"text-white/30 hover:text-white/80 duration-150 cursor-pointer"}>
                                                <FaXmark/>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {inactiveOptions.length > 0 &&
                                <>
                                    <div
                                        className={"w-[50%] p-4 pl-0 flex flex-col gap-3 border-b border-white/50"}
                                    >
                                        <h1
                                            className={"w-full font-semibold text-white text-base border-b border-white/50 py-2.5"}>
                                            Deactivated Types
                                        </h1>
                                        <ul>
                                            {inactiveOptions.map((option) => (
                                                <li
                                                    key={option.value}
                                                >
                                                    {option.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            }
                        </section>
                    </li>
                </ul>
            </section>
        </>
    )
}

export default WorkspaceProjectSettingsHome