import {twMerge} from "tailwind-merge";
import React, {JSX, ReactNode} from "react";
import {FaRegEdit} from "react-icons/fa";
import {FiTrash2} from "react-icons/fi";


type SectionCartProps = {
    sectionList: { id: string, content: JSX.Element | ReactNode }[]
    children?: JSX.Element | ReactNode;
    listClassName?: string;
    bodyClassname?: string;
    menuButtonsClassname?: string
    listItemClassName?: string;
}

const SectionCartContainer = ({...props}: SectionCartProps) => {

    const bodyClass = "w-full rounded-md bg-white text-black/70 text-sm font-medium items-center px-4 py-1.5 relative"
    const listClass = "w-full flex items-center justify-start"
    const listItemClass = `w-1/${props.sectionList.length}`
    const menuButtonClass = `text-sm text-black/40 cursor-pointer`

    return (
        <div
            className={twMerge(bodyClass, props.bodyClassname)}
        >
            <ul
                className={twMerge(listClass, props.listClassName)}
            >
                {props.sectionList.map(section => (
                    <li
                        key={section.id}
                        className={twMerge(listItemClass, props.listItemClassName)}
                    >
                        {section.content}
                    </li>
                ))}
            </ul>
            <section
                className={"absolute top-2.5 right-3.5 flex items-center justify-center gap-3.5"}>
                <button
                    className={twMerge(`${menuButtonClass} hover:text-vibrant-purple-500`, props.menuButtonsClassname)}
                >
                    <FaRegEdit/>
                </button>
                <button
                    className={twMerge(`${menuButtonClass} hover:text-red-300`, props.menuButtonsClassname)}
                >
                    <FiTrash2/>
                </button>
            </section>
            {props.children}
        </div>
    )
}

export default SectionCartContainer