import {useEffect, useState} from "react";
import {useWorkSpaceContext} from "@/features/hooks/context/workspaceContext";
import {NavButton} from "@/app/workspaces/settings/components/buttons/NavButton";
import {Project} from "@/types";
import {getAllProjects} from "@/features/utilities/getAllProjects";
import {editProjectSettingsPageUrlPath} from "@/data/Url_Paths/urlPaths";


export const WorkspacesProjects = () => {

    const [projects, setProjects] = useState<Project[]>([]);

    const {workspaceId} = useWorkSpaceContext()


    useEffect(() => {
        if (workspaceId === "unused") return
        const fetchProjects = async () => {
            const projects = await getAllProjects(workspaceId)
            setProjects(projects)
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
                            navLink={editProjectSettingsPageUrlPath(project.projectId, project.type)}
                            title={project.title}
                            specSubtitle={`${(project.type)[0].toUpperCase()}${(project.type).slice(1)} Project`}/>
                    ))
                }
            </div>
        </>
    )
}