'use client'

import {useEffect, useState} from "react"
import {FaAngleDown, FaUsers} from "react-icons/fa"
import {Member} from "@/types";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {onSnapshot} from "firebase/firestore";
import {UserCart} from "@/app/workspaces/settings/projects/[id]/components/users/components/UsersCart";
import {TaskTypesOptionsProps} from "@/app/workspaces/settings/projects/[id]/components/tasks/TaskTypesOptions";


export const UsersSettings = ({...props}: TaskTypesOptionsProps) => {

    const [isSectionOpen, setIsSectionOpen] = useState(false)
    const [users, setUsers] = useState<Member[]>([]);

    useEffect(() => {
        if (!props.userId) return

        const docRef = getFirestoreTargetRef(props.userId, props.mode, props.workSpaceId);

        const fetchUsers = onSnapshot(docRef, snap => {
            if (!snap.exists()) return

            const data = snap.data()
            const members = data.members
            setUsers(members)
        });
        return () => fetchUsers()
    }, [props.mode, props.userId, props.workSpaceId])

    return (
        <li
            className={`${isSectionOpen ? "h-auto border-b border-white/50" : "h-[54px]"} 
            text-white/80 text-lg pb-4.5 overflow-hidden w-[90%]`}
        >
            <div
                className="w-full border-b border-white/50 py-2.5 pl-2 pr-4 flex items-center justify-between"
            >
                <h1 className="flex items-center gap-3">
                    <FaUsers/> Users
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
                <ul>
                    {users.map((user) => (
                        <UserCart
                            key={user.userId}
                            member={user}
                            projectId={props.projectId}
                        />
                    ))}
                </ul>
            )}
        </li>
    )
}
