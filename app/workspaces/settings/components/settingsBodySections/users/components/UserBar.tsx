'use client'

import {Member, Role, UserClass} from "@/types";
import {Dispatch, SetStateAction} from "react";
import {ProfileAvatar} from "@/components/ProfileAvatar/ProfileAvatar";
import {RiSettings3Fill} from "react-icons/ri";
import {useRouter} from "next/navigation";
import {manageMembersPageUrlPath} from "@/data/Url_Paths/urlPaths";

interface UserBarProps {
    userId: string;
    name: string;
    surname: string;
    email: string;
    role: Role;
    class: UserClass;
    setIsInfoModalOpen: Dispatch<SetStateAction<boolean>>;
    isDeleteUserModalOpen: boolean
    setIsDeleteUserModalOpen: Dispatch<SetStateAction<boolean>>;
    setSelectedUser: Dispatch<SetStateAction<Member | null>>;
    setIsConfirmModalOpen: Dispatch<SetStateAction<boolean>>
    setNewRole: Dispatch<SetStateAction<Role | null>>;
    setIsUpdateClassModalOpen: Dispatch<SetStateAction<boolean>>
}

export const UserBar = ({...props}: UserBarProps) => {

    const router = useRouter();

    return (
        <>
            <div
                className={"relative w-full p-3 px-0 flex justify-start items-center border-b border-black/15"}>
                {/*Name and Surname*/}
                <section className={"flex items-center w-[32%] gap-2"}>
                    <div>
                        <ProfileAvatar userInitials={`${props.name[0]}${props.surname[0]}`}/>
                    </div>
                    <div>
                        <h1
                            className={"text-xs"}
                        >{props.name} {props.surname}</h1>
                        <p
                            className={"text-black/50 text-[9px] truncate"}>
                            {props.email}
                        </p>
                    </div>
                </section>
                {/*Role*/}
                <div
                    className={"w-[32%] text-xs"}>
                    {props.role}
                </div>
                {/*Class*/}
                <div
                    className={"w-[32%] text-xs"}>
                    {props.class}
                </div>
                <button
                    onClick={() => router.push(manageMembersPageUrlPath(props.userId))}
                    className={"absolute right-4 cursor-pointer px-2.5 py-1 text-xs rounded-sm text-black/34 hover:text-black/50 duration-200 bg-gradient-to-b from-white to-black/3 border  border-black/8"}>
                    <RiSettings3Fill/>
                </button>
            </div>
        </>
    )
}