import {db} from "../../../app/config/firebase/config";
import {deleteDoc, doc, getDoc} from "firebase/firestore";
import {documentNotFound} from "@/messages/errors";


type DeleteWorkspaceProps = {
    userId: string,
    workspaceId: string
}

export const deleteWorkspace =
    async ({userId, workspaceId}: DeleteWorkspaceProps) => {

        const docRef = doc(db, 'realms', workspaceId);
        const docSnap = await getDoc(docRef)
        if(!docSnap.exists()) throw new Error(documentNotFound)
        const data = docSnap.data()
        const adminId = data.adminId

        if(userId !== adminId) throw new Error('INVALID_PERMISSION')

        try {
            await deleteDoc(docRef)
        } catch (err) {
            console.error(err)
            throw new Error("Failed to delete workspace")
        }
    };