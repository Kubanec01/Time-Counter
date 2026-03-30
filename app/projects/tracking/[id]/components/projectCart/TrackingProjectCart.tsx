"use client";

import {ProjectProps} from "@/types";
import {ProjectHero} from "@/components/ProjectHero/ProjectHero";
import {ProjectSections} from "@/app/projects/tracking/[id]/components/ProjectSections";
import CreateEntrySection from "@/app/projects/tracking/[id]/components/CreateEntrySection";
import {LoadingPage} from "@/app/LoadingPage/LoadingPage";
import {useRequiredProject} from "@/features/hooks/useRequiredProject";

const TrackingProjectCart = ({...props}: ProjectProps) => {


    const {status} = useRequiredProject(props.projectId)

    if (!status || status === "loading") return <LoadingPage/>
    else if (status === "not-found") return null

    return (
        <>
            <ProjectHero
                projectSpec={"Tracking"}
                projectName={props.projectName}
            />
            <CreateEntrySection
                projectId={props.projectId}
            />
            <ProjectSections
                projectId={props.projectId}
            />
        </>
    );
};

export default TrackingProjectCart;
