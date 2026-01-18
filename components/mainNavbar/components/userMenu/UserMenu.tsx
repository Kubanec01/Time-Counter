'use client'

import userBgImg from "@/public/gradient-bg.jpg";
import {RiListSettingsLine, RiSkullFill} from "react-icons/ri";
import {MdLockReset, MdOutlineLogout, MdSupervisedUserCircle} from "react-icons/md";
import React, {Dispatch, SetStateAction, useState} from "react";
import {auth} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {WorkspaceButton} from "@/components/mainNavbar/components/WorkspaceButton";
import {useRouter} from "next/navigation";
import {signOut} from "@firebase/auth";
import ConfirmModal from "@/components/modals/ConfirmModal";
import {TbPasswordUser} from "react-icons/tb";
import {removeLocalStorageWorkspaceIdAndUserMode} from "@/features/utilities/localStorage";
import {NavSection} from "@/components/mainNavbar/components/userMenu/components/NavSection";
import {useAuthState} from "react-firebase-hooks/auth";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";

interface Props {
    isUserMenuOpen: boolean
    setIsUserMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const UserMenu = ({...props}: Props) => {

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLeaveWorkspaceModalOpen, setIsLeaveWorkspaceModalOpen] = useState(false);
    const {setMode, setWorkspaceId, workspaceId} = useWorkSpaceContext()

    const setVisibility = props.isUserMenuOpen ? "flex" : "hidden";
    const {userName, userSurname, userInitials, userRole, mode} = useWorkSpaceContext()
    const router = useRouter();
    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {replace} = useReplaceRouteLink()

    const canAccessAdminFeatures = mode === "workspace" && userRole !== "Member"
    const canAccessAdminOnlyFeatures = mode === "workspace" && userRole === "Admin"

    const handleLeaveWorkspace = () => {
        setMode("solo")
        setWorkspaceId("unused")
        setIsLeaveWorkspaceModalOpen(false);
        removeLocalStorageWorkspaceIdAndUserMode()
        replace("/")
    }

    return (
        <>
            <div
                onMouseLeave={() => props.setIsUserMenuOpen(false)}
                className={`${setVisibility} fixed top-15 right-12.5 rounded-md z-[50] bg-black/90 backdrop-blur-sm flex flex-col gap-4 w-[230px] p-3`}>
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
                <NavSection
                    title={'Workspace'}>
                    <WorkspaceButton
                        setIsModalOpen={setIsLeaveWorkspaceModalOpen}
                    />
                    <button
                        onClick={() => router.push("/workspaces/users")}
                        className={`${canAccessAdminFeatures ? "flex" : "hidden"} items-center gap-2 text-white hover:text-vibrant-purple-400 text-sm bg-black p-2 rounded-md cursor-pointer`}>
                        <MdSupervisedUserCircle className={"text-custom-gray-700"}/> Users
                    </button>
                    <button
                        onClick={() => router.push("/workspaces/settings")}
                        className={`${canAccessAdminOnlyFeatures ? "flex" : "hidden"} w-full items-center gap-2 text-white hover:text-vibrant-purple-400 text-sm bg-black p-2 rounded-md cursor-pointer`}>
                        <TbPasswordUser className={"text-custom-gray-700"}/> Workspace Settings
                    </button>
                </NavSection>
                <NavSection
                    title={'Account'}>
                    <button
                        className={"flex items-center gap-2 text-white hover:text-vibrant-purple-400 text-sm bg-black p-2 rounded-md cursor-pointer"}>
                        <RiListSettingsLine className={"text-custom-gray-700"}/> Settings
                    </button>
                    <button
                        className={"flex items-center gap-2 text-white hover:text-vibrant-purple-400 text-sm bg-black p-2 rounded-md cursor-pointer"}>
                        <MdLockReset className={"text-custom-gray-700"}/> Change Password
                    </button>
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className={"flex items-center gap-2 text-white hover:text-red-500 text-sm bg-black p-2 rounded-md cursor-pointer"}>
                        <MdOutlineLogout className={"text-custom-gray-700"}/> Log Out
                    </button>
                </NavSection>
            </div>
            {/*Modals*/}
            {/*Log out modal*/}
            <ConfirmModal
                topDistance={200}
                title={"Log Out of Trackio?"}
                setIsModalOpen={setIsLogoutModalOpen}
                isModalOpen={isLogoutModalOpen}
                btnText={"Log Out"}
                btnFunction={() => {
                    setIsLogoutModalOpen(false);
                    replace("/")
                    signOut(auth)
                }}
                desc={"You can always log back in anywhere, anytime. Your progress will be saved without any worries."}
            />
            {/* Leave workspace modal */}
            <ConfirmModal
                topDistance={200}
                title={"Leave Workspace?"}
                setIsModalOpen={setIsLeaveWorkspaceModalOpen}
                isModalOpen={isLeaveWorkspaceModalOpen}
                btnText={"Leave"}
                btnFunction={() => handleLeaveWorkspace()}
                desc={"You can always join back anywhere, anytime. Your progress will be saved without any worries."}
            />
        </>
    );
}
