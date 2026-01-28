import {Member, Role, UserClass} from "@/types";
import {UserBar} from "@/app/workspaces/users/components/UserBar";
import React, {useState} from "react";
import {noUsersMess} from "@/app/workspaces/users/components/membersSections/noUsersMess";
import DeleteModal from "@/components/modals/DeleteModal";
import {removeUser} from "@/features/utilities/delete/removeUser";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {setUserRole} from "@/features/utilities/edit/setUSerRole";
import ConfirmModal from "@/components/modals/ConfirmModal";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "@/app/firebase/config";
import InformativeModal from "@/components/modals/InformativeModal";
import {UpdateUserClassModal} from "@/components/modals/UpdateUserClassModal";
import {doc, getDoc, updateDoc} from "firebase/firestore";

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

    const {workspaceId, userRole} = useWorkSpaceContext()
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

    const updateUSerRole = () => {

        if (!userRole || !selectedUser) return

        setIsConfirmModalOpen(false)
        setUserRole(selectedUser.userId, workspaceId, newRole)
    }

    if (props.members.length === 0) return noUsersMess

    return (
        <>
            {props.members.map((member: Member) => (
                <UserBar
                    key={member.userId}
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
            ))}
            <DeleteModal
                setIsModalOpen={setIsDeleteUserModalOpen}
                isModalOpen={isDeleteUserModalOpen}
                title={"Remove Member?"}
                btnFunction={deleteUser}
                desc={`Are you sure you want to remove
                 ${selectedUser?.userId === userId ? "yourself? You won’t be able to log into the workspace again until another user approves it. Your progress will be permanently lost."
                    : `${selectedUser?.name} ${selectedUser?.surname}? You can add this member again later, but their progress will be permanently lost.`}`}
                deleteBtnText={"Remove member"}
                topDistance={400}/>
            <ConfirmModal
                topDistance={200}
                setIsModalOpen={setIsConfirmModalOpen}
                isModalOpen={isConfirmModalOpen}
                title={"Change user role?"}
                desc={`Are you sure you want to change 
                ${selectedUser?.userId === userId ? "Your" : `${selectedUser?.name}'s`}
                 role to ${newRole}? This action may grant or revoke various permissions for the user. For more details, refer to user permissions.`}
                btnFunction={updateUSerRole}
                btnText={"Change user role"}/>
            <InformativeModal
                setIsModalOpen={setIsInfoModalOpen}
                isModalOpen={isInfoModalOpen}
                title={"The project must have at least one admin."}/>
            <UpdateUserClassModal
                isModalOpen={isUpdateClassModalOpen}
                setIsModalOpen={setIsUpdateClassModalOpen}
                selectedUser={selectedUser}
                workspaceId={workspaceId}
            />
        </>
    )
}