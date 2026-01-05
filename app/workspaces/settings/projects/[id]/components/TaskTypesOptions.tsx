'use client'

import {FaAngleDown, FaAngleUp, FaPlus, FaTasks} from "react-icons/fa";
import {FaXmark} from "react-icons/fa6";
import {useEffect, useState} from "react";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {Project, ProjectOption} from "@/types";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";

interface TaskTypesOptionsProps {
    projectId: string;
}

export const TaskTypesOptions = ({...props}: TaskTypesOptionsProps) => {

    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {workspaceId, mode} = useWorkSpaceContext()

    // States
    const [activeOptions, setActiveOptions] = useState<ProjectOption[]>([]);
    const [inactiveOptions, setInactiveOptions] = useState<ProjectOption[]>([]);
    const [isSectionOpen, setIsSectionOpen] = useState(false);

    const toggleOption = async (item: ProjectOption, action: ("activate" | "deactivate")) => {
        if (!userId) return

        const docRef = getFirestoreTargetRef(userId, mode, workspaceId);
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return
        const data = docSnap.data()
        const projects = data.projects
        const project = projects.find((p: Project) => p.projectId === props.projectId)
        const activeOptions = project.options || []
        const inactiveOptions = project.inactiveOptions || []

        // Active options
        const updatedActiveOptions = action === "deactivate"
            ?
            activeOptions.filter((o: ProjectOption) => o.value !== item.value)
            :
            [...activeOptions, item]

        // Inactive options
        const updatedInactiveOptions = action === "deactivate"
            ?
            [...inactiveOptions, item]
            :
            inactiveOptions.filter((o: ProjectOption) => o.value !== item.value)

        // Project
        const updatedProjects = projects.map((p: Project) => {
            if (p.projectId !== props.projectId) return p
            return {...p, options: updatedActiveOptions, inactiveOptions: updatedInactiveOptions}
        })

        // Update Doc
        await updateDoc(docRef, {projects: updatedProjects})
    }

    // Fetch Options
    useEffect(() => {
        if (!userId) return

        const docRef = getFirestoreTargetRef(userId, mode, workspaceId);

        const fetchOptions = onSnapshot(docRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const project = data.projects.find((p: Project) => p.projectId === props.projectId)
            const activeOptions: ProjectOption[] = project.options || []
            const inactiveOptions = project.inactiveOptions || []
            setActiveOptions(activeOptions)
            setInactiveOptions(inactiveOptions)
        });
        return () => fetchOptions()
    }, [mode, props.projectId, userId, workspaceId])

    return (
        <>
            <li
                className={`${isSectionOpen ? "h-auto border-b border-white/50" : "h-[54px]"}
                text-white/80 text-lg pb-4.5 overflow-hidden w-[90%]`}>
                <div
                    className={"w-full border-b border-white/50 py-2.5 pl-2 pr-4 flex items-center justify-between"}>
                    <h1
                        className={" flex items-center gap-3"}>
                        <FaTasks/> Task Types
                    </h1>
                    <button
                        onClick={() => setIsSectionOpen(v => !v)}
                        className={`${isSectionOpen ? "rotate-180" : "rotate-0"}
                        text-white/80 hover:text-white cursor-pointer duration-180`}>
                        <FaAngleDown/>
                    </button>
                </div>
                <section>
                    {activeOptions.length > 0 &&
                        <>
                            <div
                                className={"w-[50%] p-4 flex flex-col gap-3 border mt-4 border-white/40 rounded-xl"}
                            >
                                <h1
                                    className={"w-full font-semibold text-white text-base border-b border-white/40 pb-2.5"}>
                                    Activated Types
                                </h1>
                                <ul>
                                    {activeOptions.map((option) => (
                                        <li
                                            key={option.value}
                                            className={"flex gap-2 items-center"}
                                        >
                                            {option.label}
                                            <button
                                                onClick={() => toggleOption(option, "deactivate")}
                                                className={"text-white/30 hover:text-red-600/85 duration-150 cursor-pointer"}>
                                                <FaXmark/>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    }
                    {inactiveOptions.length > 0 &&
                        <>
                            <div
                                className={"w-[50%] p-4 flex flex-col gap-3 border mt-4 border-white/40 rounded-xl"}
                            >
                                <h1
                                    className={"w-full font-semibold text-white text-base border-b border-white/40 pb-2.5"}>
                                    Deactivated Types
                                </h1>
                                <ul>
                                    {inactiveOptions.map((option) => (
                                        <li
                                            key={option.value}
                                            className={"flex gap-2.5 items-center"}
                                        >
                                            {option.label}
                                            <button
                                                onClick={() => toggleOption(option, "activate")}
                                                className={"text-white/30 text-sm hover:text-vibrant-purple-600 duration-150 cursor-pointer"}>
                                                <FaPlus/>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    }
                </section>
            </li>
        </>
    )
}