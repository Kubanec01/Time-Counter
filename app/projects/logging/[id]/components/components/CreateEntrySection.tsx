'use client'

import {RiBarChart2Fill, RiSettings3Fill} from "react-icons/ri";
import {BaseOption, LoggingType, ProjectOption, UsersClasses} from "@/types";
import {MaxDateCalendarInput} from "@/features/utilities/date/MaxDateCalendarInput";
import React, {FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {
    formatedTwoTimesDifferenceToSeconds,
    formatFloatHoursToSeconds, secondsToFloatHours, updateProjectTotalTime
} from "@/features/utilities/time/timeOperations";
import {createNewSection} from "@/features/utilities/create-&-update/createNewSection";
import {updateTotalTrackedTime} from "@/features/utilities/edit/updateTotalTrackedTime";
import {updateUserIndividualTime} from "@/features/utilities/create-&-update/updateUserIndividualTime";
import {formateDateToYMD} from "@/features/utilities/date/dateOperations";
import {getHours, getMinutes} from "date-fns";
import {useProjectData} from "@/features/hooks/useProjectData";
import {useMemberData} from "@/features/hooks/useMemberData";
import {MediumButton} from "@/components/MediumButton/MediumButton";
import {SelectBar} from "@/components/SelectBar/SelectBar";
import {useWorkspaceData} from "@/features/hooks/useWorkspaceData";
import {TextInput} from "@/components/TextInput/TextInput";
import {NumberInput} from "@/components/NumberInput/NumberInput";
import {ClockTimeInput} from "@/components/ClockTimeInput/ClockTimeInput";
import {LargeButton} from "@/components/LargeButton/LargeButton";
import {EntryCreatorPanel} from "@/components/EntryCreatorPanel/EntryCreatorPanel";

export const CreateEntrySection = ({projectId}: { projectId: string }) => {

    const currDate = new Date();
    const currTime = `${String(getHours(currDate)).padStart(2, "0")}:${String(getMinutes(currDate)).padStart(2, "0")}`

    // States
    const [taskType, setTaskType] = useState<LoggingType>(null)
    const [customType, setCustomType] = useState<string>("")
    const [options, setOptions] = useState<ProjectOption[]>([])
    const [nameValue, setNameValue] = useState("");
    const [timeInputValue, setTimeInputValue] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(currDate);
    const [timeFormat, setTimeFormat] = useState<"Decimal" | "Range">("Decimal")
    const [fromTime, setFromTime] = useState(currTime);
    const [toTime, setToTime] = useState(currTime);
    const [isCreatingTrack, setIsCreatingTrack] = useState(false);

    // Hooks
    const router = useRouter();
    const {workspaceId, userName, userSurname, userRole, userId} = useWorkSpaceContext()
    const projectData = useProjectData(workspaceId, projectId)
    const memberData = useMemberData(workspaceId, userId)
    const workspaceData = useWorkspaceData(workspaceId)

    // Variables
    const selectOptions: BaseOption[] = [
        {label: 'Select...', value: ""},
        ...options.map(option => ({label: option.label, value: option.value})),
        {label: 'Custom', value: "custom"},
        {label: 'Unset', value: "unset"},
    ]

    // Functions
    const setTimeDifference = (firstTime: string, secondTime: string) => {
        setFromTime(firstTime)
        setToTime(secondTime)

        const timeDifference = formatedTwoTimesDifferenceToSeconds(firstTime, secondTime);

        setTimeInputValue(secondsToFloatHours(timeDifference));
    }

    const createSection = async (e: FormEvent) => {
        e.preventDefault();

        setIsCreatingTrack(true)

        const timeToSeconds = formatFloatHoursToSeconds(timeInputValue)
        const newTaskType = taskType === "custom" ? customType : taskType
        const userFullName = `${userName} ${userSurname}`

        await updateUserIndividualTime(userId, workspaceId, projectId, formateDateToYMD(selectedDate), timeToSeconds, "increase")
        await createNewSection(userId, userFullName, projectId, nameValue, timeToSeconds, formateDateToYMD(selectedDate), setNameValue, newTaskType, workspaceId)
        await updateTotalTrackedTime(projectId, formateDateToYMD(selectedDate), timeToSeconds, workspaceId, "increase")
        await updateProjectTotalTime(projectId, timeToSeconds, workspaceId, "increase")

        setNameValue("")
        setTaskType(null)
        setTimeInputValue(0)
        setFromTime(currTime)
        setToTime(currTime)
        setIsCreatingTrack(false)
    }

    const isButtonDisabled = () => {
        return nameValue.trim() === "" || taskType === null || timeInputValue <= 0 ||
            selectedDate === null || (taskType === "custom" && customType?.trim() === "") || isCreatingTrack;
    }


    // Fetch Data
    useEffect(() => {
        if (!userId || !projectData || !memberData || !workspaceData) return

        const updateData = () => {

            if (memberData.class && memberData.class !== 'unset') {
                const classOptions = workspaceData.userClasses.find((c: UsersClasses) => c.id === memberData.class)
                if (classOptions) setOptions(classOptions)
            } else setOptions(projectData.options.filter(o => o.active))

            setTimeFormat(projectData.trackFormat)
        }

        updateData()

    }, [memberData, projectData, userId, workspaceData])

    return (
        <>
            <EntryCreatorPanel
                title={"Create a new entry"}
                buttonsSectionChildren={
                    <div
                        className={`${userRole === "Member" ? "hidden" : "flex"} gap-2.5`}>
                        <MediumButton
                            onClick={() => router.push(`/workspaces/settings/project/stats/${projectId}`)}
                            className={"bg-black-gradient"}>
                        <span className={"flex items-center gap-1"}>
                            Stats
                            <RiBarChart2Fill className={"mb-0.5"}/>
                        </span>
                        </MediumButton>
                        <MediumButton
                            onClick={() => router.push(`/workspaces/settings/project/${projectId}`)}
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
                    className={"p-6 flex flex-col justify-between gap-8 items-start"}>
                    {/* Main inputs Section */}
                    <div
                        className={"w-full flex justify-start gap-10 flex-wrap"}>
                        {/* Type of Work */}
                        <SelectBar
                            options={selectOptions}
                            value={taskType || ""}
                            onChange={(e) => setTaskType(e)}
                            labelText={"Type of task"}
                            inputClassname={"border border-black/20 w-[130px] py-1.5 px-2 rounded-md bg-white cursor-pointer bg-white"}
                            inputId={"timer-name-input"}
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
                            className={`${timeFormat === "Decimal" ? "flex" : "hidden"}`}>
                            <NumberInput
                                inputId={"time-input"}
                                value={String(timeInputValue)}
                                labelChildren={"Hours"}
                                placeholder={'0.25'}
                                step={0.25}
                                min={0.25}
                                max={24}
                                onChange={(e) => setTimeInputValue(e)}
                            />
                        </div>
                        {/* Range time inputs */}
                        <div
                            className={`${timeFormat === "Range" ? "flex" : "hidden"} flex gap-6`}>
                            <ClockTimeInput
                                inputId={"from-time"}
                                value={fromTime}
                                labelText={"From"}
                                onChange={(fromTimeValue) => {
                                    setFromTime(fromTimeValue)
                                    setTimeDifference(fromTimeValue, toTime)
                                }}
                            />
                            <ClockTimeInput
                                inputId={"to-time"}
                                value={toTime}
                                labelText={"To"}
                                onChange={(toTimeValue) => {
                                    setFromTime(toTimeValue)
                                    setTimeDifference(fromTime, toTimeValue)
                                }}
                            />
                        </div>
                        {/*  Date  */}
                        <MaxDateCalendarInput
                            inputId={"date-input"}
                            labelText={"Date"}
                            selectedDate={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e)
                            }}
                        />
                        {/* Custom input */}
                        <div
                            className={`${taskType === "custom" ? "flex  flex-col" : "hidden"}`}>
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
                        px-5 py-2 mt-4`}
                    >
                        Create entry
                    </LargeButton>
                </form>
            </EntryCreatorPanel>
        </>
    )
}
