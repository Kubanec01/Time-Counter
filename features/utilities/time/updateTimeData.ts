import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Section, UpdatedSectionByDate, WorkspaceId} from "@/types";
import {db} from "@/app/firebase/config";


export const updateTimeData = async (
    sectionId: string,
    newTime: number,
    formatedDate: string,
    workspaceId: WorkspaceId,
) => {

    const userRef = doc(db, "realms", workspaceId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;
    const data = userSnap.data();
    const sections = data.projectsSections || [];
    const sectionsByDates = data.updatedSectionsByDates || []

    const updatedSections = sections.map((s: Section) => {
        if (s.sectionId !== sectionId) return s;

        return {...s, time: newTime, updateDate: formatedDate};
    });

    const updatedSectionsByDates = sectionsByDates.map((s: UpdatedSectionByDate) => {
        if (s.sectionId !== sectionId) return s;

        return {...s, date: formatedDate}
    })

    const orderedSections = () => {
        const sections: Section[] = []

        for (let i = 0; i < updatedSections.length; i++) {

            const section = updatedSections[i];
            const condition = section.sectionId === sectionId;
            if (condition) sections.unshift(section);
            else sections.push(section);

        }

        return sections

    }

    await updateDoc(userRef, {projectsSections: orderedSections()});
    await updateDoc(userRef, {updatedSectionsByDates: updatedSectionsByDates});

};