import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Section, TimeCheckout, WorkspaceId} from "@/types";
import {db} from "../../../app/config/firebase/config";


export const deleteSubsectionAndTimeCheckoutsData = async (
    workspaceId: WorkspaceId,
    projectId: string,
    sectionId: string,
    subSectionId: string,
    formatedDateToYMD: string,
    updatedClockTime: number,
    durationTime: number,
) => {

    const userRef = doc(db, "realms", workspaceId);
    const projectRef = doc(db, 'realms', workspaceId, 'projects', projectId)
    const projectSnap = await getDoc(projectRef)
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || !projectSnap.exists()) return;
    const data = userSnap.data();
    const projectData = projectSnap.data();
    const totalDailyTrackedTimes: Record<string, number> = projectData.totalDailyTrackedTimes
    const timeCheckouts = data.timeCheckouts || []
    const sections = data.projectsSections || []

    if (updatedClockTime < 0) updatedClockTime = 0;

    const updatedCheckouts = timeCheckouts.filter((s: TimeCheckout) => s.subSectionId !== subSectionId)
    const updatedSections = sections.map((s: Section) => {
        if (s.sectionId !== sectionId) return s;

        return {...s, time: updatedClockTime}
    })

    totalDailyTrackedTimes[formatedDateToYMD] = totalDailyTrackedTimes[formatedDateToYMD] - durationTime

    await updateDoc(userRef, {timeCheckouts: updatedCheckouts, projectsSections: updatedSections});
    await updateDoc(projectRef, {totalDailyTrackedTimes: totalDailyTrackedTimes})
}

