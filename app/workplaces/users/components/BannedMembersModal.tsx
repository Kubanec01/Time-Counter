import React, {Dispatch, SetStateAction} from "react";
import {Member} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {db} from "@/app/firebase/config";
import {doc, getDoc, updateDoc} from "firebase/firestore";


interface BannedMembersModalProps {
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    bannedMembers: Member[]
}

export const BannedMembersModal = ({...props}: BannedMembersModalProps) => {

    const {workspaceId} = useWorkSpaceContext()

    const openStyle = props.isModalOpen ? "flex" : "hidden";

    const unbannedMember = async (
        userId: string
    ) => {
        if (!workspaceId) return

        const docRef = doc(db, "realms", workspaceId);
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return
        const data = docSnap.data()
        const blackList: Member[] = data.blackList
        const updatedBlackList = blackList.filter(member => member.userId !== userId);
        await updateDoc(docRef, {blackList: updatedBlackList})
        props.setIsModalOpen(false);
    }

    return (
        <section
            className={`${openStyle} fixed top-0 left-0 w-full h-screen z-50 backdrop-blur-sm justify-center items-center`}
        >
            <div
                className={"max-w-[340px] w-[90%] h-[300px] p-4 rounded-[12px] bg-gray-500"}>
                <ul
                    className={"w-full border h-[70%] overflow-y-auto p-2 rounded-md"}
                >
                    {props.bannedMembers.map((member: Member) => (
                        <li
                            key={member.userId}
                            className={"w-full h-[40px] border border-white rounded-md flex items-center justify-between px-4 py-1.5"}
                        >
                            <h1 className={"text-white"}>{member.name} {member.surname}</h1>
                            <button
                                onClick={() => unbannedMember(member.userId)}
                                className={"text-sm h-full px-2 bg-green-500 text-white rounded-md"}>Unbanned
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={() => props.setIsModalOpen(v => !v)}
                    className={"w-full rounded-full border py-1 mt-5 text-white"}>
                    Cancel
                </button>
            </div>
        </section>
    )
}