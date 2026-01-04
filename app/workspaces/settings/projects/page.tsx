'use client'


import {Project} from "@/types";
import {useEffect, useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {useRouter} from "next/navigation";

const WorkspaceProjectsPage = () => {

    const [projects, setProjects] = useState<Project[]>([]);
    const {workspaceId} = useWorkSpaceContext()
    const router = useRouter()

    // Fetch all projects
    useEffect(() => {
        if (!workspaceId) return
        const docRef = doc(db, "realms", workspaceId)

        const fetchProjects = onSnapshot(docRef, snap => {
            if (!snap.exists()) return
            const data = snap.data()
            const projects = data.projects || []
            setProjects(projects)
        })

        return () => fetchProjects()
    })

    return (
        <>
            <section
                className={"w-[90%] max-w-[700px] mx-auto h-[400px] mt-[200px]"}>
                <h1
                    className={"text-xl text-white/80 font-semibold border-b border-white/30"}
                >Workspace Projects</h1>
                <ul
                    className={"w-full p-4 pl-0 flex flex-col gap-3"}
                >
                    {projects.map((project: Project) => (
                        <li
                            onClick={() => router.push(`/workspaces/settings/projects/${project.projectId}`)}
                            key={project.projectId}
                            className={"text-white/80 text-lg font-medium px-2 py-2.5 border border-white/50 rounded-xl " +
                                "flex items-center justify-start gap-1 cursor-pointer hover:border-white/80 duration-100"}>
                            {project.title}
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}

export default WorkspaceProjectsPage