import {Section} from "@/types";
import {FaRegEdit} from "react-icons/fa";
import {deleteAllSectionData} from "@/features/utilities/delete/deleteAllSectionData";
import {FaRegTrashCan} from "react-icons/fa6";
import RenameModal from "@/components/modals/RenameModal";
import {editSectionName} from "@/features/utilities/edit/editSectionName";
import React, {JSX, ReactNode, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import DeleteModal from "@/components/modals/DeleteModal";
import {HiMiniUserCircle} from "react-icons/hi2";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";
import {formateYMDToDMY} from "@/features/utilities/date/dateOperations";
import SectionCartContainer from "@/components/SectionCart/SectionCartContainer";
import UserBadge from "@/components/UserBadge/UserBadge";


export const SectionCart = ({...props}: Section) => {


    const {mode, userRole} = useWorkSpaceContext()
    const isWorkspaceRoleAdmin = mode === "workspace" && (userRole === "Admin" || userRole === "Manager");


    const sectionList: { id: string, content: JSX.Element | ReactNode }[] = [
        {
            id: "title",
            content: <p>{props.title}</p>
        },
        {
            id: "category",
            content: <p>{props.category}</p>
        },
        {
            id: "time",
            content: <p>{formatSecondsToTimeString(props.time)}</p>
        },
        {
            id: "date",
            content: <p>{formateYMDToDMY(props.updateDate)}</p>
        },
    ]

    return (
        <>

            <SectionCartContainer
                sectionList={sectionList}
                bodyClassname={`${(mode === "solo" || !isWorkspaceRoleAdmin) ? "" : "pt-7"}`}
            >
                <UserBadge
                    className={isWorkspaceRoleAdmin ? "flex" : "hidden"}
                    userName={props.userName}
                />
            </SectionCartContainer>
        </>
    )
}


{/*<RenameModal*/
}
{/*    setIsModalOpen={setIsEditModalOpen}*/
}
{/*    isModalOpen={isEditModalOpen}*/
}
{/*    setInputValue={setEditModalInputValue}*/
}
{/*    inputValue={editModalInputValue}*/
}
{/*    title={"Rename track?"}*/
}
{/*    desc={"You can rename your track anytime, anywhere."}*/
}
{/*    inputPlaceholder={"What is a new track edit-name?"}*/
}
{/*    formFunction={(e) => {*/
}
{/*        e.preventDefault()*/
}
{/*        editSectionName(props.projectId, props.sectionId, editModalInputValue, setEditModalInputValue, setIsEditModalOpen, workspaceId)*/
}
{/*    }}/>*/
}
{/*<DeleteModal*/
}
{/*    setIsModalOpen={setIsDeleteModalOpen}*/
}
{/*    isModalOpen={isDeleteModalOpen}*/
}
{/*    title={"Delete track?"}*/
}
{/*    desc={"Are you sure you want to delete this track? This step is irreversible and everything stored in this track will be deleted."}*/
}
{/*    btnFunction={() => deleteAllSectionData(userId, props.projectId, props.sectionId, workspaceId, props.updateDate, props.time,)}*/
}
{/*    deleteBtnText={"Delete track"}*/
}
{/*    topDistance={400}*/
}
{/*/>*/
}
