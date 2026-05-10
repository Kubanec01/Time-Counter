
import {NavButton} from "@/app/workspaces/settings/components/buttons/NavButton";
import {mainHomePageUrlPath} from "@/data/Url_Paths/urlPaths";
import {useJoinToWorkspace} from "@/features/hooks/useJoinToWorkspace";
import {WorkspacesListItem} from "@/types";
import {useRouter} from "next/navigation";

type WorkspacesListProps = {
    workspacesList: WorkspacesListItem[]
    userId: string | undefined
}

const WorkspacesList = ({...props}: WorkspacesListProps) => {

    const {joinToWorkspace} = useJoinToWorkspace()
    const router = useRouter()

    const isWorkspacesListEmpty = props.workspacesList.length === 0 || !props.workspacesList

    const handleJoinToWorkspace = async (workspaceId: string, password: string) => {
        joinToWorkspace(props.userId, workspaceId, password)
            .then(() => router.replace(mainHomePageUrlPath))
            .catch(error => console.error(error))
    }

    return (
        <div>
            <ul
            className={`${isWorkspacesListEmpty ? 'hidden' : 'block'}`}>
                {props.workspacesList.map((workspace, index) => (
                    <NavButton
                        key={`${workspace.workspaceId}_${index}`}
                        id={`${workspace.workspaceId}_${index}`}
                        title={workspace.workspaceId}
                        specSubtitle={'Join to workspace to view your workspace profile.'}
                        navLink={mainHomePageUrlPath}
                        onClickFn={() => handleJoinToWorkspace(workspace.workspaceId, workspace.password)}
                        bulletPoint={'inactive'}/>
                ))}
            </ul>
            <h1
            className={`${isWorkspacesListEmpty ? 'block' : 'hidden'} w-full mt-16 text-black/50 flex items-center justify-center`}>
                No workspaces found 0.o
            </h1>
        </div>
    )
}

export default WorkspacesList