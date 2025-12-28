'use client'

import {useEffect, useState} from "react";
import {Member} from "@/types";
import {IoSearch} from "react-icons/io5";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {auth, db} from "@/app/firebase/config";
import {doc, onSnapshot} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {UserBar} from "@/app/workplaces/users/components/UserBar";
import {BannedMembersModal} from "@/app/workplaces/users/components/BannedMembersModal";
import {RiArrowGoBackLine} from "react-icons/ri";
import {useReplaceRouteLink} from "@/features/hooks/useReplaceRouteLink";


const UsersHomePage = () => {

    const [mem, setMem] = useState<Member[]>([])
    const [members, setMembers] = useState<Member[]>([])
    const [bannedMembers, setBannedMembers] = useState<Member[]>([])
    const [isBannedMembersModalOpen, setIsBannedMembersModalOpen] = useState(false)

    const {workspaceId, mode} = useWorkSpaceContext()
    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {replace} = useReplaceRouteLink()

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
                        className={"w-full shadow-lg flex flex-col justify-start items-start p-4 rounded-xl bg-black/8"}
                    >
                        <div
                            className={"w-full flex items-center justify-between"}>
                            <div
                                className={"relative w-[340px]"}>
                                <input
                                    onChange={(e) => findUser(e.target.value)}
                                    className={"rounded-lg w-full h-[38px] pl-4 pr-8.5 bg-white/90 " +
                                        " border border-black/20 outline-none"}
                                    placeholder={"Search for members..."}
                                    type="text"/>
                                <IoSearch
                                    className={"absolute top-1/2 -translate-y-1/2 right-3 text-xl text-black/40"}/>
                            </div>
                            <button
                                onClick={() => replace("/")}
                                className={`cursor-pointer hover:scale-105 duration-100 ease-in
                                bg-black/18 text-white rounded-md py-1.5 px-2.5`}>
                                <RiArrowGoBackLine/>
                            </button>
                        </div>
                        <section
                            className={"mx-auto w-full"}>
                            <ul
                                className={"w-full flex flex-col gap-2 mt-8 justify-center items-center bg-white" +
                                    " rounded-lg px-4 py-2 border border-black/10"}>
                                {members.map((member: Member) => (
                                    <UserBar
                                        key={member.userId}
                                        userId={member.userId}
                                        name={member.name}
                                        surname={member.surname}
                                        email={member.email}
                                        role={member.role}
                                    />
                                ))}
                            </ul>
                        </section>
                    </section>
                </section>
            </section>
        </>
    )
}

export default UsersHomePage;


{/*<BannedMembersModal*/
}
{/*    bannedMembers={bannedMembers}*/
}
{/*    isModalOpen={isBannedMembersModalOpen}*/
}
{/*    setIsModalOpen={setIsBannedMembersModalOpen}*/
}
{/*/>*/
}
