import React from "react";
import {twMerge} from "tailwind-merge";

type NoResultBarProps = {
    label: string
    bodyClass?: string
    labelClass?: string
}

export const NoResultBar = ({...props}: NoResultBarProps) => {

    const sectionClass = "w-full h-full flex items-center justify-center"
    const textClass = "text-black/50 text-sm font-medium"

    return (
        <section
            className={twMerge(
                sectionClass,
                props.bodyClass,
            )}>
            <h1
                className={twMerge(
                    textClass,
                    props.labelClass,
                )}>
                {props.label}
            </h1>
        </section>
    )
}