import {documentNotFound, invalidUserId, memberNotFound} from "@/messages/errors";
import {doc, getDoc} from "firebase/firestore";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {Member, UserMode, WorkspaceId} from "@/types";
import {db} from "@/app/firebase/config";


export const getUserNameData = async (
    userId: string | undefined,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {

    if (!userId) throw new Error(invalidUserId)
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) console.error(documentNotFound)
    const data = docSnap.data();

    if (data) {

        const name = data.name
        const surname = data.surname
        const email = data.email
        if (name && surname && email) return {name, surname, email}
        else return undefined
    } else return undefined
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

    return member.role
}