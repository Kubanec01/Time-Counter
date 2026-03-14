import {useEffect, useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, getDoc} from "firebase/firestore";
import {documentNotFound} from "@/messages/errors";
import {NavButton} from "@/app/workspaces/settings/components/buttons/NavButton";
import {Project} from "@/types";


export const WorkspacesProjects = () => {

    const [projects, setProjects] = useState([]);

    const {workspaceId} = useWorkSpaceContext()


    useEffect(() => {
        if (workspaceId === "unused") return
        const fetchProjects = async () => {
            const docRef = doc(db, "realms", workspaceId)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) return console.error(documentNotFound)
            const data = docSnap.data()
            setProjects(data.projects)
        }
        fetchProjects()

    }, [workspaceId]);

    return (
        <>
            <div
                className={`${projects.length > 0 ? "hidden" : "block"} w-full`}>
                <h1
                    className={"text-center mt-10 text-sm text-black/40"}>
                    No projects found :/
                </h1>
            </div>
            <div
                className={`${projects.length > 0 ? "block" : "hidden"}`}>
                {
                    projects.map((project: Project) => (
                        <NavButton
                            bulletPoint={"active"}
                            key={project.projectId}
                            id={project.projectId}
                            navLink={`/workspaces/settings/project/${project.projectId}`}
                            title={project.title}
                            specSubtitle={`${(project.type)[0].toUpperCase()}${(project.type).slice(1)} Project`}/>
                    ))
                }
            </div>
        </>
    )
}