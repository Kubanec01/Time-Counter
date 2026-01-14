'use client'

import {LoggingType, Member, Project, ProjectOption, ProjectProps, Section, UserProjectOptions} from "@/types";
import ProjectCartNavbar from "@/components/ProjectCartNavbar";
import React, {useEffect, useState} from "react";
import {createNewSection} from "@/features/utilities/create/createNewSection";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {onSnapshot} from "firebase/firestore";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";
import {setProjectTotalTimeWithoutSectionId} from "@/features/utilities/time/totalTime";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {RiBarChart2Fill, RiFolderChartLine, RiSettings3Fill} from "react-icons/ri";
import {MaxDateCalendarInput} from "@/features/utilities/date/MaxDateCalendarInput";
import {useRouter} from "next/navigation";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";
import {addDays, subDays} from "date-fns";
import {formateDate} from "@/features/utilities/date/formateDate";
import {SectionCart} from "@/app/projects/logging/[id]/components/components/SectionCart";
import {updateTotalTrackedTime} from "@/features/utilities/edit/updateTotalTrackedTime";


export const LoggingProjectCart = ({...props}: ProjectProps) => {

    const currDate = new Date();

    // States
    const [taskType, setTaskType] = useState<LoggingType>(null)
    const [customType, setCustomType] = useState<string>("")
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [options, setOptions] = useState<ProjectOption[]>([])
    const [filteredMemberId, setFilteredMemberId] = useState<string | "all">("all")
    const [members, setMembers] = useState<Member[]>([])
    const [nameValue, setNameValue] = useState("");
    const [timeInputValue, setTimeInputValue] = useState("0.25");
    const [sections, setSections] = useState<Section[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(currDate);
    const [filteredDate, setFilteredDate] = useState<Date | null>(currDate);

    // User Auth
    const [user] = useAuthState(auth)
    const userId = user?.uid
    const router = useRouter()
    const {mode, workspaceId, userName, userSurname, userRole} = useWorkSpaceContext()

    const createSection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const time = formatSecondsToTimeString(Number(timeInputValue) * 3600)

        const newTaskType = taskType === "custom" ? customType : taskType

        const userFullName = `${userName} ${userSurname}`

        await createNewSection(userId, userFullName, props.projectId, nameValue, time, selectedDate, setNameValue, setIsInfoModalOpen, newTaskType, mode, workspaceId)
        await updateTotalTrackedTime(userId, props.projectId, selectedDate, time, mode, workspaceId)
        await setProjectTotalTimeWithoutSectionId(userId, props.projectId, time, mode, workspaceId)
        setNameValue("")
        setTaskType(null)
        setTimeInputValue("0.25")
    }

    const isButtonDisabled = () => {
        return nameValue.trim() === "" || taskType === null || timeInputValue.trim() === "" ||
            selectedDate === null || (taskType === "custom" && customType?.trim() === "");
    }

    const isPlusButtonDisabled = () => {
        if (selectedDate === null || filteredDate === null) return true
        else return (filteredDate.getDate() + 1) > currDate.getDate();
    }

    // Fetch Sections
    useEffect(() => {
        if (!userId) return

        const userRef = getFirestoreTargetRef(userId, mode, workspaceId)

        const fetchSectionsData = onSnapshot(userRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const sections: Section[] = data.projectsSections || []

            if (!sections) throw new Error("Failed fetch Sections Data")
            let currSections: Section[] = []

            if (userRole === "Member") {
                currSections = sections.filter((s: Section) => s.projectId === props.projectId && s.updateDate === formateDate(filteredDate) && s.userId === userId)
            } else if (filteredMemberId === "all") {
                currSections = sections.filter((s: Section) => s.projectId === props.projectId && s.updateDate === formateDate(filteredDate))
            } else {
                currSections = sections.filter((s: Section) => s.projectId === props.projectId && s.updateDate === formateDate(filteredDate) && s.userId === filteredMemberId)
            }

            setSections(currSections)
        })

        return () => fetchSectionsData()

    }, [filteredDate, filteredMemberId, mode, props.projectId, userId, userRole, workspaceId])

    // Fetch Options
    useEffect(() => {
        if (!userId) return

        const userRef = getFirestoreTargetRef(userId, mode, workspaceId)

        const fetchOptions = onSnapshot(userRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const project = data.projects.find((project: Project) => project.projectId === props.projectId)
            const customized = project.customizedUsersOptions ?? [];
            const userOptions = customized.find((o: UserProjectOptions) => o.userId === userId);
            const options = userOptions?.activeOptions ?? project.options;
            const members = data.members

            setMembers(members)
            if (!options) throw new Error("Failed fetch Options Data")
            setOptions(options)
        })

        return () => fetchOptions()

    }, [mode, props.projectId, userId, workspaceId])

    return (
        <>
            <ProjectCartNavbar projectName={props.projectName}/>
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
                        className={"w-full flex justify-start gap-10"}>
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
                        {/* Time */}
                        <div
                            className={"flex flex-col"}>
                            <label htmlFor="time" className={"font-semibold text-black/60"}>Hours</label>
                            <input
                                id="time"
                                min={0.25}
                                max={900}
                                step={0.25}
                                value={timeInputValue}
                                onChange={(e) => setTimeInputValue(e.target.value)}
                                type={"number"}
                                placeholder={"0.25"}
                                className={"border border-black/20 text-sm focus:outline-vibrant-purple-600 p-1.5 px-2 rounded-md bg-white"}/>
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
                    </div>
                    {/* Custom type Section */}
                    <div
                        className={`${taskType === "custom" ? "flex  flex-col" : "hidden"}`}>
                        <label htmlFor="name-description" className={"font-semibold text-black/60"}>Custom Type of
                            task</label>
                        <input
                            onChange={(e) => setCustomType(e.target.value)}
                            id={"name-description"} type="text" placeholder={"Write your custom type..."}
                            className={"border border-black/20 w-[300px] focus:outline-vibrant-purple-600 p-1 px-2 rounded-md bg-white"}/>
                    </div>
                    {/*Submit Button*/}
                    <button
                        type={"submit"}
                        disabled={isButtonDisabled()}
                        className={`${isButtonDisabled() ? "bg-black/40  border text-white/80" : "main-button"}
                         px-5 py-2 mt-4 text-sm font-semibold rounded-md text-white duration-100`}>
                        Create entry
                    </button>
                </form>
            </section>
            <section
                className={"w-[90%] max-w-[1000px] p-8 mx-auto mt-10 flex flex-col gap-4 rounded-xl shadow-lg bg-white/60"}>
                <div
                    className={"flex gap-3"}>
                    {mode === "solo" || userRole === "Member" &&
                        <>
                            <select
                                onChange={(event) => {
                                    const value = event.target.value as string | "all";
                                    setFilteredMemberId(value);
                                }}
                                className={`border border-black/20 outline-none px-2 h-8.5 w-[120px] text-sm rounded-md bg-white cursor-pointer`}>
                                <option value="all">All Users</option>
                                {members.map((mem) => (
                                    <option key={mem.userId} value={mem.userId}>
                                        {mem.name} {mem.surname}
                                    </option>
                                ))}
                            </select>
                        </>
                    }
                    {/* Minus date btn */}
                    <button
                        onClick={() => setFilteredDate(subDays(filteredDate ?? new Date(), 1))}
                        className={"border flex justify-center items-center px-2 rounded-md text-white bg-black/24 hover:bg-black/40 cursor-pointer"}>
                        <FaAngleLeft/>
                    </button>
                    <MaxDateCalendarInput
                        selectedDate={filteredDate}
                        setSelectedDate={setFilteredDate}
                    />
                    {/* Plus date btn */}
                    <button
                        onClick={() => setFilteredDate(addDays(filteredDate ?? new Date(), 1))}
                        disabled={isPlusButtonDisabled()}
                        className={`${isPlusButtonDisabled() ? "cursor-not-allowed" : "cursor-pointer hover:bg-black/40"}
                        er flex justify-center items-center px-2 rounded-md text-white bg-black/24`}>
                        <FaAngleRight/>
                    </button>
                </div>
                <section
                    className={"w-full rounded-md mx-auto flex flex-col bg-black/18"}>
                    <div
                        className={"w-full rounded-t-md bg-gradient-to-b from-vibrant-purple-500/80 to-vibrant-purple-600/85 text-white font-semibold flex justify-between items-center px-4 py-2"}>
                        <h1 className={"w-[25%] text-sm"}>Name</h1>
                        <h2 className={"w-[25%] text-sm"}>Type</h2>
                        <span className={"w-[25%] text-sm"}>Time</span>
                        <span className={"w-[25%] text-sm"}>Date</span>
                    </div>
                    <ul
                        className={"flex flex-col gap-1 p-1"}>
                        {sections.length > 0 ?
                            <>
                                {sections.map(s => (
                                    <SectionCart
                                        key={s.sectionId}
                                        userId={s.userId}
                                        projectId={props.projectId}
                                        sectionId={s.sectionId}
                                        title={s.title}
                                        time={s.time}
                                        userName={s.userName}
                                        category={s.category}
                                        updateDate={s.updateDate}
                                    />
                                ))}
                            </>
                            :
                            <>
                                <div
                                    className={"w-full bg-white rounded-md px-2 py-4 h-full flex items-center justify-center"}>
                                    <h1
                                        className={"text-black/50 text-sm font-medium"}>
                                        No tracks found 0.o
                                    </h1>
                                </div>
                            </>
                        }
                    </ul>
                </section>
            </section>
        </>
    )
}