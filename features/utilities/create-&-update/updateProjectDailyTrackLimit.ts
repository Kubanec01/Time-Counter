import {doc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";


export const updateProjectDailyTrackLimit = async (
    workspaceId: string,
    projectId: string,
    limitPeriodType: "daily" | "weekly",
    limitValue: number,
) => {

    const docRef = doc(db, 'realms', workspaceId, 'projects', projectId)

    if (limitPeriodType === 'daily') await updateDoc(docRef, {dailyMaxTrackTime: limitValue, weeklyMaxTrackTime: 0})
    else await updateDoc(docRef, {weeklyMaxTrackTime: limitValue, dailyMaxTrackTime: 0})
}