'use client'


import userBgImg from "@/public/gradient-bg.jpg";
import {RiListSettingsLine} from "react-icons/ri";
import {MdLockReset, MdOutlineLogout, MdSupervisedUserCircle} from "react-icons/md";
import React, {Dispatch, SetStateAction, useState} from "react";
import {auth} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {WorkspaceButton} from "@/components/mainNavbar/components/WorkspaceButton";
import {useRouter} from "next/navigation";
import {signOut} from "@firebase/auth";
import ConfirmExitModal from "@/components/modals/ConfirmExitModal";
import {TbPasswordUser} from "react-icons/tb";

interface Props {
    isUserMenuOpen: boolean
    setIsUserMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const UserMenu = ({...props}: Props) => {

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLeaveWorkspaceModalOpen, setIsLeaveWorkspaceModalOpen] = useState(false);
    const {setMode, setWorkspaceId} = useWorkSpaceContext()


    const setVisibility = props.isUserMenuOpen ? "flex" : "hidden";
    const {userName, userSurname, userInitials, userRole, mode} = useWorkSpaceContext()
    const router = useRouter();

    const canAccessAdminFeatures = mode === "workspace" && userRole !== "Member"
    const canAccessAdminOnlyFeatures = mode === "workspace" && userRole === "Admin"

    const handleLeaveWorkspace = () => {
        setMode("solo")
        setWorkspaceId(null)
        setIsLeaveWorkspaceModalOpen(false);
        localStorage.removeItem("workingMode")
        localStorage.removeItem("workspaceId")
    }

    return (
        <div
            onMouseLeave={() => props.setIsUserMenuOpen(false)}
            className={`${setVisibility} fixed top-15 right-12.5 rounded-md z-[50] bg-[#1e1e20] flex flex-col gap-2 w-[230px] p-3`}>
            <div
                className={"flex items-center gap-2 mb-2"}>
                <span
                    style={{
                        backgroundImage: `url(${userBgImg.src})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                    className={`aspect-square w-[44px] rounded-[100px]
                         overflow-hidden flex justify-center items-center text-white text-lg`}
                >
                    {userInitials}
                </span>
                <div
                    className={"text-white"}>
                    <h1 className={"text-sm font-medium"}>{userName} {userSurname}</h1>
                    <p
                        className={"text-xs"}>
                        {userRole}</p>
                </div>
            </div>
            {/*Workspaces Button*/}
            <WorkspaceButton
                setIsModalOpen={setIsLeaveWorkspaceModalOpen}
            />
            <button
                onClick={() => router.push("/workplaces/users")}
                className={`${canAccessAdminFeatures ? "flex" : "hidden"} items-center gap-2 text-white text-sm bg-black p-2 rounded-md cursor-pointer`}>
                <MdSupervisedUserCircle className={"text-custom-gray-700"}/> Users
            </button>
            <button
                onClick={() => router.push("/workplaces/password")}
                className={`${canAccessAdminOnlyFeatures ? "flex" : "hidden"} items-center gap-2 text-white text-sm bg-black p-2 rounded-md cursor-pointer`}>
                <TbPasswordUser className={"text-custom-gray-700"}/> Workspace Password
            </button>

            <button
                className={"flex items-center gap-2 text-white text-sm bg-black p-2 rounded-md cursor-pointer"}>
                <RiListSettingsLine className={"text-custom-gray-700"}/> Settings
            </button>
            <button
                className={"flex items-center gap-2 text-white text-sm bg-black p-2 rounded-md cursor-pointer"}>
                <MdLockReset className={"text-custom-gray-700"}/> Change Password
            </button>
            <button
                onClick={() => setIsLogoutModalOpen(!isLogoutModalOpen)}
                className={"flex items-center gap-2 text-white text-sm bg-black p-2 rounded-md cursor-pointer"}>
                <MdOutlineLogout className={"text-custom-gray-700"}/> Log Out
            </button>
            {/*Modals*/}
            {/*Log out modal*/}
            <ConfirmExitModal
                title={"Log Out of Trackio?"}
                setIsModalOpen={setIsLogoutModalOpen}
                isModalOpen={isLogoutModalOpen}
                btnText={"Log Out"}
                btnFunction={() => signOut(auth)}
                desc={"You can always log back in anywhere, anytime. Your progress will be saved without any worries."}
            />
            {/* Leave workspace modal */}
            <ConfirmExitModal
                title={"Leave Workspace?"}
                setIsModalOpen={setIsLeaveWorkspaceModalOpen}
                isModalOpen={isLeaveWorkspaceModalOpen}
                btnText={"Leave"}
                btnFunction={() => handleLeaveWorkspace()}
                desc={"You can always join back anywhere, anytime. Your progress will be saved without any worries."}
            />
        </div>
    );
}