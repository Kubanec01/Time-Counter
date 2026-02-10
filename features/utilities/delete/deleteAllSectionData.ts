import {getDoc, updateDoc} from "firebase/firestore";
import {Section, TimeCheckout, UpdatedSectionByDate, UserMode, WorkspaceId} from "@/types";
import {subtractProjectTotalTime} from "@/features/utilities/time/totalTime";
import {sectionNotFound} from "@/messages/errors";
import {getFirestoreTargetRef} from "@/features/utilities/getFirestoreTargetRef";
import {updateUserProjectTimeData} from "@/features/utilities/create/updateUserProjectTimeData";
import {updateTotalTrackedTime} from "@/features/utilities/edit/updateTotalTrackedTime";
import {formatFloatHoursToSeconds} from "@/app/stats/[id]/utils";


export const deleteAllSectionData = async (
    userId: string | undefined,
    projectId: string,
    sectionId: string,
    mode: UserMode,
    workspaceId: WorkspaceId,
    date: string | undefined,
    hours: string,
) => {
    if (!userId || !projectId || !date) return;

    const userRef = getFirestoreTargetRef(userId, mode, workspaceId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;
    const data = userSnap.data();
    const sections: Section[] = data.projectsSections || [];
    const TimeCheckouts: TimeCheckout[] = data.timeCheckouts || [];
    const sectionsByDates: UpdatedSectionByDate[] = data.updatedSectionsByDates || []

    const section = sections.find(s => s.sectionId === sectionId)
    if (!section) throw new Error(sectionNotFound);


    const sectionTime = section.time

    const updatedSections = sections.filter(
        (s: Section) => s.sectionId !== sectionId
    );

    const updatedCheckouts = TimeCheckouts.filter(
        (ch: TimeCheckout) => ch.sectionId !== sectionId
    );

    const updatedSectionsByDates = sectionsByDates.filter((s: UpdatedSectionByDate) => s.sectionId !== sectionId);

    await updateUserProjectTimeData(userId, workspaceId, projectId, date, hours, "decrease")
    await updateTotalTrackedTime(userId, projectId, date, formatFloatHoursToSeconds(Number(hours)), workspaceId, "decrease")

    await updateDoc(userRef, {
        projectsSections: updatedSections,
        timeCheckouts: updatedCheckouts,
        updatedSectionsByDates: updatedSectionsByDates
    });
    await subtractProjectTotalTime(userId, projectId, sectionTime, mode, workspaceId);
};