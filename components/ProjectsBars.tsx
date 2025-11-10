import {Project, Section, TimeCheckout} from "@/types";
import {onSnapshot, updateDoc} from "firebase/firestore";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import Modal from "@/components/Modal";
import {useGetUserDatabase} from "@/components/hooks/useGetUserDatabase";


const ProjectsBars = () => {

    // States
    const [projectsData, setProjectsData] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

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

        const projects = userData?.projects || []
        const projectsSections = userData?.projectsSections || [];
        const timeCheckouts = userData?.timeCheckouts || [];
        const updatedProjects = projects.filter((p: Project) => p.projectId !== projectId);
        const updatedProjectsSections = projectsSections.filter((s: Section) => s.projectId !== projectId);
        const updatedTimeCheckouts = timeCheckouts.filter((t: TimeCheckout) => t.projectId !== projectId);
        await updateDoc(userRef, {
            projects: updatedProjects,
            projectsSections: updatedProjectsSections,
            timeCheckouts: updatedTimeCheckouts
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
        <section className="w-full h-[60%] flex justify-center items-center gap-5">
            {projectsData.length < 1 ? (
                <h1 className="text-[#9e9e9e]">You have no projects created.</h1>
            ) : (
                projectsData.map((project) => (
                    <div
                        key={project.projectId}
                        className="border w-[300px] h-full rounded-2xl flex flex-col justify-center items-center"
                    >
                        <h1 className="mb-16 text-center text-2xl">{project.title}</h1>
                        <Link
                            href={`/projects/${project.projectId}`}
                            className=" text-base py-2 px-4 rounded-2xl cursor-pointer bg-blue-600 text-white">
                            Enter Project
                        </Link>
                        <ul
                            className={'mx-auto flex flex-col justify-between items-center gap-1 mt-2'}
                        >
                            <li>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-xl px-4 py-1 rounded-xl mt-4 text-black border cursor-pointer"
                                >
                                    Edit Name
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => deleteProject(project.projectId)}
                                    className="text-xl px-4 py-1 rounded-xl mt-4 bg-red-500 text-[white] cursor-pointer"
                                >
                                    Delete
                                </button>
                            </li>
                        </ul>
                        <Modal
                            setIsModalOpen={setIsModalOpen}
                            isModalOpen={isModalOpen}
                            setInputValue={setInputValue}
                            inputValue={inputValue}
                            title={"Enter New Project Name"}
                            formFunction={(e) => editProjectName(e, project.projectId)}/>
                    </div>
                ))
            )}
        </section>
    );
};

export default ProjectsBars;
