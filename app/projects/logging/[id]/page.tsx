'use client'

import {LoggingProjectCart} from "@/app/projects/logging/[id]/components/LoggingProjectCart";
import {useParams} from "next/navigation";
import {useGetProjectName} from "@/features/utilities/useGetProjectName";


const LoggingProjectPage = () => {

    const {id} = useParams()
    if (id === undefined) {
        throw new Error("No project id found.");
    }
    const projectId = id.toString()
    const {projectName} = useGetProjectName(projectId)

    return (
        <LoggingProjectCart projectId={projectId} projectName={projectName}/>
    )
}

export default LoggingProjectPage