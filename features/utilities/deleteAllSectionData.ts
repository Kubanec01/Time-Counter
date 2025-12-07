import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Section, TimeCheckout, UpdatedSectionByDate} from "@/types";
import {subtractProjectTotalTime} from "@/features/utilities/totalTime";
import {sectionNotFound} from "@/messages/errors";


export const deleteAllSectionData = async (userId: string | undefined, projectId: string, sectionId: string) => {
    if (!userId || !projectId) return;

    const userRef = doc(db, "realms", userId);
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


    await updateDoc(userRef, {
        projectsSections: updatedSections,
        timeCheckouts: updatedCheckouts,
        updatedSectionsByDates: updatedSectionsByDates
    });
    await subtractProjectTotalTime(userId, projectId, sectionTime)
};