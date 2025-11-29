import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/app/firebase/config";
import {Section, TimeCheckout} from "@/types";
import React from "react";


export const deleteSubsectionAndTimeCheckoutsData = async (
    userId: string | undefined,
    subSectionId: string,
    sectionId: string,
    updatedClockTime: string,
    setSubSections: React.Dispatch<React.SetStateAction<[] | TimeCheckout[]>>
) => {

    if (!userId) return
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;
    const data = userSnap.data();
    const timeCheckouts = data.timeCheckouts || []
    const sections = data.projectsSections || []

    const updatedCheckouts = timeCheckouts.filter((s: TimeCheckout) => s.subSectionId !== subSectionId)
    const validUpdatedCheckouts = updatedCheckouts.filter((s: TimeCheckout) => s.sectionId === sectionId)
    const updatedSections = sections.map((s: Section) => {
        if (s.sectionId !== sectionId) return s;

        return {...s, time: updatedClockTime}

    })

    await updateDoc(userRef, {timeCheckouts: updatedCheckouts});
    await updateDoc(userRef, {projectsSections: updatedSections})
    setSubSections(validUpdatedCheckouts);
}

