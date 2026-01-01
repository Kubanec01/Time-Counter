'use client'

import React, {useEffect, useState} from "react";
import {Member} from "@/types";
import {IoSearch} from "react-icons/io5";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {auth, db} from "@/app/firebase/config";
import {doc, onSnapshot} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {UserBar} from "@/app/workspaces/users/components/UserBar";
import {RiArrowGoBackLine} from "react-icons/ri";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";
import {BannedUserBar} from "@/app/workspaces/users/components/BannedUserBar";

type UserRoleFilter = | "All" | "Admin" | "Manager" | "Member" | "Banned";

const UsersHomePage = () => {

    const [mem, setMem] = useState<Member[]>([])
    const [members, setMembers] = useState<Member[]>([])
    const [filteredRole, setFilteredRole] = useState<UserRoleFilter>("All")
    const [bannedMembers, setBannedMembers] = useState<Member[]>([])
    const [showBannedMembers, setShowBannedMembers] = useState<boolean>(false)

    const {workspaceId, mode} = useWorkSpaceContext()
    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {replace} = useReplaceRouteLink()

    const options = [
        {value: "All", label: "Show all"},
        {value: 'Admin', label: 'Admins'},
        {value: 'Manager', label: 'Managers'},
        {value: 'Member', label: 'Members'},
        {value: 'Banned', label: 'Banned'},
    ];

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
            filteredUsers = mem.filter(member =>
                `${member.name} ${member.surname}`.toLowerCase().includes(text.toLowerCase()))
        } else {
            filteredUsers = mem.filter(member =>
                `${member.name} ${member.surname}`.toLowerCase().includes(text.toLowerCase())
                && member.role === filteredRole)
        }

        setMembers(filteredUsers)
    }

    const noUsersMess = (
        <div className={"w-full px-2 py-4 h-full flex items-center justify-center"}>
            <h1
                className={"text-black/50"}>
                No users found (≥o≤)
            </h1>
        </div>
    )

    const bannedMembersSection = () => {
        if (bannedMembers.length === 0) return noUsersMess

        return (
            bannedMembers.map((member: Member) => (
                <BannedUserBar
                    key={member.userId}
                    userId={member.userId}
                    name={member.name}
                    surname={member.surname}
                    email={member.email}
                    role={member.role}
                />
            ))
        )
    }

    const membersSection = () => {
        if (members.length === 0) return noUsersMess

        return (
            members.map((member: Member) => (
                <UserBar
                    key={member.userId}
                    userId={member.userId}
                    name={member.name}
                    surname={member.surname}
                    email={member.email}
                    role={member.role}
                />
            ))
        )
    }


    // Fetch Workspace Members
    useEffect(() => {
        if (!workspaceId || !userId) return
        const docRef = doc(db, "realms", workspaceId)

        const getWorkspaceUsers = onSnapshot(docRef, docSnap => {
            if (!docSnap.exists()) return
            const data = docSnap.data()
            const adminId: string = data.adminId
            const members: Member[] = data.members
            const bannedMembers: Member[] = data.blackList || []

            setBannedMembers(bannedMembers)
            if (userId === adminId) {
                setMembers(members)
                setMem(members)
            } else {
                setMembers(members.filter((member: Member) => member.userId !== adminId))
                setMem(members.filter((member: Member) => member.userId !== adminId))
            }
        })

        return () => getWorkspaceUsers()

    }, [workspaceId, mode, userId]);

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
                            <div
                                className={"flex items-center gap-2"}>
                                {/* Search members input */}
                                <select
                                    onChange={(event) => {
                                        const value = event.target.value as UserRoleFilter;
                                        setFilteredRole(value)
                                        selectUser(value)
                                    }}
                                    className="border border-black/20 w-[120px] outline-none p-1 px-2
                                 rounded-md bg-white cursor-pointer">
                                    {options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className={"relative w-[340px]"}>
                                    <input
                                        disabled={showBannedMembers}
                                        onChange={(e) => findUser(e.target.value)}
                                        className={"rounded-md w-full p-1 pl-4 pr-8.5 bg-white/90 " +
                                            " border border-black/20 outline-none"}
                                        placeholder={"Search for members..."}
                                        type="text"/>
                                    <IoSearch
                                        className={"absolute top-1/2 -translate-y-1/2 right-3 text-xl text-black/40"}/>
                                </div>
                            </div>
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
                                    <>
                                        {bannedMembersSection()}
                                    </>
                                    :
                                    <>
                                        {membersSection()}
                                    </>
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
