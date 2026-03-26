import {Member, UserBlackListData, WorkspacesListItem} from "@/types";
import {fetchMessages, userNotFound} from "@/messages/errors";
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";


export const logIntoWorkspace = async (
    userId: string | undefined,
    workspaceId: string,
    workspacePassword: string,
    workspaceMembersData: Member[],
    memberData: Member
) => {

    if (!userId) return console.error(userNotFound)
    const errorMessages = fetchMessages

    const userRef = doc(db, "users", userId)
    const workspaceRef = doc(db, 'realms', workspaceId)

    const workspaceSnap = await getDoc(workspaceRef)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists() || !workspaceSnap.exists()) throw new Error(errorMessages.workspaceNotFound)

    const userData = userSnap.data()
    const workspaceData = workspaceSnap.data()

    if (workspacePassword !== workspaceData.password) throw new Error(errorMessages.wrongPassword)


    const membersBlackList: UserBlackListData = workspaceData.blackList

    if (membersBlackList) {
        const isUserBanned = Object.keys(membersBlackList).some(id => id === userId)
        if (isUserBanned) throw new Error(errorMessages.invalidPermission)
    }

    const isMemberInWorkspace = workspaceMembersData.some(data => data.userId === userId)
    if (!isMemberInWorkspace) await setDoc(doc(db, 'realms', workspaceId, 'members', userId), memberData)

    const usersWorkspacesList: WorkspacesListItem[] = userData.workspacesList
    let updatedWorkspacesList: WorkspacesListItem[] = []

    // Create workspace in Workspaces Loging List or update password in existing workspace list
    if (usersWorkspacesList.some(i => i.workspaceId === workspaceId)) {
        updatedWorkspacesList = usersWorkspacesList.map(item => {
            if (item.workspaceId !== workspaceId) return item
            return {...item, password: workspacePassword}
        })
    } else {
        updatedWorkspacesList = [...usersWorkspacesList, {workspaceId: workspaceId, password: workspacePassword}]
    }

    await updateDoc(userRef, {workspacesList: updatedWorkspacesList})

}