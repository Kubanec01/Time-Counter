import {deleteDoc, doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";

export const deleteWorkspaceData = async (
    userId: string | undefined,
    workspaceId: string,
) => {
    if (!workspaceId || !userId) return
    const docRef = doc(db, "realms", workspaceId)
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) return
    const data = userSnap.data()
    const filteredWorkspacesList: string[] = data.workspacesList.filter((listId: string) => listId !== workspaceId)

    await deleteDoc(docRef)
    await updateDoc(userRef, {workspacesList: filteredWorkspacesList})

}