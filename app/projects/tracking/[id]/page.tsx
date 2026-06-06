"use client";

import {useParams} from "next/navigation";
import {useGetProjectName} from "@/features/hooks/useGetProjectName";
import TrackingProjectCart from "./components/projectCart/TrackingProjectCart";
import {seoTitle} from "@/app/config/seo.title";


const TrackingProjectPage = () => {
    const {id} = useParams();
    if (id === undefined) {
        throw new Error("No project id found.");
    }


    const projectId = id.toString()
    const {projectName} = useGetProjectName(projectId)

    return (
        <>
            <title>{seoTitle.projectPage(projectName).title}</title>
            <TrackingProjectCart projectId={projectId} projectName={projectName}/>
        </>
    );
};

export default TrackingProjectPage;
