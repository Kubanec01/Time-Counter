import React from "react";
import {twMerge} from "tailwind-merge";

type ListHeaderProps = {
    titles: string[]
    titlesClassname?: string;
    headerClassname?: string;
}

const ListHeader = ({...props}: ListHeaderProps) => {

    const headerClass = "w-full px-4 py-2 text-sm rounded-t-md bg-gradient-to-b from-vibrant-purple-400 to-vibrant-purple-700 text-white flex justify-start items-center"
    const titleClass = `w-1/${props.titles.length}`

    const titleId = (id: string) => id.toLowerCase().replace(/ /g, "-")

    return (
        <ul
            className={twMerge(headerClass, props.headerClassname)}>
            {props.titles.map((title) => (
                <li
                    key={titleId(title)}
                    className={twMerge(titleClass, props.titlesClassname)}
                >
                    {title}
                </li>
            ))}
        </ul>
    )

}


export default ListHeader;