"use client";

import CreateProjectModal from "@/components/modals/CreateProjectModal";
import ProjectsBars from "@/components/ProjectsBars";
import React, {useEffect, useState} from "react";
import {ProjectType} from "@/types";
import {createNewProject} from "@/features/utilities/create/createNewProject";
import {useAuthRedirect} from "@/features/hooks/useAuthRedirect";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {createNewLoggingProject} from "@/features/utilities/create/createNewLoggingProject";
import WorkspacesPage from "@/app/workspaces/page";
import {LoadingPage} from "@/components/LoadingPage";
import {OnboardingModal} from "@/components/modals/OnboardingModal";

export default function HomePage() {

    // User Auth Redirect
    const {user, loading} = useAuthRedirect()

    // User Data
    const {mode, workspaceId, userRole} = useWorkSpaceContext()


    //   States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [typeofProject, setTypeOfProject] = useState<ProjectType>("tracking");
    const [isClient, setIsClient] = useState<boolean>(false);


    // Create New project
    const setNewProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (typeofProject === "tracking") await createNewProject(inputValue, typeofProject, workspaceId);
        if (typeofProject === "logging") await createNewLoggingProject(inputValue, typeofProject, workspaceId);
        setInputValue("");
        setIsModalOpen(false);
        setTypeOfProject("tracking");
    }

    const isUserMember = userRole === "Member"

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsClient(true)
    }, []);

    if ((loading || !user) || !isClient) return (
        <LoadingPage/>
    )

    return (
        <>
            <OnboardingModal/>
            {mode === "solo"
                ?
                <>
                    <WorkspacesPage/>
                </>
                :
                <>
                    <section
                        className={"relative w-full h-screen pt-[180px]"}
                    >

                        <span
                            className={"absolute top-0 left-0 w-full h-[20%] bg-linear-to-b from-gradient-purple to-transparent"}/>
                        <span
                            className={"absolute bottom-0 left-0 w-full h-[12%] bg-linear-to-t from-gradient-green to-transparent"}/>

                        {/*Projects Hero*/}
                        <div
                            className={"w-[90%] max-w-[790px] mx-auto border-l flex flex-col justify-center items-start border-black/20 h-[600px] pl-7"}
                        >
                            <section
                                className={"flex justify-between items-center w-full border-b border-black/20"}
                            >
                                {/*Left Side*/}
                                <div
                                    className={`flex items-center justify-center`}>
                                    <h1
                                        className={"text-[48px] font-semibold"}
                                    >Projects</h1>
                                    <p
                                        className={"text-base text-black/55 font-medium -mb-5.5 ml-3"}>
                                        See all started projects</p>
                                </div>
                                < div
                                    className={`${isUserMember ? "hidden" : "flex"} items-center justify-center`}>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={" large-button bg-purple-gradient"}
                                    >
                                        Create project
                                    </button>
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
                        </div>
                    </section>
                </>
            }
        </>
    )
        ;
}
