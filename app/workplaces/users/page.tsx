'use client'

import {useEffect, useState} from "react";
import {Member, Role} from "@/types";
import {IoSearch} from "react-icons/io5";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";


const UsersHomePage = () => {

    const [members, setMembers,] = useState<Member[]>([])

    const {workspaceId, mode, userRole} = useWorkSpaceContext()

    // Functions
    const setUserRole = async (
        userId: string,
        role: Role,
    ) => {
        if (!workspaceId) return
        const docRef = doc(db, "realms", workspaceId)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return
        const data = docSnap.data()
        const members: Member[] = data.members || []
        const updatedMembers = members.map((member: Member) => {
            if (member.userId !== userId) return member
            return {...member, role: role}
        })

        await updateDoc(docRef, {members: updatedMembers})
    }


    // Fetch Workspace Members
    useEffect(() => {
        if (!workspaceId) return
        const docRef = doc(db, "realms", workspaceId)

        const getWorkspaceUsers = onSnapshot(docRef, docSnap => {
            if (!docSnap.exists()) return
            const data = docSnap.data()
            const members: Member[] = data.members || []
            setMembers(members)
        })

        return () => getWorkspaceUsers()

    }, [workspaceId, mode]);

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