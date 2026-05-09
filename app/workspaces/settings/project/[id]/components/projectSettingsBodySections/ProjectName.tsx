'use client'

import {NavButton} from "@/app/workspaces/settings/components/buttons/NavButton";
import {useParams} from "next/navigation";
import {editProjectNamePageUrlPath} from "@/data/Url_Paths/urlPaths";


export const ProjectName = () => {

    const projectId = useParams().id as string

    return (
        <NavButton
            bulletPoint={"inactive"}
            id={"project-name"}
            title={"Edit project name"}
            specSubtitle={"Changing the project name will not affect any access or functionality. You can change the name at any time without any restrictions."}
            navLink={editProjectNamePageUrlPath(projectId)}
        />
    )
}