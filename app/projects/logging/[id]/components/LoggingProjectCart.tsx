'use client'

import {ProjectProps} from "@/types";
import ProjectCartNavbar from "@/components/ProjectCartNavbar";
import {CreateEntrySection} from "@/app/projects/logging/[id]/components/components/CreateEntrySection";
import {ProjectSectionsSection} from "@/app/projects/logging/[id]/components/components/ProjectSectionsSection";


export const LoggingProjectCart = ({...props}: ProjectProps) => {


    return (
        <>
            <ProjectCartNavbar projectName={props.projectName}/>
            <CreateEntrySection
                projectId={props.projectId}
            />
            <ProjectSectionsSection
                projectId={props.projectId}
            />
        </>
    )
}