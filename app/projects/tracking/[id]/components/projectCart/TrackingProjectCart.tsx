"use client";

import {ProjectProps} from "@/types";
import {ProjectHero} from "@/components/ProjectHero/ProjectHero";
import {ProjectSections} from "@/app/projects/tracking/[id]/components/ProjectSections";
import CreateEntrySection from "@/app/projects/tracking/[id]/components/CreateEntrySection";

const TrackingProjectCart = ({...props}: ProjectProps) => {


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
