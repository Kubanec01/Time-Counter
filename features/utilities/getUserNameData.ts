import {documentNotFound, invalidUserId} from "@/messages/errors";
import {getDoc} from "firebase/firestore";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {UserMode, WorkspaceId} from "@/types";


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
    const name = data.name
    const surname = data.surname

    if (name && surname) return {name, surname}
}