"use client";

import {useParams} from "next/navigation";
import ProjectCart from "./components/projectCart/ProjectCart";
import {useGetProjectName} from "@/features/utilities/useGetProjectName";


const ProjectPage = () => {
    const {id} = useParams();
    if (id === undefined) {
        throw new Error("No project id found.");
    }

    const projectId = id.toString()
    const {projectName} = useGetProjectName(projectId)

    return (
        <ProjectCart projectId={projectId} projectName={projectName}/>
    );
};

export default ProjectPage;
