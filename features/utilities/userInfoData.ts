import {documentNotFound, invalidUserId, memberNotFound} from "@/messages/errors";
import {getDoc} from "firebase/firestore";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {Member, UserMode, WorkspaceId} from "@/types";


export const getUserNameData = async (
    userId: string | undefined,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {

    if (!userId) throw new Error(invalidUserId)
    const userRef = getFirestoreTargetRef(userId, mode, workspaceId);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data();

    if (mode === "solo") {
        const name = data.name
        const surname = data.surname
        const email = data.email

        if (name && surname && email) return {name, surname, email}
    }

    const matchedUser: Member = data.members.find((member: Member) => member.userId === userId)
    if (!matchedUser) throw new Error("Error getting user with user userId from Realms/Workspace")

    const name = matchedUser.name
    const surname = matchedUser.surname
    const email = matchedUser.email

    if (name && surname && email) return {name, surname, email}
}

export const getUserRoleData = async (
    userId: string | undefined,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {
    if (!userId) throw new Error(invalidUserId)

    if (mode === "solo") return "Admin"

    const userRef = getFirestoreTargetRef(userId, mode, workspaceId);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data();
    const member: Member = data.members.find((member: Member) => member.userId === userId)

    if (!member) return console.error(memberNotFound)
    return member.role
}