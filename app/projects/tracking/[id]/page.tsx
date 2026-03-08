"use client";

import {useParams} from "next/navigation";
import {useGetProjectName} from "@/features/hooks/useGetProjectName";
import TrackingProjectCart from "./components/projectCart/TrackingProjectCart";


const TrackingProjectPage = () => {
    const {id} = useParams();
    if (id === undefined) {
        throw new Error("No project id found.");
    }


    const projectId = id.toString()
    const {projectName} = useGetProjectName(projectId)

    return (
        <TrackingProjectCart projectId={projectId} projectName={projectName}/>
    );
};

export default TrackingProjectPage;
