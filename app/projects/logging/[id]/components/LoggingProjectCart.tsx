'use client'

import {ProjectProps} from "@/types";
import {CreateEntrySection} from "@/app/projects/logging/[id]/components/components/CreateEntrySection";
import {ProjectSectionsSection} from "@/app/projects/logging/[id]/components/components/ProjectSectionsSection";
import {ProjectHero} from "@/components/ProjectHero/ProjectHero";
import {LoadingPage} from "@/app/LoadingPage/LoadingPage";
import {useRequiredProject} from "@/features/hooks/useRequiredProject";


export const LoggingProjectCart = ({...props}: ProjectProps) => {

    const {status} = useRequiredProject(props.projectId)

    if (!status || status === 'loading') return <LoadingPage/>
    else if (status === 'not-found') return null

    return (
        <>
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