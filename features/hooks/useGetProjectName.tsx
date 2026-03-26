import {useEffect, useState} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useProjectData} from "@/features/hooks/useProjectData";


export const useGetProjectName = (
    projectId: string,
) => {

    const [projectName, setProjectName] = useState("");
    const {workspaceId} = useWorkSpaceContext()
    const projectData = useProjectData(workspaceId, projectId)

    useEffect(() => {
        if (!projectData) return

        const fetchProjectName = () => setProjectName(projectData.title)

        fetchProjectName()

    }, [projectData]);

    return {projectName}

}