import React, {JSX} from "react";
import {twMerge} from "tailwind-merge";

type EntryCreatorPanelProps = {
    title?: string
    titleClassname?: string
    buttonsSectionChildren?: JXS.Element
    children: JSX.Element
    mainBodyClassname?: string
    panelBodyClassname?: string
}

export const EntryCreatorPanel = ({...props}: EntryCreatorPanelProps) => {

    const mainBodyClass = "pb-6 pt-10 mt-8 bg-radial from-vibrant-purple-700/30 to-white to-70% w-[90%] max-w-medium mx-auto"
    const titleClass = "mb-0.5 text-black/60 text-md font-medium"
    const panelBodyClass = "w-full p-8 rounded-xl shadow-lg mx-auto bg-white border border-black/5"
    const panelContentClass = "rounded-xl bg-black/4 mx-auto"

    return (
        <div className={twMerge(mainBodyClass, props.mainBodyClassname)}>
            <section
                className={"w-full flex items-center justify-between px-8 pb-2"}>
                <h1
                    className={twMerge(titleClass, props.titleClassname)}>
                    {props.title}
                </h1>
                {props.buttonsSectionChildren}
            </section>
            <section
                className={twMerge(panelBodyClass, props.panelBodyClassname)}>
                <div
                    className={panelContentClass}>
                    {props.children}
                </div>
            </section>
        </div>
    )

}