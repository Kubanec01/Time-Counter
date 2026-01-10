import {Member, Role} from "@/types";
import {UserBar} from "@/app/workspaces/users/components/UserBar";
import React, {useState} from "react";
import {noUsersMess} from "@/app/workspaces/users/components/membersSections/noUsersMess";
import DeleteModal from "@/components/modals/DeleteModal";
import {removeUser} from "@/features/utilities/delete/removeUser";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {setUserRole} from "@/features/utilities/edit/setUSerRole";
import ConfirmModal from "@/components/modals/ConfirmModal";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config";


export const MembersSection = ({members}: { members: Member[] }) => {
    const [selectedUser, setSelectedUser] = useState<Member | null>(null)
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [newRole, setNewRole] = useState<Role | null>(null)

    const {workspaceId, userRole} = useWorkSpaceContext()
    const [user] = useAuthState(auth)
    const userId = user?.uid


    const deleteUser = async () => {
        if (!selectedUser) return

        setIsDeleteUserModalOpen(false)
        removeUser(selectedUser.userId, selectedUser.name, selectedUser.surname, selectedUser.email, workspaceId)
    }

    const updateUSerRole = () => {
        if (!userRole || !selectedUser) return

        setIsConfirmModalOpen(false)
        setUserRole(selectedUser.userId, workspaceId, newRole)
    }

    console.log(isConfirmModalOpen)

    if (members.length === 0) return noUsersMess

    return (
        <>
            {members.map((member: Member) => (
                <UserBar
                    key={member.userId}
                    userId={member.userId}
                    name={member.name}
                    surname={member.surname}
                    email={member.email}
                    role={member.role}
                    setIsInfoModalOpen={setIsInfoModalOpen}
                    isDeleteUserModalOpen={isDeleteUserModalOpen}
                    setIsDeleteUserModalOpen={setIsDeleteUserModalOpen}
                    setSelectedUser={setSelectedUser}
                    setIsConfirmModalOpen={setIsConfirmModalOpen}
                    setNewRole={setNewRole}
                />
            ))}
            <DeleteModal
                setIsModalOpen={setIsDeleteUserModalOpen}
                isModalOpen={isDeleteUserModalOpen}
                title={"Remove Member?"}
                btnFunction={deleteUser}
                desc={"Are you sure you want to remove this member? You can add this member again later, but their progress will be permanently lost."}
                deleteBtnText={"Remove member"}
                topDistance={400}/>
            <ConfirmModal
                setIsModalOpen={setIsConfirmModalOpen}
                isModalOpen={isConfirmModalOpen}
                title={"Change user role?"}
                desc={`Are you sure you want to change 
                ${selectedUser?.userId === userId ? "Your" : `${selectedUser?.name}'s`}
                 role to ${newRole}? This action may grant or revoke various permissions for the user. For more details, refer to user permissions.`}
                btnFunction={updateUSerRole}
                btnText={"Change user role"}/>
        </>
    )
}