import {Member, Role} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {FaCircleUser} from "react-icons/fa6";
import {MdEmail, MdOutlineShield} from "react-icons/md";
import {setUserRole} from "@/features/utilities/edit/setUSerRole";
import {Dispatch, SetStateAction} from "react";

interface UserBarProps {
    userId: string;
    name: string;
    surname: string;
    email: string;
    role: Role;
    setIsInfoModalOpen: Dispatch<SetStateAction<boolean>>;
    isDeleteUserModalOpen: boolean
    setIsDeleteUserModalOpen: Dispatch<SetStateAction<boolean>>;
    setSelectedUser: Dispatch<SetStateAction<Member | null>>;
    setIsConfirmModalOpen: Dispatch<SetStateAction<boolean>>
    setNewRole: Dispatch<SetStateAction<Role | null>>;
}

export const UserBar = ({...props}: UserBarProps) => {

    const {workspaceId, userRole} = useWorkSpaceContext()

    const selectUser = () => {
        props.setSelectedUser({
            userId: props.userId,
            email: props.email,
            name: props.name,
            surname: props.surname,
            role: props.role,
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
                className={"w-full h-[84px] p-3 flex flex-col gap-2 border-b border-black/20"}
            >
                <div
                    className={"flex justify-start items-center gap-6"}>
                    <span
                        className={"flex items-center gap-1 font-semibold"}>
                        <FaCircleUser className={"text-sm text-black/60"}/>
                    <h1>{props.name} {props.surname}</h1>
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
                    <span
                        className={"py-1 px-2 rounded-md bg-black/32 text-white text-sm flex items-center gap-0.5"}
                    >
                        <MdOutlineShield className={"mb-0.5"}/>
                        {props.role}
                    </span>
                    <div
                        className={"flex justify-start items-center gap-4"}>
                        <button
                            onClick={() => setRole("Admin")}
                            className={`${userRole === "Admin" ? "block" : "hidden"} px-3 py-2 cursor-pointer text-xs text-white 
                            bg-black hover:bg-linear-to-b from-vibrant-purple-600 to-vibrant-purple-700 duration-100 ease-in rounded-md`}>
                            Make Admin
                        </button>
                        <button
                            onClick={() => setRole("Manager")}
                            className={"px-3 py-2 cursor-pointer text-xs text-white bg-black hover:bg-linear-to-b from-vibrant-purple-600 to-vibrant-purple-700 duration-100 ease-in rounded-md"}>
                            Make Manager
                        </button>
                        <button
                            onClick={() => setRole("Member")}
                            className={"px-3 py-2 cursor-pointer text-xs text-white bg-black hover:bg-linear-to-b from-vibrant-purple-600 to-vibrant-purple-700 duration-100 ease-in rounded-md"}>
                            Make Member
                        </button>
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