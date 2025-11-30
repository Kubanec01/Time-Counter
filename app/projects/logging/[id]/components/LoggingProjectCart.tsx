import {ProjectProps} from "@/types";
import ProjectCartNavbar from "@/components/ProjectCartNavbar";


export const LoggingProjectCart = ({...props}: ProjectProps) => {
    return (
        <>
            <ProjectCartNavbar projectName={props.projectName}/>
            <h1
                className={"mt-[300px] text-center"}
            >This is logging page for {props.projectName} id {props.projectId}</h1>
        </>
    )
}

