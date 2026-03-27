"use client";

import ProjectsBars from "@/components/ProjectsBars/ProjectsBars";
import React, {useEffect, useState} from "react";
import {ProjectType} from "@/types";
import {useAuthRedirect} from "@/features/hooks/useAuthRedirect";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {LoadingPage} from "@/app/LoadingPage/LoadingPage";
import {OnboardingModal} from "@/components/modals/OnboardingModal";
import {createNewProject} from "@/features/utilities/create-&-update/createNewProject";
import LoginWorkspacesPage from "@/app/workspaces/page";
import {createPortal} from "react-dom";
import CreateModal from "@/components/modals01/CreateModal";
import {TextInput} from "@/components/TextInput/TextInput";
import {MediumButton} from "@/components/MediumButton/MediumButton";

export default function HomePage() {

    // States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState<string>("");
    const [typeofProject, setTypeOfProject] = useState<ProjectType>("tracking");
    const [isClient, setIsClient] = useState<boolean>(false);

    // Hooks
    const {user, loading} = useAuthRedirect()
    const {mode, workspaceId, userRole, userId} = useWorkSpaceContext()
    const isUserMember = userRole === "Member"


    // Functions
    const setNewProject = async () => {
        if (newProjectName.trim().length === 0) return

        setIsModalOpen(false);
        await createNewProject(userId, newProjectName, typeofProject, workspaceId);
        setNewProjectName("");
        setTypeOfProject("tracking");
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setNewProjectName("")
        setTypeOfProject('tracking')
    }


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
                    <LoginWorkspacesPage/>
                </>
                :
                <>
                    <section
                        className={"relative w-full h-screen pt-[180px]"}
                    >

                        <span
                            className={"fixed top-0 left-0 w-full h-[25%] bg-linear-to-b from-gradient-purple to-transparent z-10"}/>
                        <span
                            className={"fixed bottom-0 left-0 w-full h-[12%] bg-linear-to-t from-gradient-green to-transparent z-50"}/>
                        {/*Projects Hero*/}
                        <div
                            className={"w-[90%] max-w-small mx-auto border-l flex flex-col justify-center items-start border-black/20 h-[600px] pl-7"}
                        >
                            <section
                                className={"flex justify-between items-center w-full border-b border-black/20"}
                            >
                                {/*Left Side*/}
                                <div
                                    className={`flex items-center justify-center`}>
                                    <h1
                                        className={"text-[48px]"}
                                    >Projects</h1>
                                    <p
                                        className={"text-base text-black/55 font-medium -mb-5.5 ml-3"}>
                                        See all started projects</p>
                                </div>
                                < div
                                    className={`${isUserMember ? "hidden" : "flex"} items-center justify-center`}>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={" large-button bg-purple-gradient z-10"}
                                    >
                                        Create project
                                    </button>
                                </div>
                                {createPortal(
                                    <CreateModal
                                        iconClassName={"text-vibrant-purple-700"}
                                        className={"w-[370px] h-[400px]"}
                                        title={"Create New Project"}
                                        description={"Create a new project where you can measure progress, time, performance, and simply everything that will move your work to the speed of light! (max 24 characters)"}
                                        isOpen={isModalOpen}
                                        confirmBtnText={"Create"}
                                        onSubmit={() => setNewProject()}
                                        cancelButtonFn={() => closeModal()}
                                    >
                                        <div
                                            className={"flex flex-col mb-6 gap-2"}
                                        >
                                            <TextInput
                                                inputId={"project-name-input"}
                                                placeholder={"What are you going to work on?"}
                                                value={newProjectName}
                                                OnChange={(value) => setNewProjectName(value)}
                                                isIconVisible={false}
                                                inputClassname={"mb-2"}
                                            />
                                            <MediumButton
                                                buttonType={'button'}
                                                disabled={typeofProject === 'tracking'}
                                                className={typeofProject === 'tracking' ? "bg-purple-gradient hover:bg-vibrant-purple-600 cursor-default" : "bg-black/10 text-black/60 border-black/1"}
                                                onClick={() => setTypeOfProject("tracking")}
                                            >
                                                {'I will track with timer'}
                                            </MediumButton>
                                            <MediumButton
                                                buttonType={'button'}
                                                className={typeofProject === 'tracking' ? "bg-black/10 text-black/60 border-black/1" : "bg-purple-gradient hover:bg-vibrant-purple-600 cursor-default"}
                                                onClick={() => setTypeOfProject("logging")}
                                            >
                                                {'I will enter time manually'}
                                            </MediumButton>
                                        </div>
                                    </CreateModal>,
                                    document.body
                                )}
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
