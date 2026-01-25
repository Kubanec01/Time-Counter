'use client'

import React, {useEffect, useState} from "react";
import {Member} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {auth, db} from "@/app/firebase/config";
import {doc, onSnapshot} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {RiArrowGoBackLine} from "react-icons/ri";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {MembersFilterBar, UserRoleFilter} from "@/app/workspaces/users/components/MembersFilterBar";
import {BannedMembersSection} from "@/app/workspaces/users/components/membersSections/BannedMembersSection";
import {MembersSection} from "@/app/workspaces/users/components/membersSections/MembersSection";


const UsersHomePage = () => {

    const [mem, setMem] = useState<Member[]>([])
    const [members, setMembers] = useState<Member[]>([])
    const [filteredRole, setFilteredRole] = useState<UserRoleFilter>("All")
    const [bannedMembers, setBannedMembers] = useState<Member[]>([])
    const [showBannedMembers, setShowBannedMembers] = useState<boolean>(false)
    const [admins, setAdmins] = useState<Member[]>([])

    const {workspaceId, mode, userRole} = useWorkSpaceContext()
    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {replace} = useReplaceRouteLink()

    // Functions
    const selectUser = (role: string) => {
        if (role === "All") {
            setShowBannedMembers(false)
            setMembers(mem)
            return
        }
        if (role === "Banned") return setShowBannedMembers(true)

        setShowBannedMembers(false)
        const filteredUsers = mem.filter(member => member.role === role)
        setMembers(filteredUsers)
    }
    const findUser = (text: string) => {
        if (text.trim() === "") return selectUser(filteredRole)

        let filteredUsers = []

        if (filteredRole === "All") {
            filteredUsers = mem.filter(member => (`${member.name}`.toLowerCase().startsWith(text.toLowerCase()))
                || (`${member.surname}`.toLowerCase().startsWith(text.toLowerCase())))
        } else {
            filteredUsers = mem.filter(member => ((`${member.name} ${member.surname}`.toLowerCase().startsWith(text.toLowerCase())) ||
                `${member.surname}`.toLowerCase().startsWith(text.toLowerCase())) && member.role === filteredRole)
        }

        setMembers(filteredUsers)
    }

    // Fetch Workspace Members
    useEffect(() => {
        if (!workspaceId || !userId) return
        const docRef = doc(db, "realms", workspaceId)

        const getWorkspaceUsers = onSnapshot(docRef, docSnap => {
            if (!docSnap.exists()) return
            const data = docSnap.data()
            const members: Member[] = data.members
            const bannedMembers: Member[] = data.blackList || []
            setAdmins(members.filter(m => m.role === "Admin"))

            setBannedMembers(bannedMembers)
            if (userRole === "Admin") {
                setMembers(members)
                setMem(members)
            } else {
                setMembers(members.filter((member: Member) => member.role !== "Admin"))
                setMem(members.filter((member: Member) => member.role !== "Admin"))
            }
        })

        return () => getWorkspaceUsers()

    }, [workspaceId, mode, userId, userRole]);

    return (
        <>
            <section
                className={"w-full h-screen flex flex-col justify-start items-center"}
            >
                <section
                    className={"mx-auto w-11/12 max-w-[900px] mt-[130px] flex flex-col gap-2 my-2 justify-center items-center"}>
                    <h1 className={"text-xl text-black/70 font-semibold w-full text-start px-4"}>Workspace members</h1>
                    <section
                        className={"w-full shadow-lg flex flex-col justify-start items-start p-4 rounded-xl bg-black/12"}
                    >
                        <div
                            className={"w-full flex items-center justify-between"}>
                            <MembersFilterBar setRole={setFilteredRole} selectUser={selectUser} findUser={findUser}
                                              isBtnDisabled={showBannedMembers}/>
                            <button
                                onClick={() => replace("/")}
                                className={`cursor-pointer hover:scale-105 duration-100 ease-in
                                bg-vibrant-purple-600/90 text-white rounded-md py-1.5 px-2.5`}>
                                <RiArrowGoBackLine/>
                            </button>
                        </div>
                        <section
                            className={"mx-auto w-full"}>
                            <ul
                                className={"w-full flex flex-col gap-2 mt-8 justify-center items-center bg-white" +
                                    " rounded-lg px-4 py-2 border border-black/10"}>
                                {showBannedMembers
                                    ?
                                    <BannedMembersSection members={bannedMembers}/>
                                    :
                                    <MembersSection members={members} admins={admins}/>
                                }
                            </ul>
                        </section>
                    </section>
                </section>
            </section>
        </>
    )
}

export default UsersHomePage;