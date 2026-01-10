import {Member} from "@/types";
import {BannedUserBar} from "@/app/workspaces/users/components/BannedUserBar";
import React from "react";
import {noUsersMess} from "@/app/workspaces/users/components/membersSections/noUsersMess";



export const BannedMembersSection = ({members}: { members: Member[] }) => {
    if (members.length === 0) return noUsersMess

    return (
        members.map((member: Member) => (
            <BannedUserBar
                key={member.userId}
                userId={member.userId}
                name={member.name}
                surname={member.surname}
                email={member.email}
                role={member.role}
            />
        ))
    )
}