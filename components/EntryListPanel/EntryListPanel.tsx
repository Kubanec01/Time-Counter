import {twMerge} from "tailwind-merge";
import {JSX} from "react";

type ListPanelProps = {
    classname?: string;
    children: JSX.Element;
}

export const EntryListPanel = ({...props}: ListPanelProps) => {

    const panelClass = "w-[90%] max-w-medium border border-black/5 p-8 mx-auto flex items-center justify-center rounded-xl shadow-lg bg-white/60"

    return (
        <div
            className={twMerge(panelClass, props.classname)}
        >
            {props.children}
        </div>
    )
}