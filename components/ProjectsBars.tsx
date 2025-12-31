'use client'

import {Project, ProjectType} from "@/types";
import {onSnapshot} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {HiOutlineMenuAlt3} from "react-icons/hi";
import {IoClose} from "react-icons/io5";
import {MdOutlineEdit} from "react-icons/md";
import {MdDeleteOutline} from "react-icons/md";
import RenameModal from "@/components/modals/RenameModal";
import {RiEditBoxFill} from "react-icons/ri";
import {editProjectName} from "@/features/utilities/edit/editProjectName";
import DeleteModal from "@/components/modals/DeleteModal";
import {deleteProjectCascade} from "@/features/utilities/delete/deleteProjectCascade";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {useMounted} from "@/features/hooks/useMounted";


const ProjectsBars = () => {

    // States
    const [projectsData, setProjectsData] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

    const {replace} = useReplaceRouteLink()
    const {mode, workspaceId, userRole} = useWorkSpaceContext()
    const mounted = useMounted()

    const isCurrProjectEditing = (projectId: string) => editingProjectId === projectId

    // User Data
    const [user] = useAuthState(auth)
    const userId = user?.uid


    // Fetch Projects
    useEffect(() => {

        if (!userId) return;
        const userRef = getFirestoreTargetRef(userId, mode, workspaceId);

        const fetchProjects = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setProjectsData(data.projects || []);
            } else {
                setProjectsData([]);
            }
        });

        return () => fetchProjects();
    }, [mode, userId, workspaceId]);


    const deleteProject = async (projectId: string | null) => {
        await deleteProjectCascade(userId, projectId, mode, workspaceId);

        setIsDeleteModalOpen(false);
        setEditingProjectId(null)
    }


    const setProjectName = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await editProjectName(userId, editingProjectId, inputValue, mode, workspaceId);
        setIsModalOpen(false)
        setInputValue("")
        setEditingProjectId(null)
    }

    const setProjectBarColor = (projectType: ProjectType) => {
        if (projectType === "tracking") return "bg-linear-to-br from-pastel-purple-600 to-pastel-purple-500/80"
        else return "bg-linear-to-br from-pastel-blue-700 to-pastel-blue-600/60"
    }

    if (!mounted) return null;

    return (
        <>
            <ul className={"w-[90%] max-w-[856px] pb-[24px] h-auto mx-auto mt-[64px] flex justify-center items-center flex-wrap gap-[56px]"}>
                {projectsData.length > 0 ?
                    <>
                        {projectsData.map((p: Project) => (
                            <li
                                key={p.projectId}
                                className={`${setProjectBarColor(p.type)}  duration-150 ease-in shadow-md hover:shadow-lg shadow-custom-gray-600/80 pt-13 px-3 pb-3 rounded-2xl w-[248px] h-[300px] relative`}>
                                <ul
                                    className={`
                                    ${(userRole === "Admin" || userRole === "Manager") ? "flex" : "hidden"} absolute top-3 right-3 px-3 py-2 
                                    rounded-full bg-black/75 backdrop-blur-md items-center gap-3 text-white/80 shadow-sm`}
                                >
                                    <li
                                        onClick={() => setIsDeleteModalOpen(isCurrProjectEditing(p.projectId))}
                                        className={`${isCurrProjectEditing(p.projectId) ? "block" : "hidden"} cursor-pointer hover:text-red-300 transition`}
                                    >
                                        <MdDeleteOutline/>
                                    </li>

                                    <li
                                        onClick={() => setIsModalOpen(isCurrProjectEditing(p.projectId))}
                                        className={`${isCurrProjectEditing(p.projectId) ? "block" : "hidden"} cursor-pointer hover:text-white transition`}
                                    >
                                        <MdOutlineEdit/>
                                    </li>

                                    <li
                                        onClick={() =>
                                            setEditingProjectId(prev => (prev === p.projectId ? null : p.projectId))
                                        }
                                        className="cursor-pointer hover:text-white transition"
                                    >
                                        {isCurrProjectEditing(p.projectId) ? <IoClose/> : <HiOutlineMenuAlt3/>}
                                    </li>
                                </ul>
                                {/* Body */}
                                <div className="h-full w-full rounded-2xl p-5 bg-black/85 flex flex-col items-start">
                                    <div className="flex-0 w-[90%] border-b border-white/20 pb-1.5">
                                        <h2 className="text-sm text-white/70 font-light -mb-0.5">
                                            Project name
                                        </h2>
                                        <h1 className="text-xl leading-tight font-semibold text-white break-words line-clamp-2">
                                            {p.title}
                                        </h1>
                                    </div>
                                    <div className="flex-1"/>
                                    <div className="flex-0 mb-3 w-[90%] border-b border-white/20">
                                        <h3 className="text-sm text-white/70 font-light -mb-0.5">
                                            Total time
                                        </h3>
                                        <span className="text-xl font-semibold text-white">
                                    {p.totalTime}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => replace(`/projects/${p.type}/${p.projectId}`)}
                                        className="mt-4 text-white text-sm hover:text-vibrant-purple-400 duration-100 ease-in mb-2 cursor-pointer"
                                    >
                                        {"Enter project >"}
                                    </button>
                                </div>
                            </li>
                        ))}
                        <DeleteModal
                            setIsModalOpen={setIsDeleteModalOpen}
                            isModalOpen={isDeleteModalOpen}
                            title={"Delete project?"}
                            desc={"Are you sure you want to delete this project? This step is irreversible and everything stored in this project will be deleted."}
                            deleteBtnText={"Delete project"}
                            btnFunction={() => deleteProject(editingProjectId)}
                            topDistance={"45%"}
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
                        <h1 className="text-custom-gray-600 text-lg mt-[20px]">You have no projects created
                            0.o</h1>
                    </>
                }
            </ul>

        </>
    );
};

export default ProjectsBars;
