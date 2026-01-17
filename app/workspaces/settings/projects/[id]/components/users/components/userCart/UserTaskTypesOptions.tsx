'use client'

import {FaAngleDown, FaPlus, FaTasks} from "react-icons/fa";
import {FaXmark} from "react-icons/fa6";
import {useEffect, useState} from "react";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {onSnapshot} from "firebase/firestore";
import {Member, Project, ProjectOption, UserProjectOptions} from "@/types";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {createNewOption} from "@/features/utilities/create/createNewOption";
import {
    setUserCustomOption
} from "@/app/workspaces/settings/projects/[id]/components/users/components/utils/setUserCustomOption";
import {
    createCustomizedTasks
} from "@/app/workspaces/settings/projects/[id]/components/users/components/utils/createCustomTasksData";
import {
    deleteUsersOptionsData
} from "@/app/workspaces/settings/projects/[id]/components/users/components/utils/deleteUsersOptionsData";

interface TaskTypesOptionsProps {
    projectId: string;
    member: Member;
}


export const UserTaskTypesOptions = ({...props}: TaskTypesOptionsProps) => {

    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {workspaceId, mode} = useWorkSpaceContext()

    // States
    const [activeOptions, setActiveOptions] = useState<ProjectOption[]>([]);
    const [inactiveOptions, setInactiveOptions] = useState<ProjectOption[]>([]);
    const [isSectionOpen, setIsSectionOpen] = useState(false);
    const [customInputValue, setCustomInputValue] = useState("");

    const isCustomized = activeOptions.length > 0 || inactiveOptions.length > 0;

    const toggleOption = (item: ProjectOption, action: ("activate" | "deactivate")) => {
        setUserCustomOption(props.member.userId, props.projectId, mode, workspaceId, item, action);
    }

    // Fetch Options
    useEffect(() => {
        if (!userId) return

        const docRef = getFirestoreTargetRef(userId, mode, workspaceId);

        const fetchOptions = onSnapshot(docRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const project = data.projects.find((p: Project) => p.projectId === props.projectId) || []
            const usersOptions = project.customizedUsersOptions?.find((o: UserProjectOptions) => o.userId === props.member.userId) || {}

            const activeOptions: ProjectOption[] = usersOptions.activeOptions || []
            const inactiveOptions = usersOptions.inactiveOptions || []
            setActiveOptions(activeOptions)
            setInactiveOptions(inactiveOptions)
        });
        return () => fetchOptions()
    }, [mode, props.member.userId, props.projectId, userId, workspaceId, isCustomized])

    return (
        <>
            <div
                className={`${isSectionOpen ? "h-auto border-b border-white/50" : "h-[54px]"}
                text-white/80 text-lg overflow-hidden w-[90%]`}>
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
                <button
                    onClick={() => {
                        if (!isCustomized) createCustomizedTasks(props.member.userId, props.projectId, workspaceId)
                        else deleteUsersOptionsData(props.member.userId, props.projectId, workspaceId)
                    }}
                    className={"text-base border px-2 py-1 rounded-md my-4 cursor-pointer"}>
                    {isCustomized ? "Reset to default" : "Customize tasks"}
                </button>
                {isCustomized &&
                    <section
                        className={""}>
                        <div
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
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const opt = {label: customInputValue, value: customInputValue}
                                createNewOption("user", props.member.userId, props.projectId, mode, workspaceId, opt)
                                setCustomInputValue("")
                            }}
                            className={"mt-8 flex gap-2 px-2 items-end mb-4"}>
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
                    </section>
                }
            </div>
        </>
    )
}