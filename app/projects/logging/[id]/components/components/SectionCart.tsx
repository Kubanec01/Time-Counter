import {Section} from "@/types";
import React, {JSX, ReactNode} from "react";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {formatSecondsToTimeString} from "@/features/utilities/time/timeOperations";
import {formateYMDToDMY} from "@/features/utilities/date/dateOperations";
import SectionCartContainer from "@/components/SectionCart/SectionCartContainer";
import UserBadge from "@/components/UserBadge/UserBadge";
import {deleteSection} from "@/features/utilities/delete/deleteSection";


export const SectionCart = ({...props}: Section) => {


    const {mode, userRole, workspaceId} = useWorkSpaceContext()
    const isWorkspaceRoleAdmin = mode === "workspace" && (userRole === "Admin" || userRole === "Manager");


    const sectionList: { id: string, content: JSX.Element | ReactNode }[] = [
        {
            id: "title",
            content: <p
                className={"truncate pr-4"}
            >{props.title}</p>
        },
        {
            id: "category",
            content: <p
                className={"truncate pr-6"}
            >{props.category}</p>
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
                bodyClassname={`${(mode === "solo" || !isWorkspaceRoleAdmin) ? "" : "pt-7"}`}
                sectionList={sectionList}
                dataInfo={{
                    userId: props.userId,
                    workspaceId: workspaceId,
                    projectId: props.projectId,
                    sectionId: props.sectionId,
                    updatedDate: props.updateDate
                }}
            >
                <UserBadge
                    className={isWorkspaceRoleAdmin ? "flex" : "hidden"}
                    userName={props.userName}
                />
            </SectionCartContainer>
        </>
    )
}
