import React, {Dispatch, SetStateAction} from "react";
import {FaRegTrashAlt} from "react-icons/fa";
import {FiArrowUpRight} from "react-icons/fi";
import {db} from "@/app/firebase/config";
import {doc, getDoc, updateDoc} from "firebase/firestore";

interface WorkspacesListModalProps {
    userId: string | undefined;
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    workspacesList: string[];
    setWorkspaceInputId: Dispatch<SetStateAction<string>>;
}

export const WorkspacesListModal = ({...props}: WorkspacesListModalProps) => {

    const openStyle = props.isModalOpen ? "flex" : "hidden";

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
        <section
            className={`${openStyle} fixed top-0 left-0 w-full h-screen z-50 backdrop-blur-sm justify-center items-center`}
        >
            <div
                className={"max-w-[340px] w-[90%] h-[300px] p-4 rounded-[12px] bg-white border"}>
                <ul
                    className={"w-full border h-[70%] overflow-y-auto p-2 rounded-md"}
                >
                    {props.workspacesList.map((workspace) => (
                        <li
                            key={workspace}
                            className={"w-full border border-black rounded-md flex items-center justify-between px-2 py-1.5 mb-3"}
                        >
                            <h1 className={"text-black w-[72%] break-all"}>{workspace}</h1>
                            <div
                                className={"flex gap-1"}>
                                <button
                                    onClick={() => {
                                        props.setWorkspaceInputId(workspace)
                                        props.setIsModalOpen(false)
                                    }}
                                    className={"text-ms py-1 px-2 bg-black text-white rounded-md"}>
                                    <FiArrowUpRight/>
                                </button>
                                <button
                                    onClick={() => removeWorkspaceFromList(workspace)}
                                    className={"text-xs py-1 px-2.5 bg-red-600 text-white rounded-md"}>
                                    <FaRegTrashAlt/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={() => props.setIsModalOpen(v => !v)}
                    className={"w-full rounded-full border py-1 mt-5 text-white bg-black"}>
                    Cancel
                </button>
            </div>
        </section>
    )
}