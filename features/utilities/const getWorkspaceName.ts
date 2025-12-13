import {doc, getDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {documentNotFound} from "@/messages/errors";


export const getWorkspaceName = async (
    workspaceId: string | null,
) => {
    if (!workspaceId) return;

    const docRef = doc(db, "realms", workspaceId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error(documentNotFound)
    const data = docSnap.data()
    const workspaceName = data.workspaceName
    if (workspaceName) return workspaceName
}