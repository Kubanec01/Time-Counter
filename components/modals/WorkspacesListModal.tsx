import React, {Dispatch, SetStateAction, use} from "react";
import {GoArrowUpRight, GoTrash} from "react-icons/go";
import {deleteWorkspaceData} from "@/features/utilities/delete/deleteWorkspaceData";
import {db} from "@/app/firebase/config";
import {doc, getDoc, updateDoc} from "firebase/firestore";

interface WorkspacesListModalProps {
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    workspacesList: string[];
    setWorkspaceInputId: Dispatch<SetStateAction<string>>;
    userId: string | undefined;
}

export const WorkspacesListModal = ({...props}: WorkspacesListModalProps) => {

    const openStyle = props.isModalOpen ? "block" : "hidden";

    const removeWorkspaceFromList = async (workspaceName: string) => {
        if (!props.userId) return;
        const userRef = doc(db, "users", props.userId)
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const updatedWorkspacesList: string[] = data.workspacesList.filter((workspace: string) => workspace !== workspaceName);

        await updateDoc(userRef, {workspacesList: updatedWorkspacesList});
    }


    return (
        <div
            className={`${openStyle} fixed top-6 left-[50%] -translate-x-[50%] w-[90%] h-[70%] p-4 rounded-[12px] bg-black/80 backdrop-blur-2xl`}>
            <ul
                className={"w-full h-[70%] overflow-y-auto p-2 rounded-md"}
            >
                {props.workspacesList.map((workspace) => (
                    <li
                        key={workspace}
                        className={"w-full glass-effect bg-black rounded-xl flex items-center justify-between px-4 py-2 mb-3"}
                    >
                        <h1 className={"text-white/95 text-sm w-[66%] break-all"}>{workspace}</h1>
                        <div
                            className={"flex gap-2 justify-end"}>
                            <button
                                onClick={() => {
                                    props.setWorkspaceInputId(workspace)
                                    props.setIsModalOpen(false)
                                }}
                                className={"font-bold py-1 px-1.5 bg-blue-500 text-white rounded-full cursor-pointer"}>
                                <GoArrowUpRight/>
                            </button>
                            <button
                                onClick={() => removeWorkspaceFromList(workspace)}
                                className={"font-bold py-1 px-2 bg-red-500 text-white rounded-full cursor-pointer"}>
                                <GoTrash className={"text-sm"}/>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <button
                onClick={() => props.setIsModalOpen(v => !v)}
                className={"w-full rounded-full py-1 mt-5 text-white bg-white/40 hover:bg-white/30 duration-100 backdrop-blur-sm glass-effect cursor-pointer"}>
                Cancel
            </button>
        </div>
    )
}