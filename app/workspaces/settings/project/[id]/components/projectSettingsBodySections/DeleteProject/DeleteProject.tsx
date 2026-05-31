import {DeleteButton} from "@/app/workspaces/settings/components/buttons/DeleteButton";
import {setProjectDeletePageUrlPath} from "@/data/Url_Paths/urlPaths";

const DeleteProject = ({projectId}: { projectId: string }) => {


    return (
        <DeleteButton
            id={'delete-project'}
            title={'Delete Project'}
            specSubtitle={'Deleting a project will remove all data associated with it. This action cannot be undone.'}
            navLink={setProjectDeletePageUrlPath(projectId)}/>
    )
}


export default DeleteProject