'use client'

import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";

const links: { id: string, title: string, url: string }[] = [
    {
        id: "workspace-name",
        title: "Name Settings",
        url: "/workspaces/settings/nameAndPassword/name",
    },
    {
        id: "workspace-password",
        title: "Password Settings",
        url: "/workspaces/settings/nameAndPassword/password",
    },
]

const NameAndPasswordSettingsHome = () => {

    const {replace} = useReplaceRouteLink()

    return (
        <>
            <section
                className={"w-[90%] max-w-[700px] mx-auto h-[400px] mt-[200px]"}>
                <h1
                    className={"text-xl text-white/80 font-semibold border-b border-white/30"}
                >Workspace Name and Password</h1>
                <ul
                    className={"w-full p-4 pl-0 flex flex-col gap-3"}
                >
                    {links.map((link) => (
                        <li
                            onClick={() => replace(link.url)}
                            key={link.id}
                            className={"text-white/80 text-lg font-medium px-2 py-2.5 border border-white/50 rounded-xl " +
                                "flex items-center justify-start gap-1 cursor-pointer hover:border-white/80 duration-100"}>
                            {link.title}
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}

export default NameAndPasswordSettingsHome