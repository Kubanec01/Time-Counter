import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {WorkspaceCredentials} from "@/types";


export const removeWorkspaceFromList = async (
    userId: string | undefined,
    workspaceId: string,
) => {
    if (!userId) return;
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) return;
    const data = userSnap.data();
    const updatedWorkspacesList: WorkspaceCredentials[] =
        data.workspacesList.filter((workspace: WorkspaceCredentials) => workspace.workspaceId !== workspaceId);

    await updateDoc(userRef, {workspacesList: updatedWorkspacesList});
}