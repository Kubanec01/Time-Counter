import React, {Dispatch, SetStateAction} from "react";
import {GoArrowUpRight, GoTrash} from "react-icons/go";
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

    const Splitter = () => {
        return <span className={"w-[1px] h-[22px] bg-black/30"}/>
    }


    return (
        <div
            className={`${openStyle} fixed top-6 left-[50%] -translate-x-[50%] w-[90%] h-[70%] py-4 px-3 rounded-[12px] 
            bg-white backdrop-blur-3xl border border-black/10`}>
            <div
                className={"w-full h-[75%] relative"}>
                <span
                    className={"block w-[94%] h-[20px] bg-linear-to-b from-white to-transparent absolute top-0 left-0"}/>
                <ul
                    className={"w-full h-full overflow-y-auto p-2 rounded-md"}
                >
                    {props.workspacesList.map((workspace) => (
                        <li
                            key={workspace}
                            className={"w-full border-b border-black/10 bg-black/2 rounded-xl flex items-center justify-between px-2 py-2 mb-2"}
                        >
                            <h1 className={"text-sm w-[50%] break-all font-semibold text-black/80"}>{workspace}</h1>
                            <div
                                className={"flex gap-2.5 justify-end"}>
                                <Splitter/>
                                <button
                                    onClick={() => {
                                        props.setWorkspaceInputId(workspace)
                                        props.setIsModalOpen(false)
                                    }}
                                    className={"py-1 px-1.5 rounded-full cursor-pointer text-black/50 hover:text-vibrant-purple-700"}>
                                    <GoArrowUpRight/>
                                </button>
                                <Splitter/>
                                <button
                                    onClick={() => removeWorkspaceFromList(workspace)}
                                    className={"py-1 px-2 rounded-full cursor-pointer text-black/50 hover:text-red-600"}>
                                    <GoTrash className={"text-sm"}/>
                                </button>
                                <Splitter/>
                            </div>
                        </li>
                    ))}
                </ul>
                <span
                    className={"block w-[94%] h-[30px] bg-linear-to-t from-white to-transparent absolute bottom-0 left-0"}/>
            </div>
            <button
                onClick={() => props.setIsModalOpen(v => !v)}
                className={"w-full rounded-full py-1 mt-4 text-white bg-black hover:bg-black/80 duration-100 backdrop-blur-sm glass-effect cursor-pointer"}>
                Cancel
            </button>
        </div>
    )
}