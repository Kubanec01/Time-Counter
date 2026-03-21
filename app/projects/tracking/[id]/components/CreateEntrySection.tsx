'use client'


import {RiBarChart2Fill, RiSettings3Fill} from "react-icons/ri";
import {LoggingType, ProjectOption, UsersClasses} from "@/types";
import React, {FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {formatFloatHoursToSeconds} from "@/features/utilities/time/timeOperations";
import {createNewSection} from "@/features/utilities/create-&-update/createNewSection";
import {updateUserIndividualTime} from "@/features/utilities/create-&-update/updateUserIndividualTime";
import {formateDateToYMD} from "@/features/utilities/date/dateOperations";
import {useProjectData} from "@/features/hooks/useProjectData";
import {useWorkspaceData} from "@/features/hooks/useWorkspaceData";
import {useMemberData} from "@/features/hooks/useMemberData";

type CreateEntrySectionProps = {
    projectId: string;
}

const CreateEntrySection = ({...props}: CreateEntrySectionProps) => {

    // States
    const [taskType, setTaskType] = useState<LoggingType>(null)
    const [customType, setCustomType] = useState<string>("")
    const [options, setOptions] = useState<ProjectOption[]>([])
    const [nameValue, setNameValue] = useState("");
    const [timeInputValue, setTimeInputValue] = useState(0);
    const [isCreatingTrack, setIsCreatingTrack] = useState(false);

    // Hooks
    const {workspaceId, userName, userSurname, userRole, userId} = useWorkSpaceContext()
    const router = useRouter();
    const projectData = useProjectData(workspaceId, props.projectId)
    const workspaceData = useWorkspaceData(workspaceId)
    const memberData = useMemberData(workspaceId, userId)

    const currFormatedDate = formateDateToYMD(new Date());
    const createSection = async (e: FormEvent) => {
        e.preventDefault();

        setIsCreatingTrack(true)

        const timeToSeconds = formatFloatHoursToSeconds(timeInputValue)

        const newTaskType = taskType === "custom" ? customType : taskType

        const userFullName = `${userName} ${userSurname}`

        await updateUserIndividualTime(userId, workspaceId, props.projectId, currFormatedDate, timeToSeconds, "increase")
        await createNewSection(userId, userFullName, props.projectId, nameValue, timeToSeconds, currFormatedDate, setNameValue, newTaskType, workspaceId)

        setNameValue("")
        setTaskType(null)
        setTimeInputValue(0)
        setIsCreatingTrack(false)
    }

    const isButtonDisabled = () => {
        return nameValue.trim() === "" || taskType === null || (taskType === "custom" && customType?.trim() === "") || isCreatingTrack;
    }

    // Fetch Data
    useEffect(() => {
        if (!userId || !workspaceData || !projectData || !memberData) return

        const updateData = () => {

            if (memberData.class && memberData.class !== 'unset') {
                const classOptions = workspaceData.userClasses.find((c: UsersClasses) => c.id === memberData.class)
                if (classOptions) setOptions(classOptions)
            } else setOptions(projectData.options.filter(o => o.active))
        }

        updateData()

    }, [memberData, projectData, userId, workspaceData])

    return (
        <div
            className={"pb-6 pt-10 max-w-medium mt-8 bg-radial from-vibrant-purple-400/50 to-white to-66% mx-auto"}>
            <section
                className={"w-full flex items-center justify-between px-8 pb-2"}>
                <h1
                    className={"mb-0.5 font-medium text-black/60 text-lg"}>
                    Create a new entry
                </h1>
                <div
                    className={"flex gap-2.5"}
                >
                    <button
                        onClick={() => router.push(`/workspaces/settings/project/stats/${props.projectId}`)}
                        className={`${userRole === "Member" ? "hidden" : "flex"}
                        medium-button border flex items-center justify-center gap-1 bg-black-gradient`}>
                        Stats
                        <RiBarChart2Fill className={"mb-0.5"}/>
                    </button>
                    <button
                        onClick={() => router.push(`/workspaces/settings/project/${props.projectId}`)}
                        className={`${userRole === "Member" ? "hidden" : "flex"}
                        medium-button border flex items-center justify-center gap-1 bg-black-gradient`}>
                        Settings
                        <RiSettings3Fill/>
                    </button>
                </div>
            </section>
            <section
                className={"w-full p-8 rounded-xl shadow-lg mx-auto bg-white border border-black/5"}>
                <form
                    onSubmit={createSection}
                    className={"p-6 rounded-xl bg-black/2 mx-auto flex items-end justify-between"}>
                    {/* Main inputs Section */}
                    <div
                        className={"w-full flex justify-start gap-10 flex-wrap"}>
                        {/* Type of Work */}
                        <div
                            className={"flex flex-col"}>
                            <label htmlFor="task-type" className={"font-medium text-sm text-black/60"}>Type of
                                task</label>
                            <select
                                id="task-type"
                                value={taskType ?? ""}
                                onChange={(e) => setTaskType(e.target.value as LoggingType)}
                                className="border border-black/20 w-[130px] focus:outline-vibrant-purple-600 p-1 px-2
                                 rounded-md bg-white cursor-pointer"
                            >
                                <option value="" disabled>
                                    Select...
                                </option>
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                                <option value="custom">Custom</option>
                                <option value="unset">Unset</option>
                            </select>
                        </div>
                        {/* Name/Description */}
                        <div
                            className={"flex flex-col"}>
                            <label htmlFor="name-description"
                                   className={"font-medium text-sm text-black/60"}>Name/Description</label>
                            <input onChange={e => setNameValue(e.target.value)}
                                   value={nameValue}
                                   id={"edit-name-description"} type="text"
                                   placeholder={"What are you going to work on?"}
                                   className={"border border-black/20 w-[300px] focus:outline-vibrant-purple-600 p-1 px-2 rounded-md bg-white"}/>
                        </div>
                        {/* Custom input */}
                        <div
                            className={`${taskType === "custom" ? "flex  flex-col" : "hidden"}`}>
                            <label htmlFor="name-description" className={"font-medium text-sm text-black/60"}>Custom
                                Type of
                                task</label>
                            <input
                                onChange={(e) => setCustomType(e.target.value)}
                                id={"edit-name-description"} type="text" placeholder={"Write your custom type..."}
                                className={"border border-black/20 w-[300px] focus:outline-vibrant-purple-600 p-1 px-2 rounded-md bg-white"}/>
                        </div>
                    </div>
                    {/*Submit Button*/}
                    <button
                        type={"submit"}
                        disabled={isButtonDisabled()}
                        className={`${isButtonDisabled() ? "bg-black/40  border text-white/80" : "bg-purple-gradient cursor-pointer"}
                         px-5 py-2 text-sm font-medium rounded-md text-white duration-100 text-nowrap`}>
                        Create entry
                    </button>
                </form>
            </section>
        </div>
    )
}

export default CreateEntrySection