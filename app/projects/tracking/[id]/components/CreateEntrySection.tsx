'use client'


import {RiBarChart2Fill, RiSettings3Fill} from "react-icons/ri";
import {BaseOption, LoggingType, ProjectOption, UsersClasses} from "@/types";
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
import {EntryCreatorPanel} from "@/components/EntryCreatorPanel/EntryCreatorPanel";
import {MediumButton} from "@/components/MediumButton/MediumButton";
import {LargeButton} from "@/components/LargeButton/LargeButton";
import {SelectBar} from "@/components/SelectBar/SelectBar";
import {TextInput} from "@/components/TextInput/TextInput";
import {projectSettingsMainUrlPath, projectStatsPageUrlPath} from "@/data/Url_Paths/urlPaths";

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

    const optionsData: BaseOption[] = [
        {label: 'Select...', value: ''},
        ...options.map(o => ({label: o.label, value: o.value})),
        {label: 'Custom', value: "custom"},
        {label: 'Unset', value: "unset"},
    ]

    // Hooks
    const {workspaceId, userName, userSurname, userRole, userId} = useWorkSpaceContext()
    const router = useRouter();
    const {project, status} = useProjectData(workspaceId, props.projectId)
    const workspaceData = useWorkspaceData(workspaceId)
    const memberData = useMemberData(workspaceId, userId)

    // Functions
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
        if (!userId || !workspaceData || !project || !memberData) return

        const updateData = () => {

            if (memberData.class && memberData.class !== 'unset') {
                const classOptions = workspaceData.userClasses.find((c: UsersClasses) => c.id === memberData.class)
                if (classOptions) setOptions(classOptions)
            } else setOptions(project.options.filter(o => o.active))
        }
        updateData()

    }, [memberData, project, userId, workspaceData])

    return (
        <>
            <EntryCreatorPanel
                title={'Create a new entry'}
                buttonsSectionChildren={
                    <div
                        className={`${userRole === "Member" ? "hidden" : "flex"} gap-2.5`}>
                        <MediumButton
                            onClick={() => router.push(projectStatsPageUrlPath(props.projectId))}
                            className={"bg-black-gradient"}>
                        <span className={"flex items-center gap-1"}>
                            Stats
                            <RiBarChart2Fill className={"mb-0.5"}/>
                        </span>
                        </MediumButton>
                        <MediumButton
                            onClick={() => router.push(projectSettingsMainUrlPath(props.projectId))}
                            className={"bg-black-gradient"}>
                        <span className={"flex items-center gap-1"}>
                            Settings
                            <RiSettings3Fill/>
                        </span>
                        </MediumButton>
                    </div>
                }
            >
                <form
                    onSubmit={createSection}
                    className={"p-6 rounded-xl bg-black/2 mx-auto flex items-end justify-between"}>
                    <div
                        className={"w-full flex justify-start gap-10 flex-wrap"}>
                        {/* Type of Work */}
                        <SelectBar
                            inputId={"Select-option-input"}
                            options={optionsData}
                            value={taskType || ''}
                            labelText={"Type of task"}
                            inputClassname={"border border-black/20 w-[130px] py-1.5 px-2 rounded-md bg-white cursor-pointer bg-white"}
                            onChange={(e) => setTaskType(e)}
                        />
                        <TextInput
                            inputId={"timer-name"}
                            value={nameValue}
                            placeholder={"What are you going to work on?"}
                            isIconVisible={false}
                            labelText={"Name/Description"}
                            inputClassname={"py-1.5 w-[270px]"}
                            OnChange={e => setNameValue(e)}
                        />
                        <div
                            className={`${taskType === "custom" ? "flex  flex-col" : "hidden"}`}
                        >
                            <TextInput
                                inputId={"custom-option-input"}
                                value={customType}
                                labelText={"Custom Type of task"}
                                placeholder={"Write your custom type..."}
                                inputClassname={"py-1.5"}
                                OnChange={(e) => setCustomType(e)}
                                isIconVisible={false}
                            />
                        </div>
                    </div>
                    <LargeButton
                        type={"submit"}
                        disabled={isButtonDisabled()}
                        className={`${isButtonDisabled() ? "bg-black/40  border text-white/80" : "bg-purple-gradient cursor-pointer"}
                        px-5 py-2 mt-4 text-nowrap`}
                    >
                        Create entry
                    </LargeButton>
                </form>
            </EntryCreatorPanel>
        </>
    )
}

export default CreateEntrySection