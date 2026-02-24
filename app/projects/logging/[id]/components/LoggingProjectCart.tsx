'use client'

import {ProjectProps} from "@/types";
import {CreateEntrySection} from "@/app/projects/logging/[id]/components/components/CreateEntrySection";
import {ProjectSectionsSection} from "@/app/projects/logging/[id]/components/components/ProjectSectionsSection";
import {ProjectHero} from "@/components/ProjectHero";


export const LoggingProjectCart = ({...props}: ProjectProps) => {


    return (
        <>
            {/*<ProjectCartNavbar projectName={props.projectName}/>*/}
            <ProjectHero
                projectSpec={"Logging"}
                projectName={props.projectName}
            />
            <CreateEntrySection
                projectId={props.projectId}
            />
            <ProjectSectionsSection
                projectId={props.projectId}
            />
        </>
    )
}