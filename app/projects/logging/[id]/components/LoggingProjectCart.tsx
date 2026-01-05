'use client'

import {LoggingType, Project, ProjectOption, ProjectProps, Section} from "@/types";
import ProjectCartNavbar from "@/components/ProjectCartNavbar";
import CreateLoggingModal from "@/app/projects/logging/[id]/components/createLoggingModal/CreateLoggingModal";
import React, {useEffect, useState} from "react";
import {createNewSection} from "@/features/utilities/create/createNewSection";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "@/app/firebase/config";
import {doc, onSnapshot} from "firebase/firestore";
import {deleteAllSectionData} from "@/features/utilities/delete/deleteAllSectionData";
import {formatSecondsToTimeString} from "@/features/hooks/timeOperations";
import {setProjectTotalTimeWithoutSectionId} from "@/features/utilities/time/totalTime";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {RiSettings3Fill} from "react-icons/ri";


export const LoggingProjectCart = ({...props}: ProjectProps) => {

    // States
    const [taskType, setTaskType] = useState<LoggingType>(null)
    const [customType, setCustomType] = useState<string>("")
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [options, setOptions] = useState<ProjectOption[]>([])
    const [nameValue, setNameValue] = useState("");
    const [timeInputValue, setTimeInputValue] = useState("0.25");
    const [sections, setSections] = useState<Section[]>([]);

    // User Auth
    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {mode, workspaceId, userName} = useWorkSpaceContext()

    const createSection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const time = formatSecondsToTimeString(Number(timeInputValue) * 3600)
        console.log(time)

        const newTaskType = taskType === "custom" ? customType : taskType

        await createNewSection(userId, userName, props.projectId, nameValue, time, setNameValue, setIsInfoModalOpen, newTaskType, mode, workspaceId)
        await setProjectTotalTimeWithoutSectionId(userId, props.projectId, time, mode, workspaceId)
        setNameValue("")
        setTaskType(null)
        setTimeInputValue("0.25")
    }

    const isButtonDisabled = () => {
        if (nameValue.trim() === "" || taskType === null || timeInputValue.trim() === "" ||
            (taskType === "custom" && customType?.trim() === "")) return true
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

            const currSections = sections.filter((s: Section) => s.projectId === props.projectId)
            setSections(currSections)
        })

        return () => fetchSectionsData()

    }, [mode, props.projectId, userId, workspaceId])

    // Fetch Options
    useEffect(() => {
        if (!userId) return

        const userRef = getFirestoreTargetRef(userId, mode, workspaceId)

        const fetchOptions = onSnapshot(userRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const project = data.projects.find((project: Project) => project.projectId === props.projectId)
            const options = project.options || []

            if (!options) throw new Error("Failed fetch Options Data")
            setOptions(options)
        })

        return () => fetchOptions()

    })

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
                    <button
                        className={"text-xl text-black/46 hover:rotate-180 duration-300 ease-in cursor-pointer"}>
                        <RiSettings3Fill/>
                    </button>
                </div>
                <form
                    onSubmit={createSection}
                    className={"p-6 rounded-xl bg-black/2 flex flex-col justify-between gap-8 items-start mx-auto"}>
                    {/* Main inputs Section */}
                    <div
                        className={"w-full flex justify-start gap-10"}>
                        {/* Type of Work */}
                        <div
                            className={"flex flex-col"}>
                            <label htmlFor="type-select" className={"font-bold"}>Type of task</label>
                            <select
                                value={taskType ?? ""}
                                onChange={(e) => setTaskType(e.target.value as LoggingType)}
                                id="task-type"
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
                            </select>
                        </div>
                        {/* Name/Description */}
                        <div
                            className={"flex flex-col"}>
                            <label htmlFor="name-description" className={"font-bold"}>Name/Description</label>
                            <input onChange={e => setNameValue(e.target.value)}
                                   value={nameValue}
                                   id={"name-description"} type="text" placeholder={"What are you going to work on?"}
                                   className={"border border-black/20 w-[300px] focus:outline-vibrant-purple-600 p-1 px-2 rounded-md bg-white"}/>
                        </div>
                        {/* Time */}
                        <div
                            className={"flex flex-col"}>
                            <label htmlFor="" className={"font-bold"}>Hours</label>
                            <input
                                min={0.25}
                                max={900}
                                step={0.25}
                                value={timeInputValue}
                                onChange={(e) => setTimeInputValue(e.target.value)}
                                type={"number"}
                                placeholder={"0.25"}
                                className={"border border-black/20 text-sm focus:outline-vibrant-purple-600 p-1.5 px-2 rounded-md bg-white"}/>
                        </div>
                    </div>
                    {/* Custom type Section */}
                    <div
                        className={`${taskType === "custom" ? "flex  flex-col" : "hidden"}`}>
                        <label htmlFor="name-description" className={"font-bold"}>Custom Type of task</label>
                        <input
                            onChange={(e) => setCustomType(e.target.value)}
                            id={"name-description"} type="text" placeholder={"Write your custom type..."}
                            className={"border border-black/20 w-[300px] focus:outline-vibrant-purple-600 p-1 px-2 rounded-md bg-white"}/>
                    </div>
                    {/*Submit Button*/}
                    <button
                        type={"submit"}
                        disabled={isButtonDisabled()}
                        className={`${isButtonDisabled() ? "bg-black/80  border text-white/80" : "main-button"}
                         px-5 py-2 mt-4 text-sm font-semibold rounded-md text-white duration-100`}>
                        Create entry
                    </button>
                </form>
            </section>
            <section
                className={"w-[90%] max-w-[776px] mx-auto mt-10 flex flex-col gap-4"}>
                {sections.map((s, index) => (
                    <div key={index}
                         className={"w-full h-[60px] rounded-[100] border flex justify-between items-center px-4"}>
                        <h1 className={"w-[25%]"}>{s.title}</h1>
                        <h2 className={"w-[25%]"}>{s.category}</h2>
                        <span className={"w-[25%]"}>{s.time}</span>
                        <button
                            className={"w-[25%]"}
                            onClick={() => deleteAllSectionData(userId, props.projectId, s.sectionId, mode, workspaceId)}>
                            Delete
                        </button>
                    </div>
                ))}
            </section>
        </>
    )
}