import {Member, Role, UserClass} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {FaCircleUser} from "react-icons/fa6";
import {MdEmail, MdOutlineShield, MdStarOutline} from "react-icons/md";
import {Dispatch, SetStateAction} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {usersClasses} from "@/data/users";

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

    const {userRole} = useWorkSpaceContext()
    const [user] = useAuthState(auth)
    const userId = user?.uid

    const userClassTitle = usersClasses.find(c => c.id === props.class)?.name || ""

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

    return (
        <>
            <li
                className={"w-full h-[96px] p-3 flex flex-col gap-2 border-b border-black/20"}
            >
                <div
                    className={"flex justify-start items-center gap-6 mb-1"}>
                    <span
                        className={"flex items-center gap-1 font-semibold"}>
                        <FaCircleUser className={"text-sm text-black/60"}/>
                    <h1>{props.name} {props.surname}</h1>
                        <span className={"text-sm text-black/50"}>{props.userId === userId && "(You)"}</span>
                    </span>
                    <span
                        className={"flex items-center gap-1"}>
                        <MdEmail className={"text-[15px] text-black/60"}/>
                    <h2 className={"text-sm font-semibold"}
                    >{props.email}</h2>
                    </span>
                </div>
                <div
                    className={"flex justify-between items-center w-full"}>
                    <div
                        className={"flex items-center gap-4 font-semibold"}>
                    <span
                        className={"py-1 px-2 rounded-md bg-black/32 text-white text-sm flex items-center gap-0.5"}
                    >
                        <MdOutlineShield className={"mb-0.5"}/>
                        {props.role}
                    </span>
                        {membersClass === "unset"
                            ?
                            <>
                                <button
                                    onClick={() => {
                                        selectUser()
                                        props.setIsUpdateClassModalOpen(true)
                                    }}
                                    className={"text-black/32 cursor-pointer hover:bg-black/5 px-1.5 py-1 rounded-md text-xs" +
                                        " flex items-center duration-150"}
                                >
                                    Add class
                                </button>
                            </>
                            :
                            <>
                                <span
                                    onClick={() => {
                                        selectUser()
                                        props.setIsUpdateClassModalOpen(true)
                                    }}
                                    className={"py-1 px-2 rounded-md bg-pastel-purple-800 text-white text-sm flex items-center gap-0.5 cursor-pointer"}
                                >
                                    <MdStarOutline className={"mb-0.5"}/>
                                    {userClassTitle}
                                </span>
                            </>
                        }
                    </div>
                    <div
                        className={"flex justify-start items-center gap-4"}>
                        {props.userId !== userId &&
                            <>
                                {buttons.map((btn) => (
                                    <button
                                        key={btn.id}
                                        onClick={() => setRole(btn.role)}
                                        className={`${userRole === "Manager" && btn.role === "Admin"
                                            ? "hidden" : "block"}
                                             px-3 py-2 cursor-pointer text-xs text-white 
                                        bg-black hover:bg-linear-to-b from-vibrant-purple-600 to-vibrant-purple-700 duration-100 ease-in rounded-md`}>
                                        Make {btn.label}
                                    </button>
                                ))}
                            </>
                        }
                        <button
                            onClick={() => {
                                props.setIsDeleteUserModalOpen(true)
                                selectUser()
                            }}
                            className={"px-3 py-2 cursor-pointer text-xs text-white bg-red-500 hover:bg-red-600 duration-100 ease-in rounded-md"}>
                            Remove Member
                        </button>
                    </div>
                </div>
            </li>
        </>
    )
}