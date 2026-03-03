'use client'

import {Member, Role, UserClass} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {FaCircleUser} from "react-icons/fa6";
import {MdEmail, MdOutlineShield, MdStarOutline} from "react-icons/md";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {db} from "@/app/firebase/config";
import {UsersClasses} from "@/data/users";
import {doc, getDoc} from "firebase/firestore";
import {ProfileAvatar} from "@/components/ProfileAvatar";
import {RiSettings3Fill} from "react-icons/ri";

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

    const [userClass, setUserClass] = useState<string>("")

    const {userRole, workspaceId, userId, userInitials} = useWorkSpaceContext()

    const membersClass = props.class ? props.class : "unset"

    const buttons: { id: string, label: string, role: Role }[] = [
        {
            id: "admin",
            label: "Admin",
            role: "Admin"
        },
        {
            id: "manager",
            label: "Manager",
            role: "Manager"
        },
        {
            id: "member",
            label: "Member",
            role: "Member"
        },
    ]

    // setSelectedUser function
    const selectUser = () => {
        props.setSelectedUser({
            userId: props.userId,
            email: props.email,
            name: props.name,
            surname: props.surname,
            role: props.role,
            class: props.class,
        })
    }

    const setRole = (role: Role) => {
        selectUser()
        props.setNewRole(role)
        props.setIsConfirmModalOpen(true)
    }

    useEffect(() => {

        const fetchData = async () => {
            const docRef = doc(db, "realms", workspaceId)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) return
            const data = docSnap.data()
            const usersClassName: UsersClasses = data.userClasses.find((c: UsersClasses) => c.id === props.class) || []
            setUserClass(usersClassName.name)
        }
        fetchData()
    }, [props.class, workspaceId])

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
                    className={"absolute right-4 cursor-pointer px-2.5 py-1 text-xs rounded-sm text-black/34 hover:text-black/50 duration-200 bg-gradient-to-b from-white to-black/3 border  border-black/8"}>
                    <RiSettings3Fill/>
                </button>
            </div>
        </>
    )
}