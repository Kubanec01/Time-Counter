import React, {useEffect, useState} from "react";
import {Member} from "@/types";
import {useWorkSpaceContext} from "@/features/contexts/workspaceContext";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "@/app/firebase/config";
import {collection, doc, getDoc, getDocs, onSnapshot} from "firebase/firestore";
import {
    BannedMembersSection
} from "@/app/workspaces/settings/components/settingsBodySections/users/components/membersSections/BannedMembersSection";
import {
    MembersSection
} from "@/app/workspaces/settings/components/settingsBodySections/users/components/membersSections/MembersSection";
import {getAllWorkspaceMembers} from "@/features/utilities/getAllWorkspaceMembers";
import {documentNotFound} from "@/messages/errors";
import {SelectBar} from "@/components/SelectBar/SelectBar";
import {usersFilterOptions} from "@/data/users";
import {TextInput} from "@/components/TextInput/TextInput";

type UserRoleFilter = "All" | "Member" | "Manager" | "Admin" | "Blocked"

export const Users = () => {


    const [members, setMembers] = useState<Member[]>([])
    const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
    const [filteredRole, setFilteredRole] = useState<UserRoleFilter>("All")
    const [bannedMembers, setBannedMembers] = useState<Member[]>([])
    const [showBannedMembers, setShowBannedMembers] = useState<boolean>(false)
    const [admins, setAdmins] = useState<Member[]>([])

    const {workspaceId} = useWorkSpaceContext()

    const categoryTitleStyle = "text-black w-[32%] text-sm text-black/60"

    // Functions
    const selectUser = (role: string) => {
        if (role === "All") {
            setFilteredMembers(members)
            return
        }

        const filteredUsers = members.filter(member => member.role === role)
        setFilteredMembers(filteredUsers)
    }


    const findUser = (text: string) => {
        if (text.trim() === "" || text.length === 0) return selectUser(filteredRole)

        let filteredUsers

        if (filteredRole === "All") {
            filteredUsers = filteredMembers.filter(member => (`${member.name}`.toLowerCase().startsWith(text.toLowerCase()))
                || (`${member.surname}`.toLowerCase().startsWith(text.toLowerCase())))
        } else {
            filteredUsers = filteredMembers.filter(member => ((`${member.name} ${member.surname}`.toLowerCase().startsWith(text.toLowerCase())) ||
                `${member.surname}`.toLowerCase().startsWith(text.toLowerCase())) && member.role === filteredRole)
        }

        setFilteredMembers(filteredUsers)
    }

    // Fetch Workspace Members
    useEffect(() => {
        if (workspaceId === 'unused') return

        const fetchData = async () => {
            const docSnap = await getDoc(doc(db, "realms", workspaceId))
            if (!docSnap.exists()) return console.error(documentNotFound)
            const data = docSnap.data()
            setBannedMembers(data.blackList || [])
            const members = await getAllWorkspaceMembers(workspaceId)
            setMembers(members)
            setFilteredMembers(members)
        }

        fetchData()

    }, [workspaceId]);

    return (
        <>
            <div
                className={"w-full flex items-center justify-between"}>
                <div
                    className={"flex items-center gap-2 my-7"}>
                    <SelectBar
                        inputId={"users-list"}
                        labelChildren={""}
                        labelClassname={"hidden"}
                        value={filteredRole}
                        options={usersFilterOptions}
                        onChange={(e) => {
                            const role = e as UserRoleFilter;
                            setFilteredRole(role)
                            selectUser(role)
                        }}
                    />
                    <button
                        onClick={() => {
                            setFilteredRole("Blocked")
                            selectUser("Banned")
                        }}
                        className={"medium-button bg-gradient-to-b from-white from-30% to-black/8 border border-black/15 text-black outline-none"}>
                        Blocked users
                    </button>
                    <TextInput
                        inputId={"users-search"}
                        isIconVisible={true}
                        placeholder={"Search for members..."}
                        OnChange={(e) => findUser(e)}
                    />
                </div>
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
                        <MembersSection members={filteredMembers} admins={admins}/>
                    }
                </ul>
            </section>
        </>
    )
}