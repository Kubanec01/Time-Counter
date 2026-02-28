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
            {
                projects.map((project: Project) => (
                    <NavButton
                        key={project.projectId}
                        id={project.projectId}
                        navLink={`/workspaces/settings/projects/${project.projectId}`}
                        title={project.title}
                        specSubtitle={`${(project.type)[0].toUpperCase()}${(project.type).slice(1)} Project`}/>
                ))
            }
        </>
    )
}