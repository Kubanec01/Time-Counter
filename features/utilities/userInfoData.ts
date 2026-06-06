import {documentNotFound, invalidUserId} from "@/messages/errors";
import {doc, getDoc} from "firebase/firestore";
import {UserMode, WorkspaceId, WorkspacesListItem} from "@/types";
import {db} from "../../app/config/firebase/config";


export const getUserNameData = async (
    userId: string | undefined,
) => {

    if (!userId) throw new Error(invalidUserId)
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return console.error(documentNotFound)

    const data = docSnap.data();

    const name = data.name
    const surname = data.surname
    const email = data.email
    if (name && surname && email) return {name, surname, email}
}

export const getUserRoleData = async (
    userId: string | undefined,
    mode: UserMode,
    workspaceId: WorkspaceId,
) => {
    if (!userId || !workspaceId) return console.error(invalidUserId)

    if (mode === "solo") return "Admin"

    const userRef = doc(db, 'realms', workspaceId, 'members', userId);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) return console.error(documentNotFound)
    const data = docSnap.data();

    return data.role
}


export const getUSerWorkspacesList = async (userId: string | undefined): Promise<WorkspacesListItem[]> => {

    if (!userId) throw new Error(invalidUserId)

    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data();

    return data.workspacesList

}