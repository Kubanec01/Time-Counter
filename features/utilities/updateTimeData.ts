import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Section, UpdatedSectionByDate} from "@/types";


export const sendTimeData = async (
    userId: string | undefined,
    sectionId: string,
    newTime: string,
    date: string
) => {
    if (!userId) return;

    const userRef = doc(db, "realms", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;
    const data = userSnap.data();
    const sections = data.projectsSections || [];
    const sectionsByDates = data.updatedSectionsByDates || []

    const updatedSections = sections.map((s: Section) => {
        if (s.sectionId !== sectionId) return s;

        return {...s, time: newTime, updateDate: date};
    });

    const updatedSectionsByDates = sectionsByDates.map((s: UpdatedSectionByDate) => {
        if (s.sectionId !== sectionId) return s;

        return {...s, date: date}
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