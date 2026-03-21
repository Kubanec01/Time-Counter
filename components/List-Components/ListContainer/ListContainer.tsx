import React, {JSX} from "react";
import ListHeader from "@/components/List-Components/ListHeader/ListHeader";
import {twMerge} from "tailwind-merge";


type ListContainerProps = {
    children: JSX.Element
    headerTitles: string[]
    containerClassname?: string
    headerClassname?: string
    headerTitleClassname?: string
}

const ListContainer = ({...props}: ListContainerProps) => {

    const containerClass = "w-full rounded-md mx-auto flex flex-col bg-black/18"

    return (
        <section
            className={twMerge(containerClass, props.containerClassname)}
        >
            <ListHeader
                headerClassname={props.headerClassname}
                titlesClassname={props.headerTitleClassname}
                titles={props.headerTitles}
            />
            <section
                className={"p-1"}>
                {props.children}
            </section>
        </section>
    )

}

export default ListContainer;