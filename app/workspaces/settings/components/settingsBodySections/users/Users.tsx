import React, {useEffect, useState} from "react";
import {Member} from "@/types";
import {
    MembersFilterBar,
    UserRoleFilter
} from "@/app/workspaces/settings/components/settingsBodySections/users/components/MembersFilterBar";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "@/app/firebase/config";
import {doc, onSnapshot} from "firebase/firestore";
import {
    BannedMembersSection
} from "@/app/workspaces/settings/components/settingsBodySections/users/components/membersSections/BannedMembersSection";
import {
    MembersSection
} from "@/app/workspaces/settings/components/settingsBodySections/users/components/membersSections/MembersSection";


export const Users = () => {


    const [mem, setMem] = useState<Member[]>([])
    const [members, setMembers] = useState<Member[]>([])
    const [filteredRole, setFilteredRole] = useState<UserRoleFilter>("All")
    const [bannedMembers, setBannedMembers] = useState<Member[]>([])
    const [showBannedMembers, setShowBannedMembers] = useState<boolean>(false)
    const [admins, setAdmins] = useState<Member[]>([])

    const {workspaceId, mode, userRole} = useWorkSpaceContext()
    const [user] = useAuthState(auth)
    const userId = user?.uid

    const categoryTitleStyle = "text-black w-[32%] text-sm text-black/60"

    // Functions
    const selectUser = (role: string) => {
        if (role === "All") {
            setShowBannedMembers(false)
            setMembers(mem)
            return
        }
        if (role === "Banned") return setShowBannedMembers(true)

        setShowBannedMembers(false)
        const filteredUsers = mem.filter(member => member.role === role)
        setMembers(filteredUsers)
    }
    const findUser = (text: string) => {
        if (text.trim() === "") return selectUser(filteredRole)

        let filteredUsers = []

        if (filteredRole === "All") {
            filteredUsers = mem.filter(member => (`${member.name}`.toLowerCase().startsWith(text.toLowerCase()))
                || (`${member.surname}`.toLowerCase().startsWith(text.toLowerCase())))
        } else {
            filteredUsers = mem.filter(member => ((`${member.name} ${member.surname}`.toLowerCase().startsWith(text.toLowerCase())) ||
                `${member.surname}`.toLowerCase().startsWith(text.toLowerCase())) && member.role === filteredRole)
        }

        setMembers(filteredUsers)
    }

    // Fetch Workspace Members
    useEffect(() => {
        if (!workspaceId || !userId) return
        const docRef = doc(db, "realms", workspaceId)

        const getWorkspaceUsers = onSnapshot(docRef, docSnap => {
            if (!docSnap.exists()) return
            const data = docSnap.data()
            const members: Member[] = data.members
            const bannedMembers: Member[] = data.blackList || []
            setAdmins(members.filter(m => m.role === "Admin"))

            setBannedMembers(bannedMembers)
            setMembers(members)
            setMem(members)
        })

        return () => getWorkspaceUsers()

    }, [workspaceId, mode, userId, userRole]);

    return (
        <>
            <div
                className={"w-full flex items-center justify-between"}>
                <MembersFilterBar setRole={setFilteredRole}
                                  selectUser={selectUser}
                                  findUser={findUser}
                                  isBtnDisabled={showBannedMembers}/>

            </div>
            <section
                className={"mx-auto w-full"}>
                <div
                    className={"w-full flex justify-start items-center border-b border-black/20 pb-1"}>
                    <p
                        className={categoryTitleStyle}>
                        Name
                    </p>
                    <p
                        className={categoryTitleStyle}>
                        Role
                    </p>
                    <p
                        className={categoryTitleStyle}>
                        Class
                    </p>
                </div>
                <ul
                    className={"w-full rounded-lg"}>
                    {showBannedMembers
                        ?
                        <BannedMembersSection members={bannedMembers}/>
                        :
                        <MembersSection members={members} admins={admins}/>
                    }
                </ul>
            </section>
        </>
    )
}