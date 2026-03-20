import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Section, TimeCheckout, UpdatedSectionByDate, WorkspaceId} from "@/types";
import {sectionNotFound} from "@/messages/errors";
import {updateUserIndividualTime} from "@/features/utilities/create-&-update/updateUserIndividualTime";
import {updateTotalTrackedTime} from "@/features/utilities/edit/updateTotalTrackedTime";
import {db} from "@/app/firebase/config";
import {updateProjectTotalTime} from "@/features/utilities/time/timeOperations";


export const deleteAllSectionData = async (
    userId: string | undefined,
    projectId: string,
    sectionId: string,
    workspaceId: WorkspaceId,
    date: string | undefined,
    seconds: number,
) => {
    if (date === undefined) return console.error("date is undefined");

    const userRef = doc(db, "realms", workspaceId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;
    const data = userSnap.data();
    const sections: Section[] = data.projectsSections || [];
    const TimeCheckouts: TimeCheckout[] = data.timeCheckouts || [];
    const sectionsByDates: UpdatedSectionByDate[] = data.updatedSectionsByDates || []

    const section = sections.find(s => s.sectionId === sectionId)
    if (!section) console.error(sectionNotFound);


    const updatedSections = sections.filter(
        (s: Section) => s.sectionId !== sectionId
    );

    const updatedCheckouts = TimeCheckouts.filter(
        (ch: TimeCheckout) => ch.sectionId !== sectionId
    );

    const updatedSectionsByDates = sectionsByDates.filter((s: UpdatedSectionByDate) => s.sectionId !== sectionId);

    await updateUserIndividualTime(userId, workspaceId, projectId, date, seconds, "decrease")
    await updateTotalTrackedTime(projectId, date, seconds, workspaceId, "decrease")

    await updateDoc(userRef, {
        projectsSections: updatedSections,
        timeCheckouts: updatedCheckouts,
        updatedSectionsByDates: updatedSectionsByDates
    });
    await updateProjectTotalTime(projectId, seconds, workspaceId, "decrease")
};