'use client'

import userBgImg from "@/public/gradient-bg.jpg";
import {
    MdDeleteOutline,
    MdExitToApp,
    MdOutlineSettings,
} from "react-icons/md";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {auth, db} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {setLocalStorageUserMode, setLocalStorageWorkspaceId} from "@/features/utilities/local-storage/localStorage";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {Member, WorkspaceCredentials} from "@/types";
import {doc, getDoc, onSnapshot} from "firebase/firestore";
import {removeWorkspaceFromList} from "@/features/utilities/delete/removeWorkspaceFromList";
import {invalidUserId} from "@/messages/errors";
import {useRouter} from "next/navigation";
import {PiSignOutLight} from "react-icons/pi";
import {useLeaveWorkspace} from "@/features/hooks/useLeaveWorkspace";
import {useSignOutUser} from "@/features/hooks/useSignOutUser";
import {createPortal} from "react-dom";
import ConfirmModal from "@/components/modals01/ConfirmModal";
import {FaUser} from "react-icons/fa";

interface Props {
    isUserMenuOpen: boolean
    setIsUserMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const UserMenu = ({...props}: Props) => {

    // States
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLeaveWorkspaceModalOpen, setIsLeaveWorkspaceModalOpen] = useState(false);
    const [workspacesList, setWorkspacesList] = useState<WorkspaceCredentials[]>([]);

    // Hooks
    const {replace} = useReplaceRouteLink()
    const {signOutUser} = useSignOutUser(auth)
    const router = useRouter();
    const {leaveWorkspace} = useLeaveWorkspace()
    const {userName, userSurname, userInitials, userRole, userId, setMode, setWorkspaceId, mode} = useWorkSpaceContext()

    const isMenuOpen = props.isUserMenuOpen ? "flex" : "hidden";

    // Functions
    const handleLeaveWorkspace = () => {
        leaveWorkspace()
        setIsLeaveWorkspaceModalOpen(false);
    }

    const joinWorkspace = async (
        userId: string | undefined,
        workspaceId: string,
        password: string
    ) => {

        if (!userId) throw new Error(invalidUserId)
        const docRef = doc(db, "realms", workspaceId)
        const userRef = doc(db, "users", userId)

        if (!docRef || !userRef) return console.error("Could not find docRef or userRef")

        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) return
        const data = docSnap.data()
        const correctPassword = data.password
        const blackList: Member[] = data.blackList || []

