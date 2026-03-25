import {Project, WorkspaceId} from "@/types";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {documentNotFound} from "@/messages/errors";


export const updateTotalDailyTrackedTime = async (
    projectId: string,
    formatedDateToYMD: string,
    seconds: number,
    workspaceId: WorkspaceId,
    changes: "increase" | "decrease",
) => {

    const docSnap = await getDoc(doc(db, "realms", workspaceId, 'projects', projectId))
    if (!docSnap.exists()) return console.error(documentNotFound);

    const data = docSnap.data() as Project;

    let updatedTotalDailyTrackedTime = data.totalDailyTrackedTimes[formatedDateToYMD] ?? 0

    if (changes === 'increase') updatedTotalDailyTrackedTime += seconds
    else updatedTotalDailyTrackedTime -= seconds

    data.totalDailyTrackedTimes[formatedDateToYMD] = updatedTotalDailyTrackedTime

    await updateDoc(doc(db, "realms", workspaceId, 'projects', projectId),
        {[`totalDailyTrackedTimes.${formatedDateToYMD}`]: updatedTotalDailyTrackedTime})
}