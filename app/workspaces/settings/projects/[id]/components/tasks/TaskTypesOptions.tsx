'use client'

import {FaAngleDown, FaPlus, FaTasks} from "react-icons/fa";
import {FaXmark} from "react-icons/fa6";
import {useEffect, useState} from "react";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {onSnapshot} from "firebase/firestore";
import {Project, ProjectOption, UserMode} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {createNewOption} from "@/features/utilities/create/createNewOption";
import {setProjectOptionState} from "@/features/utilities/edit/setProjectOptionState";

export interface TaskTypesOptionsProps {
    userId: string | undefined;
    mode: UserMode;
    workSpaceId: string
    projectId: string;
}

export const TaskTypesOptions = ({...props}: TaskTypesOptionsProps) => {

    const {workspaceId, mode} = useWorkSpaceContext()

    // States
    const [activeOptions, setActiveOptions] = useState<ProjectOption[]>([]);
    const [inactiveOptions, setInactiveOptions] = useState<ProjectOption[]>([]);
    const [isSectionOpen, setIsSectionOpen] = useState(false);
    const [customInputValue, setCustomInputValue] = useState("");

    // Function
    const toggleOption = (opt: ProjectOption, action: ("activate" | "deactivate")) =>
        setProjectOptionState("general", props.userId, "unused", props.projectId, props.mode, props.workSpaceId, opt, action)

    // Fetch Options
    useEffect(() => {
        if (!props.userId) return

        const docRef = getFirestoreTargetRef(props.userId, mode, workspaceId);

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
    }, [mode, props.projectId, props.userId, workspaceId])

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
                <section
                    className={"flex gap-4"}>
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
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        const opt = {label: customInputValue, value: customInputValue}
                        createNewOption("general", props.userId, props.projectId, props.mode, props.workSpaceId, opt)
                        setCustomInputValue("")
                    }}
                    className={"mt-8 flex gap-2 px-2 items-end"}>
                    <div
                        className={"flex flex-col"}>
                        <label htmlFor="" className={"text-base w-[300px]"}>Custom type</label>
                        <input
                            value={customInputValue}
                            onChange={(e) => setCustomInputValue(e.target.value)}
                            type="text" className={"border text-base h-8.5 px-2 rounded-md"}/>
                    </div>
                    <button
                        type={"submit"}
                        className={"border text-base px-10 h-8.5 rounded-md cursor-pointer"}>
                        Create
                    </button>
                </form>
            </li>
        </>
    )
}