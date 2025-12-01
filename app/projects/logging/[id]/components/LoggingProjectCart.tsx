'use client'

import {ProjectProps} from "@/types";
import ProjectCartNavbar from "@/components/ProjectCartNavbar";


export const LoggingProjectCart = ({...props}: ProjectProps) => {
    return (
        <>
            <ProjectCartNavbar projectName={props.projectName}/>
            <section
                className={"mt-[200px] w-[90%] max-w-[776px] flex justify-center mx-auto border-b-2 border-custom-gray-600"}>
                <button
                    className={"bg-pastel-green-800 text-white py-2 px-[22px] rounded-[100px] mb-[8px] cursor-pointer"}>
                    What do you want to work on?
                </button>
            </section>
        </>
    )
}

