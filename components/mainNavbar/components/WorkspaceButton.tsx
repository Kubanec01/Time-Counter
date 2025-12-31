import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {RiTeamFill, RiUserReceived2Fill} from "react-icons/ri";


export const WorkspaceButton = (
    {setIsModalOpen}: { setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }
) => {

    const {mode} = useWorkSpaceContext()
    const {replace} = useReplaceRouteLink()

    const handleClick = () => {
        if (mode === "solo") {
            replace("/workplaces")
        } else setIsModalOpen(true)
    }

    return (
        <button
            onClick={() => handleClick()}
            className={"w-full flex items-center gap-2 text-white text-sm bg-linear-to-b from-vibrant-purple-500 to-vibrant-purple-700 " +
                "hover:from-vibrant-purple-400 duration-100 ease-in p-2 rounded-md cursor-pointer"}>
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