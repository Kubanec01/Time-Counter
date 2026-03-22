import {doc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";


export const updateTrackFormatData = async (
    workspaceId: string,
    projectId: string,
    value: "Decimal" | "Range",
) => {
    console.log(value);
    console.log(workspaceId, projectId);
    const docRef = doc(db, 'realms', workspaceId, 'projects', projectId)
    console.log(docRef)
    await updateDoc(docRef, {trackFormat: value})
}