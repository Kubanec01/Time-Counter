import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {RiTeamFill, RiUserReceived2Fill} from "react-icons/ri";


export const WorkspaceButton = () => {

    const {mode, setMode, setWorkspaceId} = useWorkSpaceContext()
    const {replace} = useReplaceRouteLink()

    const handleClick = () => {
        if (mode === "solo") {
            replace("/workplaces")
        } else {
            setMode("solo")
            setWorkspaceId(null)
        }
    }

    return (
        <button
            onClick={() => handleClick()}
            className={"flex items-center gap-2 text-white text-sm bg-pastel-purple-800 p-2 rounded-md cursor-pointer"}>
            {
                mode === "solo"
                    ?
                    <>
                        <RiTeamFill/>
                        {"Workspaces"}
                    </>
                    :
                    <>
                        <RiUserReceived2Fill/>
                        {"Leave workspace"}
                    </>
            }
        </button>
    )
}