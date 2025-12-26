import React, {ReactNode} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";

interface NavSectionProps {
    title: string;
    children: ReactNode;
}

export const NavSection = ({...props}: NavSectionProps) => {

    const {mode} = useWorkSpaceContext()

    return (

        <div
            className={`${mode === "solo" ? "" : "border border-custom-gray-800"} w-full px-1 py-1.5 rounded-md mt-3 flex flex-col gap-2 relative`}>
            <span
                className={"text-custom-gray-700 text-xs absolute -top-5 left-0"}>
                {props.title}</span>
            {props.children}
        </div>
    )
}