"use client"

import {usersClasses} from "@/data/users";
import {Dispatch, SetStateAction, useState} from "react";
import {Member, UserClass} from "@/types";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";


interface UpdateUserClassModalProps {
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    selectedUser: Member | null
    workspaceId: string
}

export const UpdateUserClassModal = ({...props}: UpdateUserClassModalProps) => {

    const openStyle = props.isModalOpen ? "flex" : "hidden";
    const selectedUser = props.selectedUser

    const updateUserRole = async (userClassId: string) => {
        if (!selectedUser) return

        const docRef = doc(db, "realms", props.workspaceId)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return
        const data = docSnap.data()
        const members: Member[] = data.members || []
        const updatedMembers = members.map(m => {
            if (selectedUser.userId !== m.userId) return m
            return {...m, class: userClassId}
        })
        await updateDoc(docRef, {members: updatedMembers})
    }


    return (
        <>
            <section
                className={`${openStyle} fixed top-0 left-0 w-full h-screen z-50 bg-red justify-center items-center`}
            >
                <div
                    className={"w-[300px] h-[350px] border bg-white rounded-md"}
                >
                    <h1
                        className={"flex justify-center py-4"}>
                        Set User Class
                    </h1>
                    <ul
                        className={"w-full flex flex-col gap-2"}
                    >
                        {usersClasses.map((uClass) => (
                            <li
                                key={uClass.id}>
                                <button
                                    onClick={() => {
                                        updateUserRole(uClass.id)
                                        props.setIsModalOpen(false)
                                    }}
                                    className={`p-1 w-full border-b cursor-pointer text-start`}
                                >
                                    {uClass.name}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => {
                                    updateUserRole("unset")
                                    props.setIsModalOpen(false)
                                }}
                                className={`p-1 w-full border-b cursor-pointer text-start`}
                            >
                                Unset
                            </button>
                        </li>
                    </ul>
                    <button
                        onClick={() => props.setIsModalOpen(false)}
                        className={"w-full mt-2 cursor-pointer"}
                    >
                        Cancel
                    </button>
                </div>
            </section>
        </>
    )
}