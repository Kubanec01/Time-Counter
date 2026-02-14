import {RiBarChart2Fill, RiSettings3Fill} from "react-icons/ri";
import {LoggingType, Member, Project, ProjectOption, UserProjectOptions} from "@/types";
import {MaxDateCalendarInput} from "@/features/utilities/date/MaxDateCalendarInput";
import React, {FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {onSnapshot} from "firebase/firestore";
import {
    formatedTwoTimesDifferenceToSeconds,
    formatFloatHoursToSeconds, secondsToFloatHours
} from "@/features/utilities/time/timeOperations";
import {createNewSection} from "@/features/utilities/create/createNewSection";
import {updateTotalTrackedTime} from "@/features/utilities/edit/updateTotalTrackedTime";
import {updateProjectTotalTime} from "@/features/utilities/time/totalTime";
import {UsersClasses} from "@/data/users";
import {updateUserIndividualTime} from "@/features/utilities/create/updateUserIndividualTime";
import {formateDateToYMD} from "@/features/utilities/date/formateDates";
import InformativeModal from "@/components/modals/InformativeModal";
import {getHours, getMinutes} from "date-fns";

type CreateEntrySectionProps = {
    projectId: string;
}

export const CreateEntrySection = ({...props}: CreateEntrySectionProps) => {

    const currDate = new Date();
    const currTime = `${String(getHours(currDate)).padStart(2, "0")}:${String(getMinutes(currDate)).padStart(2, "0")}`

    // States
    const [taskType, setTaskType] = useState<LoggingType>(null)
    const [customType, setCustomType] = useState<string>("")
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [options, setOptions] = useState<ProjectOption[]>([])
    const [nameValue, setNameValue] = useState("");
    const [timeInputValue, setTimeInputValue] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(currDate);
    const [isMaxTimeModalOpen, setIsMaxTimeModalOpen] = useState(false);
    const [timeFormat, setTimeFormat] = useState<"Decimal" | "Range">("Decimal")
    const [fromTime, setFromTime] = useState(currTime);
    const [toTime, setToTime] = useState(currTime);


    const setTimeDifference = (firstTime: string, secondTime: string) => {
        setFromTime(firstTime)
        setToTime(secondTime)

        const timeDifference = formatedTwoTimesDifferenceToSeconds(firstTime, secondTime);

        setTimeInputValue(secondsToFloatHours(timeDifference));
    }

    const router = useRouter();

    const {mode, workspaceId, userName, userSurname, userRole, userId} = useWorkSpaceContext()

    const createSection = async (e: FormEvent) => {
        e.preventDefault();

        const timeToSeconds = formatFloatHoursToSeconds(timeInputValue)

        const newTaskType = taskType === "custom" ? customType : taskType

        const userFullName = `${userName} ${userSurname}`

        const canContinue = await updateUserIndividualTime(userId, workspaceId, props.projectId, formateDateToYMD(selectedDate), timeToSeconds, "increase")
        if (canContinue === false) {
            setIsMaxTimeModalOpen(true);
            setNameValue("")
            setTaskType(null)
            setTimeInputValue(0)
            return
        }

        await createNewSection(userId, userFullName, props.projectId, nameValue, timeToSeconds, selectedDate, setNameValue, setIsInfoModalOpen, newTaskType, workspaceId)
        await updateTotalTrackedTime(props.projectId, formateDateToYMD(selectedDate), timeToSeconds, workspaceId, "increase")
        await updateProjectTotalTime(props.projectId, timeToSeconds, workspaceId, "increase")
        setNameValue("")
        setTaskType(null)
        setTimeInputValue(0)
        setFromTime(currTime)
        setToTime(currTime)
    }

    const isButtonDisabled = () => {
        return nameValue.trim() === "" || taskType === null || timeInputValue <= 0 ||
            selectedDate === null || (taskType === "custom" && customType?.trim() === "");
    }

    // Fetch Data
    useEffect(() => {
        if (!userId) return

        const userRef = getFirestoreTargetRef(userId, mode, workspaceId)

        const fetchOptions = onSnapshot(userRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const member: Member = data.members.find((m: Member) => m.userId === userId)
            const memberClass = member.class
            const usersClasses: UsersClasses[] = data.userClasses
            const project = data.projects.find((project: Project) => project.projectId === props.projectId)
            const customized = project.customizedUsersOptions ?? [];
            const userOptions = customized.find((o: UserProjectOptions) => o.userId === userId);
            const trackFormat = project.trackFormat

            setTimeFormat(trackFormat)

            if (userOptions) {
                setOptions(userOptions.activeOptions)
            } else if (memberClass && memberClass !== "unset") {
                const classes = usersClasses.find(i => i.id === memberClass)
                if (classes) setOptions(classes.options)
            } else {
                setOptions(project.options)
            }
        })

        return () => fetchOptions()

    }, [mode, props.projectId, userId, workspaceId])

    return (
        <section
            className={"w-[90%] max-w-[1000px] p-10 pt-4 mt-30 rounded-xl shadow-lg mx-auto bg-white/60"}>
            <div
                className={"flex justify-between"}>
                <h1
                    className={"font-semibold mb-0.5 text-black/46"}>
                    Create a new entry
                </h1>
                <div
                    className={"flex gap-2.5"}
                >
                    <button
                        onClick={() => router.push(`/stats/${props.projectId}`)}
                        className={`${userRole === "Member" ? "hidden" : "block"}
                        text-xl text-black/35 hover:text-black/50 duration-250 ease-in cursor-pointer`}>
                        <RiBarChart2Fill/>
                    </button>
                    <button
                        onClick={() => router.push(`/workspaces/settings/projects/${props.projectId}`)}
                        className={`${userRole === "Member" ? "hidden" : "block"}
                        text-xl text-black/35 hover:text-black/50 hover:rotate-180 duration-250 ease-in cursor-pointer`}>
                        <RiSettings3Fill/>
                    </button>
                </div>
            </div>
            <form
                onSubmit={createSection}
                className={"p-6 rounded-xl bg-black/6 flex flex-col justify-between gap-8 items-start mx-auto"}>
                {/* Main inputs Section */}
                <div
                    className={"w-full flex justify-start gap-10 flex-wrap"}>
                    {/* Type of Work */}
                    <div
                        className={"flex flex-col"}>
                        <label htmlFor="task-type" className={"font-semibold text-black/60"}>Type of task</label>
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
                               className={"font-semibold text-black/60"}>Name/Description</label>
                        <input onChange={e => setNameValue(e.target.value)}
                               value={nameValue}
                               id={"name-description"} type="text" placeholder={"What are you going to work on?"}
                               className={"border border-black/20 w-[300px] focus:outline-vibrant-purple-600 p-1 px-2 rounded-md bg-white"}/>
                    </div>
                    {/* Decimal time input */}
                    <div
                        className={`${timeFormat === "Decimal" ? "flex" : "hidden"} flex-col`}>
                        <label htmlFor="time" className={"font-semibold text-black/60"}>Hours</label>
                        <input
                            id="time"
                            min={0.25}
                            max={24}
                            step={0.25}
                            value={timeInputValue}
                            onChange={(e) => setTimeInputValue(Number(e.target.value))}
                            type={"number"}
                            placeholder={"0.25"}
                            className={"border border-black/20 text-sm focus:outline-vibrant-purple-600 p-1.5 px-2 rounded-md bg-white"}/>
                    </div>
                    {/* Range time inputs */}
                    <div
                        className={`${timeFormat === "Range" ? "flex" : "hidden"} flex gap-6`}>
                        <div
                            className={"flex flex-col"}>
                            <label htmlFor="time" className={"font-semibold text-black/60"}>From</label>
                            <input
                                id="time"
                                type={"time"}
                                value={fromTime}
                                onChange={(e) => {
                                    setFromTime(e.target.value)
                                    setTimeDifference(e.target.value, toTime)
                                }}
                                className={"border border-black/20 text-sm focus:outline-vibrant-purple-600 p-1.5 px-2 rounded-md bg-white"}/>
                        </div>
                        <div
                            className={"flex flex-col"}>
                            <label htmlFor="time" className={"font-semibold text-black/60"}>To</label>
                            <input
                                id="time"
                                type={"time"}
                                value={toTime}
                                onChange={(e) => {
                                    setTimeDifference(fromTime, e.target.value)
                                }}
                                className={"border border-black/20 text-sm focus:outline-vibrant-purple-600 p-1.5 px-2 rounded-md bg-white"}/>
                        </div>
                    </div>
                    {/*  Date  */}
                    <div
                        className={"flex flex-col"}>
                        <label className={"font-semibold text-black/60"}>Date</label>
                        <MaxDateCalendarInput
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                        />
                    </div>
                    {/* Custom input */}
                    <div
                        className={`${taskType === "custom" ? "flex  flex-col" : "hidden"}`}>
                        <label htmlFor="name-description" className={"font-semibold text-black/60"}>Custom Type of
                            task</label>
                        <input
                            onChange={(e) => setCustomType(e.target.value)}
                            id={"name-description"} type="text" placeholder={"Write your custom type..."}
                            className={"border border-black/20 w-[300px] focus:outline-vibrant-purple-600 p-1 px-2 rounded-md bg-white"}/>
                    </div>
                </div>
                {/* Custom type Section */}
                {/*Submit Button*/}
                <button
                    type={"submit"}
                    disabled={isButtonDisabled()}
                    className={`${isButtonDisabled() ? "bg-black/40  border text-white/80" : "main-button"}
                         px-5 py-2 mt-4 text-sm font-semibold rounded-md text-white duration-100`}>
                    Create entry
                </button>
            </form>
            <InformativeModal setIsModalOpen={setIsMaxTimeModalOpen} isModalOpen={isMaxTimeModalOpen}
                              title={"You can't track more than 24 hours a day."}/>
        </section>
    )
}