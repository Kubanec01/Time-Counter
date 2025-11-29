import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Section, TimeCheckout, UpdatedSectionByDate} from "@/types";


export const deleteAllSectionData = async (userId: string | undefined, projectId: string, sectionId: string) => {
    if (!userId || !projectId) return;

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;
    const data = userSnap.data();
    const sections = data.projectsSections || [];
    const TimeCheckouts = data.timeCheckouts || [];
    const sectionsByDates = data.updatedSectionsByDates || []

    const updatedSections = sections.filter(
        (s: Section) => s.sectionId !== sectionId
    );

    const updatedCheckouts = TimeCheckouts.filter(
        (ch: TimeCheckout) => ch.sectionId !== sectionId
    );

    const updatedSectionsByDates = sectionsByDates.filter((s: UpdatedSectionByDate) => s.sectionId !== sectionId);

    await updateDoc(userRef, {projectsSections: updatedSections});
    await updateDoc(userRef, {timeCheckouts: updatedCheckouts});
    await updateDoc(userRef, {updatedSectionsByDates: updatedSectionsByDates});
};