'use client'

import {NavButton} from "@/app/workspaces/settings/components/buttons/NavButton";
import {useParams} from "next/navigation";


export const ProjectName = () => {

    const projectId = useParams().id

    return (
        <NavButton
            id={"project-name"}
            title={"Edit project name"}
            specSubtitle={"Changing the project name will not affect any access or functionality. You can change the name at any time without any restrictions."}
            navLink={`/workspaces/settings/project/edit-project-name/${projectId}`}
        />
    )
}