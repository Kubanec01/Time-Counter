import {useEffect, useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useProjectData} from "@/features/hooks/useProjectData";


export const useGetProjectName = (
    projectId: string,
) => {

    const [projectName, setProjectName] = useState("");
    const {workspaceId} = useWorkSpaceContext()
    const {project} = useProjectData(workspaceId, projectId)

    useEffect(() => {
        if (!project) return

        const fetchProjectName = () => setProjectName(project.title)

        fetchProjectName()

    }, [project]);

    return {projectName}

}