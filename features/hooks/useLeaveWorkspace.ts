import {useWorkSpaceContext} from "@/features/hooks/context/workspaceContext";
import {removeLocalStorageWorkspaceIdAndUserMode} from "@/features/utilities/local-storage/localStorage";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {mainHomePageUrlPath} from "@/data/Url_Paths/urlPaths";


export const useLeaveWorkspace = () => {

    const {setMode, setWorkspaceId,} = useWorkSpaceContext()
    const {replace} = useReplaceRouteLink()

    const leaveWorkspace = () => {
        setMode("solo")
        setWorkspaceId("unused")
        removeLocalStorageWorkspaceIdAndUserMode()
        replace(mainHomePageUrlPath)
    }

    return {leaveWorkspace}
}