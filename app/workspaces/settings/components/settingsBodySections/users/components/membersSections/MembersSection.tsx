import {Member, Role} from "@/types";
import {UserBar} from "@/app/workspaces/settings/components/settingsBodySections/users/components/UserBar";
import React, {useState} from "react";
import {
    noUsersMess
} from "@/app/workspaces/settings/components/settingsBodySections/users/components/membersSections/noUsersMess";
import DeleteModal from "@/components/modals/DeleteModal";
import {removeUser} from "@/features/utilities/delete/removeUser";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {setUserRole} from "@/features/utilities/edit/setUSerRole";
import ConfirmModal from "@/components/modals/ConfirmModal";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "@/app/firebase/config";
import InformativeModal from "@/components/modals/InformativeModal";
import {UpdateUserClassModal} from "@/components/modals/updateUserClassModal/UpdateUserClassModal";

interface MembersSectionProps {
    members: Member[];
    admins: Member[];
}

export const MembersSection = ({...props}: MembersSectionProps) => {
    const [selectedUser, setSelectedUser] = useState<Member | null>(null)
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [newRole, setNewRole] = useState<Role | null>(null)
    const [isUpdateClassModalOpen, setIsUpdateClassModalOpen] = useState(false)

    const {workspaceId} = useWorkSpaceContext()
    const [user] = useAuthState(auth)
    const userId = user?.uid


    const deleteUser = async () => {
        if (!selectedUser) return
        if (selectedUser.role === "Admin" && props.admins.length < 2) {
            setIsInfoModalOpen(true)
            setIsDeleteUserModalOpen(false)
            return;
        }

        setIsDeleteUserModalOpen(false)
        removeUser(selectedUser.userId, selectedUser.name, selectedUser.surname, selectedUser.email, workspaceId)
    }


    if (props.members.length === 0) return noUsersMess

    return (
        <>
            {props.members.map((member: Member) => (
                <li
                    key={member.userId}>
                    <UserBar
                        userId={member.userId}
                        name={member.name}
                        surname={member.surname}
                        email={member.email}
                        role={member.role}
                        class={member.class}
                        setIsDeleteUserModalOpen={setIsDeleteUserModalOpen}
                        isDeleteUserModalOpen={isDeleteUserModalOpen}
                        setIsInfoModalOpen={setIsInfoModalOpen}
                        setSelectedUser={setSelectedUser}
                        setIsConfirmModalOpen={setIsConfirmModalOpen}
                        setNewRole={setNewRole}
                        setIsUpdateClassModalOpen={setIsUpdateClassModalOpen}
                    />
                </li>
            ))}
        </>
    )
}