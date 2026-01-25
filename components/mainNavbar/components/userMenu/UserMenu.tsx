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
import {signOut} from "@firebase/auth";
import ConfirmModal from "@/components/modals/ConfirmModal";
import {
    removeLocalStorageWorkspaceIdAndUserMode,
    setLocalStorageUserMode,
    setLocalStorageWorkspaceId
} from "@/features/utilities/localStorage";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {Member, WorkspaceCredentials} from "@/types";
import {doc, getDoc, onSnapshot} from "firebase/firestore";
import {removeWorkspaceFromList} from "@/features/utilities/delete/removeWorkspaceFromList";
import {invalidUserId} from "@/messages/errors";
import {IoMdAddCircle} from "react-icons/io";
import {useRouter} from "next/navigation";

interface Props {
    isUserMenuOpen: boolean
    setIsUserMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const UserMenu = ({...props}: Props) => {

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLeaveWorkspaceModalOpen, setIsLeaveWorkspaceModalOpen] = useState(false);
    const [workspacesList, setWorkspacesList] = useState<WorkspaceCredentials[]>([]);

    const setVisibility = props.isUserMenuOpen ? "flex" : "hidden";
    const {userName, userSurname, userInitials, userRole, userId, setMode, setWorkspaceId, mode} = useWorkSpaceContext()
    const {replace} = useReplaceRouteLink()
    const router = useRouter();

    const handleLeaveWorkspace = () => {
        setMode("solo")
        setWorkspaceId("unused")
        setIsLeaveWorkspaceModalOpen(false);
        removeLocalStorageWorkspaceIdAndUserMode()
        replace("/")
    }

    const joinWorkspace = async (
        userId: string | undefined, workspaceId: string, password: string,) => {

        if (!userId) throw new Error(invalidUserId)
        const docRef = doc(db, "realms", workspaceId)
        const userRef = doc(db, "users", userId)

        if (!docRef || !userRef) return console.error("Could not find docRef or userRef")

        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) return
        const data = docSnap.data()
        const correctPassword = data.password
        const blackList: Member[] = data.blackList || []

        if (password !== correctPassword) return console.log("Wrong password or Id")
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
                className={`${setVisibility} fixed top-15 right-12.5 rounded-lg z-[50] bg-black/90 backdrop-blur-sm flex flex-col w-[286px] pt-3`}>
                {/* User section */}
                <section
                    className={"border-b border-white/50 px-3"}>
                    {/* User Initials */}
                    <div
                        className={"flex items-center gap-2"}>
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
                    {/* Buttons */}
                    <div
                        className={"flex items-center gap-2 my-2 justify-end"}>
                        <button
                            className={"text-white/98 flex items-center justify-center text-xs gap-1 bg-white/10 border border-white/20 p-1 px-2 rounded-md"}>
                            <MdOutlineSettings/>
                            Manage account
                        </button>
                        <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className={"text-white/98 flex items-center justify-center text-xs gap-1 bg-white/10 border border-white/20 p-1 px-2 rounded-md cursor-pointer"}>
                            <MdExitToApp className={"text-[14px]"}/>
                            Sign out
                        </button>
                    </div>
                </section>
                {/* Workspaces List */}
                <ul
                    className={"flex flex-col"}>
                    {workspacesList.map((workspace) => (
                        <li
                            key={workspace.workspaceId}
                            onClick={() => joinWorkspace(userId, workspace.workspaceId, workspace.password)}
                            className={"flex items-center justify-between px-3 py-4 gap-2 border-b border-white/50 hover:bg-white/5 cursor-pointer"}>
                            <div
                                className={"text-white text-xs"}>
                                <h1>{workspace.workspaceId}</h1>
                            </div>
                            <button
                                onClick={() => removeWorkspaceFromList(userId, workspace.workspaceId)}
                                className={"text-white/40 hover:text-red-300/70 cursor-pointer"}>
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
                        className={"items-center w-full px-3 py-2.5 gap-1 text-white/98 text-xs border-b border-white/20 hover:bg-white/5 cursor-pointer"}>
                        <MdOutlineSettings className={"text-sm"}/> Manage workspace
                    </button>
                    <button
                        onClick={() => setIsLeaveWorkspaceModalOpen(true)}
                        className={"flex items-center gap-1 bg-white/10 hover:bg-white/15 w-full p-3 text-white/98 cursor-pointer text-xs"}>
                        <IoMdAddCircle className={"text-sm"}/> Join/Create workspace
                    </button>
                </section>
            </div>
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