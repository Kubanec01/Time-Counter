'use client'

import {Project} from "@/types";
import {collection, doc, onSnapshot} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import RenameModal from "@/components/modals/RenameModal";
import {editProjectName} from "@/features/utilities/edit/editProjectName";
import DeleteModal from "@/components/modals/DeleteModal";
import {deleteProjectCascade} from "@/features/utilities/delete/deleteProjectCascade";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useMounted} from "@/features/hooks/useMounted";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";
import {useRouter} from "next/navigation";
import {ProjectBar} from "@/components/ProjectBar/ProjectBar";
import {db} from "@/app/firebase/config";


const ProjectsBars = () => {

    // States
    const [projectsData, setProjectsData] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

    const {mode, workspaceId, userId} = useWorkSpaceContext()
    const mounted = useMounted()


    // Fetch Projects
    useEffect(() => {

        if (!userId) return;
        const userRef = collection(db, "realms", workspaceId, "projects")

        const fetchProjects = onSnapshot(userRef, (snap) => {
            const projects = snap.docs.map(doc => doc.data()) as Project[];
            setProjectsData(projects)
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
                                <ProjectBar
                                    key={p.projectId}
                                    projectId={p.projectId}
                                    title={p.title}
                                    projectTotalTimeString={formatSecondsToTimeString(p.totalTime)}
                                    membersValue={Object.keys(p.membersList).length}
                                    workspaceId={workspaceId}
                                    userId={userId}
                                />
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
                                inputPlaceholder={"What is new project edit-name?"}
                                title={"Rename project?"}
                                desc={"You can rename your project anytime, anywhere. But remember - the edit-name must contain a maximum of 24 characters."}
                                formFunction={setProjectName}/>
                        </>
                        :
                        <>
                            <h1 className="text-custom-gray-600 text-center text-lg mt-24">You have no projects created
                                0.o</h1>
                        </>
                    }
                </ul>
            </div>
        </>
    );
};

export default ProjectsBars;