        if (password !== correctPassword) return console.log("Wrong edit-password or Id")
        if (blackList.some(member => member.userId === userId)) return console.log("You don't have permission to join this workspace.")
        setLocalStorageUserMode("workspace")
        setLocalStorageWorkspaceId(workspaceId)
        setMode("workspace")
        setWorkspaceId(workspaceId)
        replace("/")
    }

    useEffect(() => {
            if (!userId) return;
            const docRef = doc(db, "users", userId);

            const fetchData = onSnapshot(docRef, snap => {
                if (!snap.exists()) return;
                const data = snap.data();
                const workspacesList = data.workspacesList || []
                setWorkspacesList(workspacesList);
            })

            return () => fetchData()

        }, [userId]
    )

    return (
        <>
            <div
                onMouseLeave={() => props.setIsUserMenuOpen(false)}
                className={`${isMenuOpen} fixed top-12 right-0 rounded-xl z-50 bg-gray-300 shadow-xl border border-black/15 overflow-hidden backdrop-blur-lg flex flex-col w-[286px]`}>
                {/* User section */}
                <section
                    className={"px-3 bg-white pt-3"}>
                    {/* User Initials */}
                    <div
                        className={"flex items-center gap-2"}>
                <span
                    style={{
                        backgroundImage: `url(${userBgImg.src})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                    className={`aspect-square w-[40px] rounded-full
                         overflow-hidden flex justify-center items-center text-white text-base`}
                >
                    {userInitials}
                </span>
                        <div
                            className={"text-black"}>
                            <h1 className={"text-sm"}>{userName} {userSurname}</h1>
                            <p
                                className={"text-xs -mt-0.5 text-black/65"}>
                                {userRole}</p>
                        </div>
                    </div>
                    {/* Buttons */}
                    <div
                        className={"flex items-center gap-2 my-2 mt-3 justify-start"}>
                        <button
                            className={"text-black small-button gap-1 bg-black/3 border border-black/15"}>
                            <MdOutlineSettings/>
                            Manage account
                        </button>
                        <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className={"cursor-pointer text-black small-button gap-1 bg-black/3 hover:bg-black/6 border border-black/15"}>
                            <MdExitToApp className={"text-[14px]"}/>
                            Sign out
                        </button>
                    </div>
                </section>
                {/* Workspaces List */}
                <ul
                    className={"flex flex-col gap-2 p-3 border-b border-t border-black/10 border-b-black/20 rounded-b-xl bg-white"}>
                    {workspacesList.map((workspace) => (
                        <li
                            key={workspace.workspaceId}
                            onClick={() => joinWorkspace(userId, workspace.workspaceId, workspace.password)}
                            className={"flex items-center justify-between px-3 py-2.5 gap-2 border border-black/10 hover:bg-black/2 rounded-lg cursor-pointer" +
                                " bg-linear-to-b from-white from-30% to-black/6"}>
                            <div
                                className={"text-black text-xs"}>
                                <h1>{workspace.workspaceId}</h1>
                            </div>
                            <button
                                onClick={() => removeWorkspaceFromList(userId, workspace.workspaceId)}
                                className={"text-black/40 hover:text-red-400/70 cursor-pointer"}>
                                <MdDeleteOutline/>
                            </button>
                        </li>
                    ))}
                </ul>
                <section
                    className={""}
                >
                    <button
                        style={{
                            display: mode === "solo" || userRole === "Member" ? "none" : "flex",
                        }}
                        onClick={() => router.push("/workspaces/settings")}
                        className={"items-center w-full px-3 py-2.5 gap-1  text-black/90 text-xs border-b border-white/50 hover:bg-white/10 cursor-pointer"}>
                        <MdOutlineSettings className={"text-sm"}/> Manage workspace
                    </button>
                    {/* Member btn */}
                    <button
                        style={{display: mode === "workspace" ? "flex" : "none"}}
                        onClick={() => setIsLeaveWorkspaceModalOpen(true)}
                        className={"items-center gap-1 w-full px-3 py-2.5  text-black/90 hover:bg-white/10 cursor-pointer text-xs"}>
                        <PiSignOutLight className={"text-sm"}/> Leave workspace
                    </button>
                </section>
            </div>
            {/* Log Out User */}
            {createPortal(
                <ConfirmModal
                    isModalOpen={isLogoutModalOpen}
                    title={"Log Out of Synto?"}
                    description={"You can always log back in anywhere, anytime. Your progress will be saved without any worries."}
                    onCancelClick={() => setIsLogoutModalOpen(false)}
                    confirmButtonText={"Log Out"}
                    customIcon={<><FaUser className={"w-full text-2xl"}/></>}
                    onConfirmClick={() => {
                        setIsLogoutModalOpen(false);
                        replace("/")
                        signOutUser()
                    }}
                />,
                document.body
            )}
            {/* Leave Workspace */}
            {createPortal(
                <ConfirmModal
                    isModalOpen={isLeaveWorkspaceModalOpen}
                    title={"Leave Workspace?"}
                    description={"You can always join back anywhere, anytime. Your progress will be saved without any worries."}
                    onCancelClick={() => setIsLeaveWorkspaceModalOpen(false)}
                    confirmButtonText={"Leave"}
                    customIcon={<><FaUser className={"w-full text-2xl"}/></>}
                    onConfirmClick={() => handleLeaveWorkspace()}
                />,
                document.body
            )}
        </>
    );
}