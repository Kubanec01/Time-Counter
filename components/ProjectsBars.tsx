'use client'

import {Project, ProjectType, Section, TimeCheckout, UpdatedSectionByDate} from "@/types";
import {getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useGetUserDatabase} from "@/features/hooks/useGetUserDatabase";
import {HiOutlineMenuAlt3} from "react-icons/hi";
import {IoClose} from "react-icons/io5";
import {MdOutlineEdit} from "react-icons/md";
import {MdDeleteOutline} from "react-icons/md";
import RenameModal from "@/components/modals/RenameModal";
import {RiEditBoxFill} from "react-icons/ri";
import {useRouter} from "next/navigation";
import {editProjectName} from "@/features/utilities/editProjectName";
import DeleteModal from "@/components/modals/DeleteModal";
import {deleteProjectCascade} from "@/features/utilities/deleteProjectCascade";
import {useReplaceRouteLink} from "@/features/utilities/useReplaceRouteLink";


const ProjectsBars = () => {

    // States
    const [projectsData, setProjectsData] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

    // Replace Route
    const {replace} = useReplaceRouteLink()

    const isCurrProjectEditing = (projectId: string) => editingProjectId === projectId

    // User Data
    const {userRef, userId} = useGetUserDatabase()

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


    const deleteProject = (projectId: string | null) => {
        deleteProjectCascade(userId, projectId);

        setIsDeleteModalOpen(false);
        setEditingProjectId(null)
    }


    const setProjectName = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        editProjectName(userId, editingProjectId, inputValue)
        setIsModalOpen(false)
        setInputValue("")
        setEditingProjectId(null)
    }

    const setProjectBarColor = (projectType: ProjectType) => {
        if (projectType === "tracking") return "bg-pastel-purple-500"
        else return "bg-pastel-blue-600"
    }

    return (
        <>
            <ul className={"w-[90%] max-w-[856px] pb-[24px] h-auto mx-auto mt-[64px] flex justify-center items-center flex-wrap gap-[56px]"}>
                {projectsData.length > 0 ?
                    <>
                        {projectsData.map((p: Project) => (
                            <li
                                key={p.projectId}
                                className={`${setProjectBarColor(p.type)} px-5 pt-10 rounded-[8px] w-[248px] h-[330px] relative`}>
                                <ul
                                    className={"absolute top-0 right-0 p-[14px] text-custom-gray-800 text-xl" +
                                        " flex items-center justify-center gap-[14px]"}
                                >
                                    {/*Delete Button*/}
                                    <li
                                        onClick={() => {
                                            setIsDeleteModalOpen(isCurrProjectEditing(p.projectId));
                                            // setIsProjectMenuOpen(false)
                                        }}
                                        className={`${isCurrProjectEditing(p.projectId) ? "block" : "hidden"} cursor-pointer`}
                                    >
                                        <MdDeleteOutline/>
                                    </li>
                                    {/*Edit Button*/}
                                    <li
                                        onClick={() => {
                                            setIsModalOpen(isCurrProjectEditing(p.projectId));
                                        }}
                                        className={`${isCurrProjectEditing((p.projectId)) ? "block" : "hidden"} cursor-pointer`}
                                    >
                                        <MdOutlineEdit/>

                                    </li>
                                    {/*Close & Open Button*/}
                                    <li
                                        onClick={() => {
                                            setEditingProjectId(prev => prev === p.projectId ? null : p.projectId)
                                        }}
                                        className={"cursor-pointer"}
                                    >
                                        {isCurrProjectEditing(p.projectId) ?
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
                                <button
                                    onClick={() => replace(`/projects/${p.type}/${p.projectId}`)}
                                    className={"px-4 py-3 hover:-translate-x-1 duration-150 ease-in bg-black text-white text-sm rounded-[100px] mt-[44px] absolute " +
                                        "left-[20px] bottom-[40px] cursor-pointer"}>
                                    {"Enter project >"}
                                </button>
                            </li>
                        ))}
                        <DeleteModal
                            setIsModalOpen={setIsDeleteModalOpen}
                            isModalOpen={isDeleteModalOpen}
                            title={"Delete project?"}
                            desc={"Are you sure you want to delete this project? This step is irreversible and everything stored in this project will be deleted."}
                            deleteBtnText={"Delete project"}
                            btnFunction={() => deleteProject(editingProjectId)}
                        />
                        <RenameModal
                            setIsModalOpen={setIsModalOpen}
                            isModalOpen={isModalOpen}
                            setInputValue={setInputValue}
                            inputValue={inputValue}
                            icon={<RiEditBoxFill/>}
                            inputPlaceholder={"What is new project name?"}
                            title={"Rename project?"}
                            desc={"You can rename your project anytime, anywhere. But remember - the name must contain a maximum of 24 characters."}
                            formFunction={setProjectName}/>
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
