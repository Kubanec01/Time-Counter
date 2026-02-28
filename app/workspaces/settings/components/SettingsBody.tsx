'use client'

import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {Dispatch, JSX, ReactNode, SetStateAction} from "react";

type SettingsBodyProps = {
    navbarLinks: { id: string, title: string }[]
    navTitle: JSX.Element | string
    children: JSX.Element | ReactNode
    primarySectionTitle: string
    setPrimarySectionTitleAction: Dispatch<SetStateAction<string>>;
    activeNavId: string
    setActiveNavIdAction: Dispatch<SetStateAction<string>>
}

export const SettingsBody = ({...props}: SettingsBodyProps) => {


    const {replace} = useReplaceRouteLink()

    const navLink = props.navbarLinks || []

    const navLinkBaseStyle = "flex items-center gap-1 text-black/50 cursor-pointer hover:text-black hover:translate-x-2 duration-150"
    const navLinkDotStyle = "text-4xl mb-0.5"

    return (
        <div
            className={"w-11/12 max-w-[900px] mx-auto mt-[200px] flex justify-between"}>
            {/*Nav Section*/}
            <section
                className={"pt-10 w-[22%]"}>
                <div
                    className={"pb-3 text-xl border-b border-black/20 w-[80%] font-medium"}>
                    {props.navTitle}
                </div>
                {/*Navbar*/}
                <ul
                    className={"pt-6 font-medium flex flex-col"}>
                    <li
                        key={"users"}
                        onClick={() => replace('/workspaces/users')}
                        className={navLinkBaseStyle}>
                        <span className={navLinkDotStyle}>·</span> Users
                    </li>
                    {navLink.map(navItem => (
                        <li
                            key={navItem.id}>
                            <button
                                onClick={() => {
                                    props.setActiveNavIdAction(navItem.id)
                                    props.setPrimarySectionTitleAction(navItem.title)
                                }}
                                disabled={props.activeNavId === navItem.id}
                                className={`${navLinkBaseStyle} ${props.activeNavId === navItem.id ? "text-black/100" : ""}`}>
                                <span className={navLinkDotStyle}>·</span> {navItem.title}
                            </button>
                        </li>
                    ))}
                    <li
                        key={"manage-account"}
                        className={navLinkBaseStyle}>
                        <span className={navLinkDotStyle}>·</span> Manage account
                    </li>
                    <li
                        key={"support"}
                        className={navLinkBaseStyle}>
                        <span className={navLinkDotStyle}>·</span> Support
                    </li>
                </ul>
            </section>
            {/*Settings body*/}
            <section
                className={"flex-1 pl-6 border-l border-black/20"}>
                <div
                    className={"text-3xl font-medium pb-5 pt-13 border-b border-black/20"}>
                    <h1>{props.primarySectionTitle}</h1>
                </div>
                <ul
                    className={"w-full"}
                >
                    {props.children}
                </ul>
            </section>
        </div>
    );
}