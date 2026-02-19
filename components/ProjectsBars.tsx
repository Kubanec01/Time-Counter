'use client'

import {Member, Project, ProjectType} from "@/types";
import {onSnapshot} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import RenameModal from "@/components/modals/RenameModal";
import {editProjectName} from "@/features/utilities/edit/editProjectName";
import DeleteModal from "@/components/modals/DeleteModal";
import {deleteProjectCascade} from "@/features/utilities/delete/deleteProjectCascade";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {useMounted} from "@/features/hooks/useMounted";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";


const ProjectsBars = () => {

    // States
    const [projectsData, setProjectsData] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

    const {replace} = useReplaceRouteLink()
    const {mode, workspaceId,} = useWorkSpaceContext()
    const mounted = useMounted()


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

    if (!mounted) return null;

    return (
        <>
            <div
                className={"relative w-full flex flex-1 overflow-y-hidden"}
            >
                <span
                    className={"absolute top-0 left-0 w-[98%] h-10 bg-linear-to-b from-white from-25% z-10 to-transparent"}/>
                <span
                    className={"absolute bottom-0 left-0 w-[98%] h-10 bg-linear-to-t from-white from-20% z-40 to-transparent"}/>

                <ul className={"pb-[24px] pt-6 w-full overflow-y-auto"}>
                    {projectsData.length > 0 ?
                        <>
                            {projectsData.map((p: Project) => (
                                <li
                                    key={p.projectId}
                                    className={"cursor-pointer ease-in border mb-4 border-black/20 shadow-md rounded-xl" +
                                        " bg-linear-to-t from-black/2 to-white hover:from-black/4 duration-100 w-full flex items-center justify-between px-6 py-4"}
                                >
                                    <div
                                        className={"w-[30%]"}>
                                        <p
                                            className={"text-xs font-bold text-vibrant-purple-700"}
                                        >
                                            Project name
                                        </p>
                                        <h1
                                            className={"font-semibold break-all"}>
                                            {p.title}
                                        </h1>
                                    </div>
                                    <div
                                        className={""}>
                                        <p
                                            className={"text-xs font-bold text-black/50"}
                                        >
                                            Total time
                                        </p>
                                        <h1
                                            className={"font-semibold"}>
                                            {formatSecondsToTimeString(p.totalTime)}
                                        </h1>
                                    </div>
                                    <div
                                        className={""}>
                                        <p
                                            className={"text-xs font-bold text-black/50"}
                                        >
                                            Members
                                        </p>
                                        <h1
                                            className={"font-semibold"}>
                                            0
                                        </h1>
                                    </div>
                                    <h1
                                        className={"text-sm font-medium"}>
                                        {'Enter project >'}
                                    </h1>
                                </li>
                            ))}
                            <DeleteModal
                                setIsModalOpen={setIsDeleteModalOpen}
                                isModalOpen={isDeleteModalOpen}
                                title={"Delete project?"}
                                desc={"Are you sure you want to delete this project? This step is irreversible and everything stored in this project will be deleted."}
                                deleteBtnText={"Delete project"}
                                btnFunction={() => deleteProject(editingProjectId)}
                                topDistance={300}
                            />
                            <RenameModal
                                setIsModalOpen={setIsModalOpen}
                                isModalOpen={isModalOpen}
                                setInputValue={setInputValue}
                                inputValue={inputValue}
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
            </div>
        </>
    );
};

export default ProjectsBars;
