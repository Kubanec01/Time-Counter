'use client'

import {BsBoxArrowInDownRight} from "react-icons/bs";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {useState} from "react";

type SettingsBodyProps = {
    navbarLinks: { id: string, title: string }[]
}

export const SettingsBody = ({...props}: SettingsBodyProps) => {

    const [activeNavbarBtn, setActiveNavbarBtn] = useState("")

    const {replace} = useReplaceRouteLink()

    const navLink = props.navbarLinks || []

    const navLinkBaseStyle = "flex items-center gap-1 text-black/50 cursor-pointer hover:text-black duration-150"
    const navLinkDotStyle = "text-4xl mb-0.5"

    return (
        <div
            className={"w-11/12 max-w-[900px] mx-auto mt-[200px] flex justify-between"}>
            {/*Map*/}
            <section
                className={"pt-10 w-[22%]"}>
                <div
                    className={"pb-3 text-xl border-b border-black/20 w-[80%] font-medium"}>
                    <h1>Workspace <br/> Settings</h1>
                </div>
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
                                disabled={activeNavbarBtn === navItem.id}
                                className={`${navLinkBaseStyle} ${activeNavbarBtn === navItem.id ? "text-black" : ""}`}>
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
            <section
                className={"flex-1 pl-6 border-l border-black/20"}>
                <div
                    className={"text-3xl font-medium pb-5 pt-13 border-b border-black/20"}>
                    <h1>Projects</h1>
                </div>
                <ul
                    className={"w-full"}
                >
                    <li
                        className={"border-b border-black/20 pt-3 pb-1 pr-5"}>
                        <div
                            className={"flex items-center justify-between"}>
                            <div>
                                <h1
                                    className={"text-[20px] font-medium"}>
                                    Testing project</h1>
                                <p
                                    className={"flex items-center gap-1 text-xs -mt-2 text-black/50 font-semibold"}>
                                    <span className={"text-4xl mb-0.5"}>·</span> Logging Project
                                </p>
                            </div>
                            <BsBoxArrowInDownRight
                                className={"text-black/40 -rotate-90 mb-8 text-sm"}/>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
    );
}