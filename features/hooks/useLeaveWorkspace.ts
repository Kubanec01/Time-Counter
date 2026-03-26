import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {removeLocalStorageWorkspaceIdAndUserMode} from "@/features/utilities/local-storage/localStorage";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";


export const useLeaveWorkspace = () => {

    const {setMode, setWorkspaceId,} = useWorkSpaceContext()
    const {replace} = useReplaceRouteLink()

    const leaveWorkspace = () => {
        setMode("solo")
        setWorkspaceId("unused")
        removeLocalStorageWorkspaceIdAndUserMode()
        replace("/")
    }

    return {leaveWorkspace}
}