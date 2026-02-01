"use client"

import {UsersClasses} from "@/data/users";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Member} from "@/types";
import {doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {AiOutlinePlusCircle} from "react-icons/ai";
import {CreateUsersClass} from "@/components/modals/updateUserClassModal/components/CreateUsersClass";


interface UpdateUserClassModalProps {
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    selectedUser: Member | null
    workspaceId: string
}

export const UpdateUserClassModal = ({...props}: UpdateUserClassModalProps) => {

    // States
    const [classes, setClasses] = useState<UsersClasses[]>([]);
    const [isCreatingClass, setIsCreatingClass] = useState(false);

    const openStyle = props.isModalOpen ? "flex" : "hidden";
    const selectedUser = props.selectedUser
    const docRef = doc(db, "realms", props.workspaceId)


    const updateUserRole = async (userClassId: string) => {
        if (!selectedUser) return
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

    // Fetch classes
    useEffect(() => {
        const fetchClasses = onSnapshot(docRef, snap => {
            if (!snap.exists()) return
            const data = snap.data()
            const classes: UsersClasses[] = data.userClasses
            setClasses(classes)
        })
        return () => fetchClasses()
    }, [])

    return (
        <>
            <section
                className={`${openStyle} fixed top-0 left-0 w-full h-screen z-50 bg-red justify-center items-center`}
            >
                <div
                    className={`${isCreatingClass ? "w-[540px] duration-200" : "w-[300px]"}
                   py-2 border bg-white rounded-md overflow-hidden flex flex-col justify-between`}
                >
                    <h1
                        className={"flex justify-center py-4"}>
                        Set User Class
                    </h1>
                    <section
                        style={{display: isCreatingClass ? "block" : "none"}}>
                        <CreateUsersClass
                            setIsCreatingClass={setIsCreatingClass}
                            isModalOpen={props.isModalOpen}/>
                    </section>
                    <section
                        style={{display: isCreatingClass ? "none" : "block"}}>
                        <ul
                            className={"w-full flex flex-col gap-2"}
                        >
                            {classes.map((uClass) => (
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
                                        setIsCreatingClass(true)
                                    }}
                                    className={`w-full p-1 border-b cursor-pointer flex gap-1 items-center`}
                                >
                                    <AiOutlinePlusCircle className={"text-lg mb-0.5"}/>
                                    Add class
                                </button>
                            </li>
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
                    </section>
                    <button
                        onClick={() => {
                            props.setIsModalOpen(false)
                            setIsCreatingClass(false)
                        }}
                        className={"w-full mb-2 cursor-pointer"}
                    >
                        Cancel
                    </button>
                </div>
            </section>
        </>
    )
}