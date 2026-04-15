import {useEffect} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useProjectData} from "@/features/hooks/useProjectData";
import {useRouter} from "next/navigation";
import {mainHomePageUrlPath} from "@/data/Url_Paths/urlPaths";


export const useRequiredProject = (projectId: string) => {

    const {workspaceId} = useWorkSpaceContext()
    const {status, ...rest} = useProjectData(workspaceId, projectId)
    const router = useRouter()

    useEffect(() => {

        if (status === 'not-found') router.replace(mainHomePageUrlPath)

    }, [router, status])

    return {status, rest}

}