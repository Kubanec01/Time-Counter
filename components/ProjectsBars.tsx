'use client'

import {Project, Section, TimeCheckout, UpdatedSectionByDate} from "@/types";
import {onSnapshot, updateDoc} from "firebase/firestore";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useGetUserDatabase} from "@/features/hooks/useGetUserDatabase";
import {HiOutlineMenuAlt3} from "react-icons/hi";
import {IoClose} from "react-icons/io5";
import {MdOutlineEdit} from "react-icons/md";
import {MdDeleteOutline} from "react-icons/md";
import RenameModal from "@/components/modals/RenameModal";
import {RiEditBoxFill} from "react-icons/ri";


const ProjectsBars = () => {

    // States
    const [projectsData, setProjectsData] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

    // User Data
    const {userRef, userId, userData} = useGetUserDatabase()

    // Fetch Projects
    useEffect(() => {

        if (!userRef) return;

        const fetchProjects = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setProjectsData(data.projects || []);
            } else {
                setProjectsData([]);
            }
        });

        return () => fetchProjects();
    }, [userId, userRef]);


    const deleteProject = async (projectId: string) => {

        if (!userRef || !userData) return

        // Data
        const projects = userData.projects || []
        const projectsSections = userData.projectsSections || [];
        const timeCheckouts = userData.timeCheckouts || [];
        const sectionsByDates = userData.updatedSectionsByDates || []

        // Updated Data
        const updatedProjects = projects.filter((p: Project) => p.projectId !== projectId);
        const updatedProjectsSections = projectsSections.filter((s: Section) => s.projectId !== projectId);
        const updatedTimeCheckouts = timeCheckouts.filter((t: TimeCheckout) => t.projectId !== projectId);
        const updatedSectionsByDates = sectionsByDates.filter((s: UpdatedSectionByDate) => s.projectId !== projectId);
        await updateDoc(userRef, {
            projects: updatedProjects,
            projectsSections: updatedProjectsSections,
            timeCheckouts: updatedTimeCheckouts,
            updatedSectionsByDates: updatedSectionsByDates
        });
    }


    const editProjectName = async (
        e: React.FormEvent<HTMLFormElement>,
        projectId: string) => {

        e.preventDefault()

        if (!userRef || !userData) return

        const projects = userData.projects || [];

        const updatedProjects = projects.map((p: Project) => {
            if (p.projectId !== projectId) return p
            return {...p, title: inputValue}
        })
        await updateDoc(userRef, {projects: updatedProjects})
    }


    return (
        <>
            <ul
                className={"w-[90%] max-w-[856px] h-auto mx-auto mt-[64px] flex justify-center items-center flex-wrap gap-[56px]"}
            >
                {projectsData.length > 0 ?
                    <>
                        {projectsData.map((p: Project) => (
                            <>
                                <li
                                    key={p.projectId}
                                    className={"px-5 pt-10 bg-pastel-pink-700 rounded-[8px] w-[248px] h-[330px] relative"}>
                                    <ul
                                        className={"absolute top-0 right-0 p-[14px] text-custom-gray-800 text-xl" +
                                            " flex items-center justify-center gap-[14px]"}
                                    >
                                        <li
                                            onClick={() => {
                                                deleteProject(p.projectId);
                                                setIsProjectMenuOpen(false)
                                            }}
                                            className={`${isProjectMenuOpen ? "block" : "hidden"} cursor-pointer`}
                                        >
                                            <MdDeleteOutline/>
                                        </li>
                                        <li
                                            onClick={() => {
                                                setIsModalOpen(true);
                                                setIsProjectMenuOpen(false)
                                            }}
                                            className={`${isProjectMenuOpen ? "block" : "hidden"} cursor-pointer`}
                                        >
                                            <MdOutlineEdit/>

                                        </li>
                                        <li
                                            onClick={() => setIsProjectMenuOpen(value => !value)}
                                            className={"cursor-pointer"}
                                        >
                                            {isProjectMenuOpen ?
                                                <IoClose/>
                                                :
                                                <HiOutlineMenuAlt3/>
                                            }
                                        </li>
                                    </ul>
                                    <h2 className={"text-base font-medium text-black"}>
                                        Project name:
                                    </h2>
                                    <h1 className={"text-[28px] leading-tight font-bold text-black w-[98%] -mt-1 border-b-2"}>
                                        {p.title}
                                    </h1>
                                    {/*Time*/}
                                    <div
                                        className={"mt-[28px] border-b-2"}
                                    >
                                        <h3 className={"text-[14px] font-medium text-black -mb-1"}>
                                            Total time:
                                        </h3>
                                        <span className={"text-[24px] leading-tight font-bold text-red w-[90%]"}>
                                            {p.totalTime}
                                        </span>
                                    </div>
                                    {/*Enter button*/}
                                    <Link
                                        href={`/projects/${p.projectId}`}
                                        className={"px-4 py-3 hover:-translate-x-1 duration-150 ease-in bg-black text-white text-sm rounded-[100px] mt-[44px] absolute " +
                                            "left-[20px] bottom-[40px] cursor-pointer"}>
                                        {"Enter project >"}
                                    </Link>
                                </li>
                                <RenameModal
                                    setIsModalOpen={setIsModalOpen}
                                    isModalOpen={isModalOpen}
                                    setInputValue={setInputValue}
                                    inputValue={inputValue}
                                    icon={<RiEditBoxFill/>}
                                    inputPlaceholder={"What is new project name?"}
                                    title={"Rename project?"}
                                    desc={"You can rename your project anytime, anywhere. But remember - the name must contain a maximum of 24 characters."}
                                    formFunction={(e) => editProjectName(e, p.projectId)}/>
                            </>
                        ))}
                    </>
                    :
                    <>
                        <h1 className="text-custom-gray-600 text-lg mt-[20px]">You have no projects created 0.o</h1>
                    </>
                }
            </ul>
        </>
    );
};

export default ProjectsBars;
