'use client'

import {FaUnlockKeyhole, FaUsersLine} from "react-icons/fa6";
import {FaProjectDiagram, FaTrashAlt} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {BackButton} from "@/app/workspaces/settings/components/BackButton";


const WorkspaceSettingsHome = () => {

    const router = useRouter();

    const workspaceSettingsData = [
        {
            id: "users",
            icon: <FaUsersLine/>,
            name: "Users",
            url: "/workspaces/users"
        },
        {
            id: "projects",
            icon: <FaProjectDiagram/>,
            name: "Projects",
            url: "/workspaces/settings/projects"
        },
        {
            id: "name-and-password",
            icon: <FaUnlockKeyhole/>,
            name: "Name and password",
            url: "/workspaces/settings/nameAndPassword"
        },
        {
            id: "delete-workspace",
            icon: <FaTrashAlt/>,
            name: "Delete Workspace",
            url: ""
        }
    ]

    return (
        <>
            <section
                className={"w-[90%] max-w-[700px] mx-auto h-[400px] mt-[200px]"}>
                <div
                    className={"w-full border-b border-white/30 flex justify-between"}>
                    <h1
                        className={"text-xl text-white/80 font-semibold ml-2"}>
                        Workspace Settings
                    </h1>
                    <BackButton/>
                </div>
                <ul
                    className={"w-full p-4 pl-0 flex flex-col gap-3"}
                >
                    {workspaceSettingsData.map((item) => (
                        <li
                            onClick={() => router.push(item.url)}
                            key={item.id}
                            className={"text-white/80 text-lg font-medium px-2 py-2.5 border border-white/50 rounded-xl " +
                                "flex items-center justify-start gap-2.5 cursor-pointer hover:border-white/80 duration-100"}>
                            <span className={"text-xl"}>
                                {item.icon}
                            </span>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}

export default WorkspaceSettingsHome