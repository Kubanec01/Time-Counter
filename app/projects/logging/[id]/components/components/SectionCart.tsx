import {Section} from "@/types";
import {FaRegEdit} from "react-icons/fa";
import {deleteAllSectionData} from "@/features/utilities/delete/deleteAllSectionData";
import {FaRegTrashCan} from "react-icons/fa6";
import RenameModal from "@/components/modals/RenameModal";
import {editSectionName} from "@/features/utilities/edit/editSectionName";
import React, {useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import DeleteModal from "@/components/modals/DeleteModal";
import {HiMiniUserCircle} from "react-icons/hi2";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";
import {formateYMDToDMY} from "@/features/utilities/date/formateDates";


export const SectionCart = ({...props}: Section) => {

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editModalInputValue, setEditModalInputValue] = useState<string>("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [user] = useAuthState(auth)
    const userId = user?.uid
    const {mode, workspaceId, userRole} = useWorkSpaceContext()
    const isWorkspaceRoleAdmin = mode === "workspace" && (userRole === "Admin" || userRole === "Manager");


    return (
        <>
            <li key={props.sectionId}
                className={`w-full rounded-md bg-white text-black/70 text-sm font-medium items-center px-4 py-1.5 relative
                ${(mode === "solo" || !isWorkspaceRoleAdmin) ? "" : "pt-5"}`}>
                {/*User Name*/}
                <span
                    className={`${isWorkspaceRoleAdmin ? "flex" : "hidden"} gap-0.5 items-center text-xs font-semibold absolute top-1 left-2 text-custom-gray-800`}>
                    <HiMiniUserCircle className={"text-sm"}/>
                    {props.userName}
                </span>
                <div
                    className={"w-full flex justify-between"}>

                    <h1 className={"w-[25%]"}>{props.title}</h1>
                    <h2 className={"w-[25%]"}>{props.category}</h2>
                    <span className={"w-[25%]"}>{formatSecondsToTimeString(props.time)}</span>
                    <span
                        className={"w-[25%]"}>{formateYMDToDMY(props.updateDate)}</span>
                    <span
                        className={"absolute right-4 h-full top-0 flex items-center justify-center gap-4"}>
                <button
                    className={"text-sm text-black/40 hover:text-vibrant-purple-500 cursor-pointer"}
                    onClick={() => setIsEditModalOpen(true)}>
                    <FaRegEdit/>
                </button>
                    <button
                        className={"text-sm text-black/40 hover:text-red-300 cursor-pointer"}
                        onClick={() => setIsDeleteModalOpen(true)}>
                        <FaRegTrashCan/>
                    </button>
                </span>
                </div>
            </li>
            <RenameModal
                setIsModalOpen={setIsEditModalOpen}
                isModalOpen={isEditModalOpen}
                setInputValue={setEditModalInputValue}
                inputValue={editModalInputValue}
                title={"Rename track?"}
                desc={"You can rename your track anytime, anywhere."}
                inputPlaceholder={"What is a new track name?"}
                formFunction={(e) => {
                    e.preventDefault()
                    editSectionName(props.projectId, props.sectionId, editModalInputValue, setEditModalInputValue, setIsEditModalOpen, workspaceId)
                }}/>
            <DeleteModal
                setIsModalOpen={setIsDeleteModalOpen}
                isModalOpen={isDeleteModalOpen}
                title={"Delete track?"}
                desc={"Are you sure you want to delete this track? This step is irreversible and everything stored in this track will be deleted."}
                btnFunction={() => deleteAllSectionData(userId,props.projectId, props.sectionId, workspaceId, props.updateDate, props.time,)}
                deleteBtnText={"Delete track"}
                topDistance={400}
            />
        </>
    )
}
