"use client";

import CreateProjectModal from "@/components/modals/CreateProjectModal";
import ProjectsBars from "@/components/ProjectsBars";
import React, {useState} from "react";
import {auth} from "@/app/firebase/config";
import {ProjectType} from "@/types";
import {createNewProject} from "@/features/utilities/create/createNewProject";
import {useAuthRedirect} from "@/features/hooks/useAuthRedirect";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useAuthState} from "react-firebase-hooks/auth";

export default function HomePage() {

    // User Auth Redirect
    useAuthRedirect()

    // User Data
    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {mode, workspaceId, userRole} = useWorkSpaceContext()

    //   States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [typeofProject, setTypeOfProject] = useState<ProjectType>("tracking");


    // Create New project
    const setNewProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await createNewProject(userId, inputValue, typeofProject, mode, workspaceId);
        setInputValue("");
        setIsModalOpen(false);
        setTypeOfProject("tracking");
    }

    const isUserMember = userRole === "Member"


    return (
        <>
            {/*Projects Hero*/}
            <section
                className={"flex justify-between items-center w-[90%] max-w-[1144px] mt-[180px] mx-auto border-b-2 border-gray-200 px-[94px]"}
            >
                {/*Left Side*/}
                <div
                    className={`flex items-center justify-center`}>
                    <h1
                        className={"text-[48px] font-semibold"}
                    >Projects</h1>
                    <p
                        className={"text-base text-custom-gray-800 font-medium -mb-4 ml-4"}>
                        See all started projects</p>
                </div>
                < div
                    className={`${isUserMember ? "hidden" : "flex"} items-center justify-center`}>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={"text-base px-4 py-2.5 text-white bg-black hover:bg-linear-to-b from-vibrant-purple-600 to-vibrant-purple-700" +
                            " cursor-pointer duration-150 ease-in-out rounded-full font-medium"}>
                        Create project
                    </button>
                    <p
                        className={"text-base text-custom-gray-800 font-medium -mb-4 ml-4"}>
                        And build what moves you
                    </p>
                </div>
                {/*Modals*/}
                <CreateProjectModal
                    title="Project"
                    setIsModalOpen={setIsModalOpen}
                    isModalOpen={isModalOpen}
                    setInputValue={setInputValue}
                    inputValue={inputValue}
                    typeOfProject={typeofProject}
                    setTypeOfProject={setTypeOfProject}
                    formFunction={setNewProject}
                />
            </section>
            <ProjectsBars/>
        </>
    )
        ;
}
