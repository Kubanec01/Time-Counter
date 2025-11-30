"use client";

import CreateProjectModal from "@/components/modals/CreateProjectModal";
import ProjectsBars from "@/components/ProjectsBars";
import React, {useEffect, useState} from "react";
import {db} from "@/app/firebase/config";
import {doc, getDoc} from "firebase/firestore";
import {useGetUserDatabase} from "@/features/hooks/useGetUserDatabase";
import {Project} from "@/types";
import Navbar from "@/components/Navbar";
import {createNewProject} from "@/features/utilities/createNewProject";
import {useAuthRedirect} from "@/features/hooks/useAuthRedirect";

export default function HomePage() {

    // User Auth Redirect
    useAuthRedirect()

    // User Data
    const {userRef, userId} = useGetUserDatabase()


    //   States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [projectsTitles, setProjectsTitles] = useState<Project[]>([]);


    // Create New project
    const setNewProject = (e: React.FormEvent<HTMLFormElement>) => {
        createNewProject(e, userRef, inputValue);
        setInputValue("");
        setIsModalOpen(false);
    }

    // Fetch Projects titles
    useEffect(() => {
        if (!userId) return

        const getProjectsTitles = async () => {
            const userRef = doc(db, "users", userId)
            const userSnap = await getDoc(userRef)
            if (!userSnap.exists()) return
            const data = userSnap.data()
            const projects: Project[] = data.projects || []

            setProjectsTitles(projects)
        }

        getProjectsTitles()

    }, [userId]);


    return (
        <>
            <Navbar projects={projectsTitles}/>
            {/*Projects Hero*/}
            <section
                className={"flex justify-between  items-center w-[90%] max-w-[1144px] mt-[180px] mx-auto border-b-2 border-gray-200 px-[94px]"}
            >
                {/*Left Side*/}
                <div
                    className={`flex items-center justify-center`}>
                    <h1
                        className={"text-[48px] font-medium"}
                    >Projects</h1>
                    <p
                        className={"text-base text-custom-gray-800 font-medium -mb-4 ml-4"}>
                        See all started projects</p>
                </div>
                <div
                    className={`flex items-center justify-center`}>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={"text-base px-[20px] py-3.5 text-white hover:text-black" +
                            " bg-black hover:bg-white border-2 cursor-pointer duration-150 ease-in-out border-black rounded-[1000px] font-medium"}>
                        Create project
                    </button>
                    <p
                        className={"text-base text-custom-gray-800 font-medium -mb-4 ml-4"}>
                        And build what moves you</p>
                </div>
                <CreateProjectModal
                    title="Project"
                    setIsModalOpen={setIsModalOpen}
                    isModalOpen={isModalOpen}
                    setInputValue={setInputValue}
                    inputValue={inputValue}
                    formFunction={setNewProject}
                />
            </section>
            <ProjectsBars/>
        </>
    );
}
