import {deleteDoc, doc} from "firebase/firestore";
import {db} from "@/app/firebase/config";


export const deleteProject = async (workspaceId: string, projectId: string) => {

    const docRef = doc(db, "realms", workspaceId, 'projects', projectId);

    try {
        await deleteDoc(docRef)
    } catch (err) {
        console.error(err)
        throw new Error("Failed to delete project")
    }
};