import React, {Dispatch, SetStateAction} from "react";

interface WorkspacesListModalProps {
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    workspacesList: string[];
    setWorkspaceInputId: Dispatch<SetStateAction<string>>;
}

export const WorkspacesListModal = ({...props}: WorkspacesListModalProps) => {

    const openStyle = props.isModalOpen ? "flex" : "hidden";

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
                            className={"w-full border border-black rounded-md flex items-center justify-between px-4 py-1.5 mb-3"}
                        >
                            <h1 className={"text-black w-[72%] break-all"}>{workspace}</h1>
                            <button
                                onClick={() => {
                                    props.setWorkspaceInputId(workspace)
                                    props.setIsModalOpen(false)
                                }}
                                className={"text-sm py-1 px-4 bg-pastel-purple-700 text-white rounded-md"}>Set
                            </button>
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