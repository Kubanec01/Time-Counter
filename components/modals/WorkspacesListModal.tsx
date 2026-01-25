import React, {Dispatch, SetStateAction} from "react";
import {GoArrowUpRight, GoTrash} from "react-icons/go";
import {db} from "@/app/firebase/config";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {WorkspaceCredentials} from "@/types";
import {removeWorkspaceFromList} from "@/features/utilities/delete/removeWorkspaceFromList";

interface WorkspacesListModalProps {
    userId: string | undefined;
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    workspacesList: WorkspaceCredentials[];
    setWorkspaceInputId: Dispatch<SetStateAction<string>>;
    setPasswordInputId: Dispatch<SetStateAction<string>>;
}

export const WorkspacesListModal = ({...props}: WorkspacesListModalProps) => {

    const openStyle = props.isModalOpen ? "block" : "hidden";

    const deleteWorkspaceFromList = async (workspaceId: string) => {
        await removeWorkspaceFromList(props.userId, workspaceId)

        console.log(props.workspacesList.length)
        if (props.workspacesList.length < 2) props.setIsModalOpen(false);

    }

    const Splitter = () => {
        return <span className={"w-[1px] h-[22px] bg-black/30"}/>
    }

    return (
        <div
            className={`${openStyle} fixed top-6 left-[50%] -translate-x-[50%] w-[90%] h-[70%] py-4 px-3 rounded-[12px] 
            bg-white/90 backdrop-blur-3xl border border-black/10`}>
            <div
                className={"w-full h-[75%] relative"}>
                <span
                    className={"block w-[94%] h-[20px] bg-linear-to-b from-white to-transparent absolute top-0 left-0"}/>
                <ul
                    className={"w-full h-full overflow-y-auto p-2 rounded-md"}
                >
                    {props.workspacesList.map((workspace) => (
                        <li
                            key={workspace.workspaceId}
                            className={"w-full border-b border-black/10 bg-black/14 rounded-xl flex items-center justify-between px-2 py-2 mb-2"}
                        >
                            <h1 className={"text-sm w-[50%] break-all font-semibold text-black/80"}>{workspace.workspaceId}</h1>
                            <div
                                className={"flex gap-2.5 justify-end"}>
                                <Splitter/>
                                <button
                                    onClick={() => {
                                        props.setWorkspaceInputId(workspace.workspaceId)
                                        props.setPasswordInputId(workspace.password)
                                        props.setIsModalOpen(false)
                                    }}
                                    className={"py-1 px-1.5 rounded-full cursor-pointer text-black/50 hover:text-vibrant-purple-700"}>
                                    <GoArrowUpRight/>
                                </button>
                                <Splitter/>
                                <button
                                    onClick={() => deleteWorkspaceFromList(workspace.workspaceId)}
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