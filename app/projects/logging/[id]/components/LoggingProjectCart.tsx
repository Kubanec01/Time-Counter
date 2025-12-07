'use client'

import {LoggingType, ProjectProps, Section} from "@/types";
import ProjectCartNavbar from "@/components/ProjectCartNavbar";
import CreateLoggingModal from "@/app/projects/logging/[id]/components/createLoggingModal/CreateLoggingModal";
import React, {useEffect, useState} from "react";
import {createNewSection} from "@/features/utilities/createNewSection";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "@/app/firebase/config";
import {doc, onSnapshot} from "firebase/firestore";
import {deleteAllSectionData} from "@/features/utilities/deleteAllSectionData";
import {formatSecondsToTimeString} from "@/features/hooks/timeOperations";
import {setProjectTotalTime, setProjectTotalTimeWithoutSectionId} from "@/features/utilities/totalTime";


export const LoggingProjectCart = ({...props}: ProjectProps) => {

    // States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loggingCategory, setLoggingCategory] = useState<LoggingType>("Work")
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
    const [inputValue, setInputValue] = useState("");
    const [timeInputValue, setTimeInputValue] = useState("0.25");
    const [sections, setSections] = useState<Section[]>([]);

    // User Auth
    const [user] = useAuthState(auth)
    const userId = user?.uid

    const createSection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const time = formatSecondsToTimeString(Number(timeInputValue) * 3600)
        console.log(time)

        await createNewSection(e, userId, props.projectId, inputValue, time, setInputValue, setIsInfoModalOpen, loggingCategory)
        await setProjectTotalTimeWithoutSectionId(userId, props.projectId, time)
        setIsCreateModalOpen(false)
        setLoggingCategory("Work")
        setTimeInputValue("0.25")
    }

    useEffect(() => {
        if (!userId) return

        const userRef = doc(db, "users", userId)

        const fetchSectionsData = onSnapshot(userRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const sections: Section[] = data.projectsSections || []

            if (!sections) throw new Error("Failed fetch Sections Data")

            const currSections = sections.filter((s: Section) => s.projectId === props.projectId)
            setSections(currSections)
        })

        return () => fetchSectionsData()

    }, [props.projectId, userId])


    return (
        <>
            <ProjectCartNavbar projectName={props.projectName}/>
            <section
                className={"mt-[200px] w-[90%] max-w-[776px] flex justify-center mx-auto border-b-2 border-custom-gray-600"}>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className={"bg-pastel-green-800 text-white py-2 px-[22px] rounded-[100px] mb-[8px] cursor-pointer"}>
                    What do you want to work on?
                </button>
            </section>
            <section
                className={"w-[90%] max-w-[776px] mx-auto mt-10 flex flex-col gap-4"}>
                {sections.map((s, index) => (
                    <div key={index}
                         className={"w-full h-[60px] rounded-[100] border flex justify-between items-center px-4"}>
                        <h1>{s.title}</h1>
                        <h2>{s.category}</h2>
                        <span>{s.time}</span>
                        <button
                            onClick={() => deleteAllSectionData(userId, props.projectId, s.sectionId)}>
                            Delete
                        </button>
                    </div>
                ))}
            </section>
            <CreateLoggingModal
                title={"Create new logging?"}
                desc={"Select a task type, name, and enter the time in decimal notation."}
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
                setLoggingType={setLoggingCategory}
                inputValue={inputValue}
                setInputValue={setInputValue}
                formFunction={createSection}
                timeInputValue={timeInputValue}
                setTimeInputValue={setTimeInputValue}
            />
        </>
    )
}

