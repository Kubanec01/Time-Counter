'use client'

import {LoggingType, ProjectProps} from "@/types";
import ProjectCartNavbar from "@/components/ProjectCartNavbar";
import CreateLoggingModal from "@/app/projects/logging/[id]/components/createLoggingModal/CreateLoggingModal";
import React, {useState} from "react";
import {createNewSection} from "@/features/utilities/createNewSection";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";


export const LoggingProjectCart = ({...props}: ProjectProps) => {

    // States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loggingCategory, setLoggingCategory] = useState<LoggingType>(null)
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
    const [inputValue, setInputValue] = useState("");

    // User Auth
    const [user] = useAuthState(auth)
    const userId = user?.uid

    console.log(loggingCategory)
    console.log(inputValue)

    const createSection = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        createNewSection(e, userId, props.projectId, inputValue, setInputValue, setIsInfoModalOpen, loggingCategory)
        setIsCreateModalOpen(false)
    }


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
            <CreateLoggingModal
                title={"Create new logging?"}
                desc={"Choose a task type and name your log."}
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
                setLoggingType={setLoggingCategory}
                inputValue={inputValue}
                setInputValue={setInputValue}
                formFunction={createSection}
            />
        </>
    )
}

