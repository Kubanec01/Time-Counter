'use client'

import {useEffect, useState} from "react";
import {Member, Role} from "@/types";
import {IoSearch} from "react-icons/io5";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {auth, db} from "@/app/firebase/config";
import {arrayUnion, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";


const UsersHomePage = () => {

    const [mem, setMem] = useState<Member[]>([])
    const [members, setMembers] = useState<Member[]>([])

    const {workspaceId, mode, userRole} = useWorkSpaceContext()
    const [user] = useAuthState(auth)
    const userId = user?.uid

    // Functions
    const setUserRole = async (
        memberId: string,
        role: Role,
    ) => {
        if (!workspaceId) return
        const docRef = doc(db, "realms", workspaceId)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return
        const data = docSnap.data()
        const members: Member[] = data.members || []
        const updatedMembers = members.map((member: Member) => {
            if (member.userId !== memberId) return member
            return {...member, role: role}
        })

        await updateDoc(docRef, {members: updatedMembers})
    }

    const removeUser = async (
        memberId: string,
        workspaceId: string | null
    ) => {
        if (!workspaceId || !userId) return
        const docRef = doc(db, "realms", workspaceId)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return
        const data = docSnap.data()
        const members: Member[] = data.members
        const updatedMembers = members.filter(member => member.userId !== memberId)

        await updateDoc(docRef, {members: updatedMembers, blackList: arrayUnion(memberId)})
    }

    const findUser = (text: string) => {
        if (text.trim() === "") {
            setMembers(mem)
            return
        }

        const filtered = mem.filter(member =>
            `${member.name}${member.surname}`.toLowerCase().includes(text.toLowerCase())
        )

        setMembers(filtered)
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
                className={"mx-auto w-[90%] max-w-[1200px] pt-[100px] flex flex-col gap-2 justify-center items-center"}>
                <h1
                    className={"text-3xl"}>
                    All Members</h1>
                <div
                    className={"relative w-[340px]"}>
                    <input
                        onChange={(e) => findUser(e.target.value)}
                        className={"border rounded-sm w-full h-[38px] pl-4 pr-8.5"}
                        placeholder={"Search for members..."}
                        type="text"/>
                    <IoSearch className={"absolute top-1/2 -translate-y-1/2 right-3 text-xl"}/>
                </div>
            </section>
            <section
                className={"mx-auto w-[90%] max-w-[800px]"}>
                <ul
                    className={"w-full flex flex-col gap-8 mt-8 justify-center items-center"}>
                    {members.map((member: Member) => (
                        <li
                            key={member.userId}
                            className={"w-full border rounded-md p-3 flex flex-col gap-4"}
                        >
                            <div
                                className={"flex justify-start items-center gap-6"}>
                                <h1>{member.name} {member.surname}</h1>
                                <h2>{member.email}</h2>
                            </div>
                            <span>Role: {member.role}</span>
                            <div
                                className={"flex justify-start items-center gap-4 mt-2"}>
                                <button
                                    onClick={() => setUserRole(member.userId, "Admin")}
                                    className={`${userRole === "Admin" ? "block" : "hidden"} px-3 py-2 cursor-pointer text-sm text-white bg-black rounded-md`}>
                                    Make Admin
                                </button>
                                <button
                                    onClick={() => setUserRole(member.userId, "Manager")}
                                    className={"px-3 py-2 cursor-pointer text-sm text-white bg-black rounded-md"}>
                                    Make Manager
                                </button>
                                <button
                                    onClick={() => setUserRole(member.userId, "Member")}
                                    className={"px-3 py-2 cursor-pointer text-sm text-white bg-black rounded-md"}>
                                    Make Member
                                </button>
                                <button
                                    onClick={() => removeUser(member.userId, workspaceId)}
                                    className={"px-3 py-2 cursor-pointer text-sm text-white bg-red-500 rounded-md"}>
                                    Remove Member
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}

export default UsersHomePage;