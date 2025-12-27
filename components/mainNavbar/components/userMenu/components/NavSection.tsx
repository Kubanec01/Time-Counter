import React, {ReactNode} from "react";

interface NavSectionProps {
    title: string;
    children: ReactNode;
}

export const NavSection = ({...props}: NavSectionProps) => {

    return (

        <div
            className={`w-full flex flex-col gap-2`}>
            <h1
                className={"text-custom-gray-700 text-xs"}>
                {props.title}</h1>
            {props.children}
        </div>
    )
}