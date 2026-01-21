'use client'

import {ProjectProps} from "@/types";
import ProjectCartNavbar from "@/components/ProjectCartNavbar";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {CreateEntrySection} from "@/app/projects/logging/[id]/components/components/CreateEntrySection";
import {ProjectSectionsSection} from "@/app/projects/logging/[id]/components/components/ProjectSectionsSection";


export const LoggingProjectCart = ({...props}: ProjectProps) => {

    const [user] = useAuthState(auth)
    const userId = user?.uid

    return (
        <>
            <ProjectCartNavbar projectName={props.projectName}/>
            <CreateEntrySection
                projectId={props.projectId}
                userId={userId}
            />
            <ProjectSectionsSection
                projectId={props.projectId}
                userId={userId}
            />
        </>
    )
}