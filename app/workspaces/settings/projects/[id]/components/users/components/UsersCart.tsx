'use client'

import {useState} from "react"
import {FaAngleDown} from "react-icons/fa"
import {Member} from "@/types";
import {
    UserTaskTypesOptions
} from "@/app/workspaces/settings/projects/[id]/components/users/components/UserTaskTypesOptions";

interface TaskTypesOptionsProps {
    member: Member
    projectId: string
}

export const UserCart = ({member, projectId}: TaskTypesOptionsProps) => {

    const [isSectionOpen, setIsSectionOpen] = useState(false)

    return (
        <li
            className={`${isSectionOpen ? "h-auto border-b border-white/50" : "h-[54px]"} 
            text-white/80 text-lg pb-4.5 overflow-hidden w-[90%]`}
        >
            <div
                className="w-full border-b border-white/50 py-2.5 pl-2 pr-4 flex items-center justify-between"
            >
                <h1 className="flex items-center gap-3">
                    {member.name} {member.surname} <span className={"text-sm -ml-1"}>({member.role})</span>
                </h1>

                <button
                    onClick={() => setIsSectionOpen(v => !v)}
                    className={`${isSectionOpen ? "rotate-180" : "rotate-0"} 
                    text-white/80 hover:text-white cursor-pointer duration-180`}
                >
                    <FaAngleDown/>
                </button>
            </div>
            {isSectionOpen && (
                <section className="p-4">
                    <UserTaskTypesOptions projectId={projectId} member={member} />
                </section>
            )}
        </li>
    )
}
